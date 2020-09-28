
/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2020 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2020 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         2.13.0
 */

import * as React from "react";
import PropTypes from "prop-types";
import AppContext from "./AppContext";
import {withRouter} from "react-router-dom";
import moment from "moment";
import {withActionFeedback} from "./ActionFeedbackContext";

/**
 * Context related to resources ( filter, current selections, etc.)
 */
export const ResourceWorkspaceContext = React.createContext({
  filter: {
    type: null, // Filter type
    payload: null // Filter payload
  },
  sorter: {
    propertyName: 'modified', // The name of the property to sort on
    asc: false // True if the sort must be descendant
  },
  filteredResources: [], // The current list of filtered resources
  selectedResources: [], // The current list of selected resources
  details: {
    resource: null, // The resource to focus details on
    folder: null, // The folder to focus details on
  },
  scrollTo: {
    resource: null // The resource to scroll to
  },
  onTextFilterChanged: () => {}, // Whenever the search text filter changed
  onResourceScrolled: () => {}, // Whenever one scrolled to a resource
  onAllFilterRequired: () => {}, // Whenever the filter on all is required
  onFilterTagChanged: () => {}, // Whenever the filter by tag changed
  onSorterChanged: () => {}, // Whenever the sorter changed
  onResourceSelected: {
    all: () => {}, // Whenever all the resources have been selected
    none: () => {}, // Whenever none resources have been selected
    multiple: () => {}, // Whenever a resource has been selected in a multiple mode
    range:  () => {}, // Whenever a resource has been selected in a multiple mode
    single: () => {}// Whenever a single resource has been selected
  }
});

/**
 * The related context provider
 */
class ResourceWorkspaceContextProvider extends React.Component {
  /**
   * Default constructor
   * @param props The component props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
    this.initializeProperties();
  }

  /**
   * Returns the default component state
   */
  get defaultState() {
    return {
      filter: {type: ResourceWorkspaceFilterTypes.NONE}, // The current resource search filter
      sorter: {
        propertyName: 'modified', // The name of the property to sort on
        asc: false // True if the sort must be descendant
      },
      filteredResources: [], // The current list of filtered resources
      selectedResources: [], // The current list of selected resources
      details: {
        resource: null, // The resource to focus details on
        folder: null, // The folder to focus details on
      },
      scrollTo: {
        resource: null // The resource to scroll to
      },
      onTextFilterChanged: this.handleTextFilterChange.bind(this), // Whenever the search text filter changed
      onResourceScrolled: this.handleResourceScrolled.bind(this), // Whenever one scrolled to a resource
      onAllFilterRequired: this.handleAllFilterRequired.bind(this), // filter on all required
      onFilterTagChanged: this.handleFilterTagChanged.bind(this), // filter by tag
      onSorterChanged: this.handleSorterChange.bind(this), // Whenever the sorter changed
      onResourceSelected: {
        all: this.handleAllResourcesSelected.bind(this), // Whenever all the resources have been selected
        none: this.handleNoneResourcesSelected.bind(this), // Whenever none resources have been selected
        multiple: this.handleMultipleResourcesSelected.bind(this), // Whenever a resource has been selected in a multiple mode
        range:  this.handleResourceRangeSelected.bind(this), // Whenever a resource has been selected in a multiple mode
        single: this.handleResourceSelected.bind(this)// Whenever a single resource has been selected
      }
    };
  }

  /**
   * Initialize class properties out of the state ( for performance purpose )
   */
  initializeProperties() {
    this.resources = []; // A cache of the last known list of resources from the App context
  }

  /**
   * Whenever the component is mounted
   */
  componentDidMount() {
    this.populate();
  }

  /**
   * Whenever the component has updated in terms of props or state
   * @param prevProps
   */
  async componentDidUpdate(prevProps, prevState) {
    await this.handleFilterChange(prevState.filter);
    await this.handleResourcesChange();
    await this.handleRouteChange(prevProps.location);
  }

  /**
   * Handles the resource search filter change
   */
  async handleFilterChange(previousFilter) {
    const hasFilterChanged = previousFilter !== this.state.filter;
    if (hasFilterChanged) {
      this.populate();

      // Avoid a side-effect whenever one inputs a specific resource url (it unselect the resource otherwise )
      const isNotNonePreviousFilter = previousFilter.type !== ResourceWorkspaceFilterTypes.NONE;
      if (isNotNonePreviousFilter) {
        await this.unselectAll();
      }
    }
  }

  /**
   * Handles the resource search text filter change
   * @param text The filter text
   */
  async handleTextFilterChange(text) {
    await this.search({type: ResourceWorkspaceFilterTypes.TEXT, payload: text});
    await this.detailNothing();
  }

  /**
   * Handle the resources changes
   */
  async handleResourcesChange() {
    if (this.context.resources) {
      // We check the equality of the context resources and its last known value through the resources identifiers
      const localResourcesIdsAsSet = new Set(this.resources.map(resource => resource.id));
      const areResourcesChanged = ! this.context.resources.every(resource => localResourcesIdsAsSet.has(resource.id));

      if (areResourcesChanged) {
        this.resources = this.context.resources;
        await this.search(this.state.filter);
      }
    }
  }

  /**
   * Handle the route location change
   * @param previousLocation Previous router location
   */
  async handleRouteChange(previousLocation) {
    const hasLocationChanged = this.props.location.key !== previousLocation.key;
    const isAppFirstLoad = this.state.filter.type === ResourceWorkspaceFilterTypes.NONE;
    if (hasLocationChanged || isAppFirstLoad) {
      await this.handleFolderRouteChange();
      await this.handleResourceRouteChange();
    }
  }

  /**
   * Handle the folder view route change
   * E.g. /folder/view.:filterByFolderId
   */
  async handleFolderRouteChange() {
    const folderId = this.props.match.params.filterByFolderId;
    if (folderId) {
      const folder = this.context.folders.find(folder => folder.id === folderId);
      await this.search({type: ResourceWorkspaceFilterTypes.FOLDER, payload: {folder}});
      await this.detailFolder(folder);
    }
  }

  /**
   * Handle the resource view route change
   */
  async handleResourceRouteChange() {
    const isResourceLocation = this.props.location.pathname.includes('passwords');
    const resourceId = this.props.match.params.selectedResourceId;
    if (isResourceLocation) {
      if (resourceId) { // Case of password view
        this.handleSingleResourceRouteChange(resourceId);
      } else { // Case of all and applied filters
        this.handleAllResourceRouteChange();
      }
    }
  }

  /**
   * Handle the resource view route change with a resource id
   * E.g. /passwords/view/:resourceId
   */
  async handleSingleResourceRouteChange(resourceId) {
    const resource = this.resources.find(resource => resource.id === resourceId);
    const hasNoneFilter = this.state.filter.type === ResourceWorkspaceFilterTypes.NONE;
    if (hasNoneFilter) { // Case of password view by url bar inputting
      await this.search({type: ResourceWorkspaceFilterTypes.ALL});
    }

    // If the resource does not exist, it should display an error
    if (resource) {
      await this.selectFromRoute(resource);
      await this.scrollTo(resource);
      await this.detailResource(resource);
    } else {
      this.handleUnknownResource();
    }
  }

  /**
   * Handle the resource view route change without a resource id in the path
   * E.g. /password
   */
  async handleAllResourceRouteChange() {
    const filter = (this.props.location.state && this.props.location.state.filter) || {type: ResourceWorkspaceFilterTypes.ALL};
    await this.search(filter);
    await this.detailNothing();
  }

  /**
   * Handle the filter by all is required
   */
  async handleAllFilterRequired() {
    const filter = {type: ResourceWorkspaceFilterTypes.ALL, payload: null};
    await this.search(filter);
    await this.detailNothing();
  }

  /**
   * Handle the filter by tag
   * @param tag
   */
  async handleFilterTagChanged(tag) {
    const filter = {type: ResourceWorkspaceFilterTypes.TAG, payload: {tag: tag}};
    await  this.search(filter);
    await  this.detailNothing();
  }

  /**
   * Handle an unknown resource ( passe by route parameter resource identifier )
   */
  handleUnknownResource() {
    this.props.actionFeedbackContext.displayError("The resource does not exist");
  }

  /**
   * Handle the scrolling of a resource
   */
  async handleResourceScrolled() {
    await this.scrollNothing();
  }

  /**
   * Handle the change of sorter ( on property or direction )
   * @param propertyName The name of the property to sort on
   */
  async handleSorterChange(propertyName) {
    await this.updateSorter(propertyName);
    await this.sort();
  }

  /**
   * Handle the all resource selection
   */
  async handleAllResourcesSelected() {
    await this.selectAll();
    await this.detailNothing();
  }

  /**
   * Handle the none resource selection
   */
  async handleNoneResourcesSelected() {
    await this.unselectAll();
    await this.detailNothing();
  }

  /**
   * Handle the resource selection in a multiple mode
   * @param resource The selected resource
   */
  async handleMultipleResourcesSelected(resource) {
    await this.selectMultiple(resource);
    await this.detailsResourceIfSingleSelection();
  }

  /**
   * Handle the resource selection in a range mode
   * @param resource The selected resource
   */
  async handleResourceRangeSelected(resource) {
    await this.selectRange(resource);
  }

  /**
   * Handle the single resource selection
   * @param resource The selected resource
   */
  async handleResourceSelected(resource) {
    this.select(resource);
  }

  /**
   * Populate the context with initial data such as resources and folders
   */
  populate() {
    this.context.port.request("passbolt.folders.update-local-storage");
    this.context.port.request("passbolt.resources.update-local-storage");
  }

  /** RESOURCE SEARCH  **/

  /**
   * Search for the resources which matches the given filter and sort them
   * @param filter
   */
  async search(filter) {
    const searchOperations = {
      [ResourceWorkspaceFilterTypes.ROOT_FOLDER]: this.searchByRootFolder.bind(this),
      [ResourceWorkspaceFilterTypes.FOLDER]: this.searchByFolder.bind(this),
      [ResourceWorkspaceFilterTypes.TAG]: this.searchByTag.bind(this),
      [ResourceWorkspaceFilterTypes.TEXT]: this.searchByText.bind(this),
      [ResourceWorkspaceFilterTypes.ITEMS_I_OWN]: this.searchByItemsIOwn.bind(this),
      [ResourceWorkspaceFilterTypes.FAVORITE]: this.searchByFavorite.bind(this),
      [ResourceWorkspaceFilterTypes.SHARED_WITH_ME]: this.seachBySharedWithMe.bind(this),
      [ResourceWorkspaceFilterTypes.RECENTLY_MODIFIED]: this.searchByRecentlyModified.bind(this),
      [ResourceWorkspaceFilterTypes.ALL]: this.searchAll.bind(this),
      [ResourceWorkspaceFilterTypes.NONE]: () => { /* No search */ }
    };
    await searchOperations[filter.type](filter);
    await this.sort();
  }

  /**
   * All filter ( no filter at all )
   * @param filter The All filter
   */
  async searchAll(filter) {
    await this.setState({filter, filteredResources: [...this.resources]});
  }

  /**
   * Filter the resources which belongs to the filter root folder
   */
  async searchByRootFolder(filter) {
    const folderResources = this.resources.filter(resource => ! resource.folder_parent_id);
    await this.setState({filter, filteredResources: folderResources});
  }


  /**
   * Filter the resources which belongs to the filter folder
   */
  async searchByFolder(filter) {
    const folderId = filter.payload.folder.id;
    const folderResources = this.resources.filter(resource => resource.folder_parent_id === folderId);
    await this.setState({filter, filteredResources: folderResources});
  }

  /**
   * Filter the resources which belongs to the filter tag
   */
  async searchByTag(filter) {
    const tagId = filter.payload.tag.id;
    const tagResources = this.resources.filter(resource => resource.tags && resource.tags.length > 0 && resource.tags.filter(tag => tag.id === tagId).length > 0);
    await this.setState({filter, filteredResources: tagResources});
  }

  /**
   * Filter the resources which textual properties matched some user text words
   * @param filter A textual filter
   */
  async searchByText(filter) {
    const text = filter.payload;
    const words =  (text && text.split(/\s+/)) || [''];

    // Test match of some escaped test words against the name / usernmae / uri / description /tags resource properties
    const escapeWord = word =>  word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const wordToRegex = word =>  new RegExp(escapeWord(word), 'i');
    const matchSomeWords = value => words.some(word => wordToRegex(word).test(value));

    const matchSomeTagProperty = resource => resource.tags.some(tag => matchSomeWords(tag.slug));
    const matchSomeTextualProperty = resource => ['name', 'username', 'uri', 'description'].some(key => matchSomeWords(resource[key]));
    const matchText = resource => matchSomeTextualProperty(resource) || matchSomeTagProperty(resource);

    const filteredResources = this.resources.filter(matchText);
    await this.setState({filter, filteredResources});
  }

  /**
   * Search for current user personal resources
   * @param filter The filter
   */
  async searchByItemsIOwn(filter) {
    const filteredResources = this.resources.filter(resource => resource.permission.type === 15);
    await this.setState({filter, filteredResources});
  }
  /**
   * Filter the resources which are the current user favorites one
   */
  async searchByFavorite(filter) {
    const filteredResources = this.resources.filter(resource => resource.favorite !== null);
    await this.setState({filter, filteredResources});
  }

  /**
   * Filter the resources which are shared wit the current user
   */
  async seachBySharedWithMe(filter) {
    const filteredResources = this.resources.filter(resource => resource.permission.type < 15);
    await this.setState({filter, filteredResources});
  }
  /**
   * Keep the most recently modified resources ( current state: just sort everything with the most recent modified resource )
   * @param filter A recently modified filter
   */
  async searchByRecentlyModified(filter) {
    const recentlyModifiedSorter = (resource1, resource2) => moment(resource2.modified).diff(moment(resource1.modified));
    const filteredResources = this.resources.sort(recentlyModifiedSorter);
    await this.setState({filter, filteredResources});
  }

  /** RESOURCE SELECTION */

  /**
   * Select the given resource as the single selected resources if not already selected as single. Otherwise unselect it
   * @param resource The resource to select
   */
  async select(resource) {
    const mustUnselect = this.state.selectedResources.length === 1 && this.state.selectedResources[0].id === resource.id;
    await this.setState({selectedResources: mustUnselect ? [] : [resource]});
    this.redirectAfterSelection();
  }

  /**
   * Selects the given resource when one comes from the navigation route
   * @param resource
   * @returns {Promise<void>}
   */
  async selectFromRoute(resource) {
    const selectedResources = [resource];
    await this.setState({selectedResources});
  }

  /**
   * Select the given resource in a multiple selection mode
   * @param resource
   * @returns {Promise<void>}
   */
  async selectMultiple(resource) {
    const hasNotSameId = selectedResource => selectedResource.id !== resource.id;
    const selectionWithoutResource = this.state.selectedResources.filter(hasNotSameId);
    const mustUnselect = this.state.selectedResources.length !== selectionWithoutResource.length;
    const selectedResources = mustUnselect ? selectionWithoutResource : [...this.state.selectedResources, resource];

    await this.setState({selectedResources});
    this.redirectAfterSelection();
  }

  /**
   * Select the given resource in a range selection mode
   * @param resource
   * @returns {Promise<void>}
   */
  async selectRange(resource) {
    const hasNoSelection = this.state.selectedResources.length === 0;

    if (hasNoSelection) {
      this.select(resource);
    } else {
      const hasSameId = resource => selectedResource => selectedResource.id === resource.id;
      const findIndex = resource => this.state.filteredResources.findIndex(hasSameId(resource));
      const startRangeIndex = findIndex(this.state.selectedResources[0]);
      const endRangeIndex = findIndex(resource);

      let selectedResources;
      if (startRangeIndex > endRangeIndex) { // Down range selection
        selectedResources = this.state.filteredResources.slice(endRangeIndex, startRangeIndex + 1).reverse();
      } else { // Up range selection
        selectedResources = this.state.filteredResources.slice(startRangeIndex, endRangeIndex + 1);
      }

      await this.setState({selectedResources});
      this.redirectAfterSelection();
    }
  }

  /**
   * Select all the resources
   */
  async selectAll() {
    await this.setState({selectedResources: [...this.state.filteredResources]});
    this.redirectAfterSelection();
  }

  /**
   * Unselect all the resources
   */
  async unselectAll() {
    await this.setState({selectedResources: []});
    this.redirectAfterSelection();
  }

  /**
   * Navigate to the appropriate url after some resources selection operation
   */
  redirectAfterSelection() {
    const hasSingleSelectionNow = this.state.selectedResources.length === 1;
    if (hasSingleSelectionNow) { // Case of single selected resource
      this.props.history.push(`/app/passwords/view/${this.state.selectedResources[0].id}`);
    } else { // Case of multiple selected resources
      const filter = this.state.filter;
      this.props.history.push({pathname: `/app/passwords`, state: {filter}});
    }
  }


  /** Resource Sorter **/

  /**
   * Update the resourcces sorter given a property name
   * @param propertyName
   */
  async updateSorter(propertyName) {
    const hasSortPropertyChanged = this.state.sorter.propertyName !== propertyName;
    const asc = hasSortPropertyChanged  || !this.state.sorter.asc;
    const sorter = {propertyName, asc};
    await this.setState({sorter});
  }

  /**
   * Sort the resources given the current sorter
   */
  async sort() {
    const reverseSorter = sorter => (s1, s2) => -sorter(s1, s2);
    const baseSorter =  sorter => this.state.sorter.asc ? sorter : reverseSorter(sorter);
    const keySorter = (key, sorter) => baseSorter((s1, s2) => sorter(s1[key], s2[key]));
    const dateSorter = (d1, d2) => moment(d1).diff(moment(d2));
    const stringSorter = (s1, s2) => s1.localeCompare(s2);
    const sorter = this.state.sorter.propertyName === 'modified' ? dateSorter : stringSorter;
    const propertySorter = keySorter(this.state.sorter.propertyName, sorter);
    await this.setState({filteredResources: this.state.filteredResources.sort(propertySorter)});
  }

  /** RESOURCE DETAILS  **/

  /**
   * Set the details focus on the given folder
   * @param folder The folder to focus on
   */
  async detailFolder(folder) {
    await this.setState({details: {folder: folder, resource: null}});
  }

  /**
   * Set the details focus on the given resource
   * @param resource The resource to focus on
   */
  async detailResource(resource) {
    await this.setState({details: {folder: null, resource: resource}});
  }

  /**
   * Remove the details on something
   */
  async detailNothing() {
    await this.setState({details: {folder: null, resource: null}});
  }

  /**
   * Set the details focus on the selected resource if it's the only one selected
   * @returns {Promise<void>}
   */
  async detailsResourceIfSingleSelection() {
    const hasSingleSelection = this.state.selectedResources.length == 1;
    if (hasSingleSelection) {
      await this.detailResource(this.state.selectedResources[0]);
    } else {
      await this.detailNothing();
    }
  }

  /** Resource scrolling **/

  /**
   * Set the resource to scroll to
   * @param resource A resource
   */
  async scrollTo(resource) {
    await this.setState({scrollTo: {resource}});
  }

  /**
   * Unset the resource to scroll to
   */
  async scrollNothing() {
    await this.setState({scrollTo: {}});
  }

  /**
   * Render the component
   * @returns {JSX}
   */
  render() {
    return (
      <ResourceWorkspaceContext.Provider value={this.state}>
        {this.props.children}
      </ResourceWorkspaceContext.Provider>
    );
  }
}
ResourceWorkspaceContextProvider.displayName = 'ResourceWorkspaceContextProvider';
ResourceWorkspaceContextProvider.contextType = AppContext;
ResourceWorkspaceContextProvider.propTypes = {
  children: PropTypes.any,
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  actionFeedbackContext: PropTypes.object
};

export default withActionFeedback(withRouter(ResourceWorkspaceContextProvider));

/**
 * Resource Workspace Context Consumer HOC
 * @param WrappedComponent
 */
export function withResourceWorkspace(WrappedComponent) {
  return class WithResourceWorkspace extends React.Component {
    render() {
      return (
        <ResourceWorkspaceContext.Consumer>
          {
            ResourceWorkspaceContext => <WrappedComponent resourceWorkspaceContext={ResourceWorkspaceContext} {...this.props} />
          }
        </ResourceWorkspaceContext.Consumer>
      );
    }
  };
}

/**
 * The list of resource workspace search filter types
 */
export const ResourceWorkspaceFilterTypes = {
  NONE: 'NONE', // Initial filter at page load
  ALL: 'ALL', // All resources
  FOLDER: 'FILTER-BY-FOLDER', // Resources for a given folder
  ROOT_FOLDER: 'FILTER-BY-ROOT-FOLDER', // Resources of the root folder
  TAG: 'FILTER-BY-TAG', // Resources for a given tag
  TEXT: 'FILTER-BY-TEXT-SEARCH', // Resources matching some text words
  ITEMS_I_OWN: 'FILTER-BY-ITEMS-I-OWN', // Current user personal resources
  FAVORITE: 'FILTER-BY-FAVORITE', // Favorite resources filter
  SHARED_WITH_ME: 'FILTER-BY-SHARED-WITH-ME', // Shared with current user resources
  RECENTLY_MODIFIED: 'FILTER-BY-RECENTLY-MODIFIERD', // Keep recently modified resources
};