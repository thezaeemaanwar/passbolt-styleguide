/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         2.13.0
 */
import React from "react";
import PropTypes from "prop-types";
import TagItemViewer from "./TagItemViewer";
import TagEditor from "./TagEditor";
import Icon from "../../Common/Icons/Icon";

class PasswordSidebarTagSection extends React.Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
    this.bindCallbacks();
  }

  /**
   * Get default state
   * @returns {*}
   */
  getDefaultState() {
    return {
      open: false,
      showTagEditor: false
    };
  }

  /**
   * Bind callbacks methods
   */
  bindCallbacks() {
    this.handleTitleClickEvent = this.handleTitleClickEvent.bind(this);
    this.toggleInputTagEditor = this.toggleInputTagEditor.bind(this);
  }

  /**
   * Handle when the user selects the folder parent.
   */
  handleTitleClickEvent() {
    const open = !this.state.open;
    this.setState({open});
  }

  /**
   * Display or not the input tag editor
   */
  toggleInputTagEditor() {
    const showTagEditor = !this.state.showTagEditor;
    this.setState({showTagEditor});
  }

  /**
   * Render the component
   * @returns {JSX}
   */
  render() {
    const hasResource = this.props.resource;
    const isOwner =  hasResource && this.props.resource.permission.type === 15;
    const tags = hasResource && this.props.resource.tags;

    return (
      <div className={`detailed-information accordion sidebar-section ${this.state.open ? "" : "closed"}`}>
        <div className="accordion-header">
          <h4><a onClick={this.handleTitleClickEvent} role="button">Tags</a></h4>
        </div>
        <div className="accordion-content">
          <a className="edit_tags_button section-action" onClick={this.toggleInputTagEditor}>
            <Icon name="edit"></Icon>
            <span className="visuallyhidden">edit</span>
          </a>

          {!this.state.showTagEditor &&
          <TagItemViewer
            tags={tags}
            toggleInputTagEditor={this.toggleInputTagEditor}/>
          }

          {this.state.showTagEditor &&
          <TagEditor
            tags={tags}
            isOwner={isOwner}
            toggleInputTagEditor={this.toggleInputTagEditor}
            resourceId={this.props.resource.id}/>
          }

        </div>
      </div>
    );
  }
}

PasswordSidebarTagSection.propTypes = {
  resource: PropTypes.object,
};

export default PasswordSidebarTagSection;