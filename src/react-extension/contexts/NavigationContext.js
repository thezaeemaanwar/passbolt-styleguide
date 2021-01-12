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
 * @since         3.0.0
 */
import * as React from "react";
import PropTypes from "prop-types";
import {withAppContext} from "./AppContext";
import {withRouter} from "react-router-dom";

/**
 * Context related to application navigation.
 */
export const NavigationContext = React.createContext({
  // Administration
  onGoToAdministrationRequested: () => {
  }, // Whenever the users wants to navigate to the administration workspace
  // Passwords
  onGoToPasswordsRequested: () => {
  }, // Whenever the user wants to navigate to the passwords workspace
  // Users
  onGoToUsersRequested: () => {
  }, // Whenever the user wants to navigate to the users workspace
  // User settings
  onGoToUserSettingsProfileRequested: () => {
  }, // Whenever the user wants to navigate to the users settings workspace profile section.
  onGoToUserSettingsThemeRequested: () => {
  }, // Whenever the user wants to navigate to the users settings workspace theme section.
  onGoToUserSettingsMfaRequested: () => {
  }, // Whenever the user wants to navigate to the users settings workspace mfa section.
  onGoToUserSettingsKeysRequested: () => {
  }, // Whenever the user wants to navigate to the users settings workspace keys section.
});

/**
 * The navigation context provider provider
 */
class NavigationContextProvider extends React.Component {
  /**
   * Default constructor
   * @param props The component props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  /**
   * Returns the default component state
   */
  get defaultState() {
    return {
      // Administration
      onGoToAdministrationRequested: this.onGoToAdministrationRequested.bind(this), // Whenever the user wants to navigate to the administration workspace
      // Passwords
      onGoToPasswordsRequested: this.onGoToPasswordsRequested.bind(this), // Whenever the user wants to navigate to the passwords workspace
      // Users
      onGoToUsersRequested: this.onGoToUsersRequested.bind(this), // Whenever the user wants to navigate to the users workspace
      // User settings
      onGoToUserSettingsProfileRequested: this.onGoToUserSettingsProfileRequested.bind(this), // Whenever the user wants to navigate to the users settings workspace profile section.
      onGoToUserSettingsThemeRequested: this.onGoToUserSettingsThemeRequested.bind(this), // Whenever the user wants to navigate to the users settings workspace theme section.
      onGoToUserSettingsMfaRequested: this.onGoToUserSettingsMfaRequested.bind(this), // Whenever the user wants to navigate to the users settings workspace mfa section.
      onGoToUserSettingsKeysRequested: this.onGoToUserSettingsKeysRequested.bind(this), // Whenever the user wants to navigate to the users settings workspace keys section.
    };
  }

  /**
   *
   * @param appName
   * @param pathname
   * @returns {Promise<void>}
   */
  async goTo(appName, pathname) {
    if (appName === this.props.context.name) {
      await this.props.history.push({pathname});
    } else {
      const trustedDomain = this.props.context.userSettings ? this.props.context.userSettings.getTrustedDomain() : this.props.context.trustedDomain;
      const url = `${trustedDomain}${pathname}`;
      window.open(url, '_parent', 'noopener,noreferrer');
    }
  }

  /*
   * =============================================================
   *  Administration navigation
   * =============================================================
   */

  /**
   * Whenever the user wants to navigate to the administration workspace.
   * @returns {Promise<void>}
   */
  async onGoToAdministrationRequested() {
    let pathname = "/app/administration/email-notification";
    if (this.isMfaEnabled) {
      pathname = "/app/administration/mfa";
    } else if (this.isUserDirectoryEnabled) {
      pathname = "/app/administration/users-directory";
    }
    await this.goTo("api", pathname);
  }

  /**
   * Returns true if the user has the MFA capability
   * @returns {boolean}
   */
  get isMfaEnabled() {
    const siteSettings = this.props.context.siteSettings;
    return siteSettings && siteSettings.canIUse('multiFactorAuthentication');
  }

  /**
   * Returns true if the user has the user directory capability
   * @returns {boolean}
   */
  get isUserDirectoryEnabled() {
    const siteSettings = this.props.context.siteSettings;
    return siteSettings && siteSettings.canIUse('directorySync');
  }

  /*
   * =============================================================
   *  Passwords navigation
   * =============================================================
   */

  /**
   * Whenever the user wants to navigate to the passwords workspace.
   * @returns {Promise<void>}
   */
  async onGoToPasswordsRequested() {
    await this.goTo("browser-extension", "/app/passwords");
  }

  /*
   * =============================================================
   *  Users navigation
   * =============================================================
   */

  /**
   * Whenever the user wants to navigate to the users workspace.
   * @returns {Promise<void>}
   */
  async onGoToUsersRequested() {
    await this.goTo("browser-extension", "/app/users");
  }

  /*
   * =============================================================
   *  User settings navigation
   * =============================================================
   */

  /**
   * Whenever the user wants to navigate to the users settings workspace profile section.
   * @returns {Promise<void>}
   */
  async onGoToUserSettingsProfileRequested() {
    await this.goTo("browser-extension", "/app/settings/profile");
  }

  /**
   * Whenever the user wants to navigate to the users settings workspace theme section.
   * @returns {Promise<void>}
   */
  async onGoToUserSettingsThemeRequested() {
    await this.goTo("browser-extension", "/app/settings/theme");
  }

  /**
   * Whenever the user wants to navigate to the users settings workspace mfa section.
   * @returns {Promise<void>}
   */
  async onGoToUserSettingsMfaRequested() {
    await this.goTo("api", "/app/settings/mfa");
  }

  /**
   * Whenever the user wants to navigate to the users settings workspace keys section.
   * @returns {Promise<void>}
   */
  async onGoToUserSettingsKeysRequested() {
    await this.goTo("browser-extension", "/app/settings/keys");
  }

  /**
   * Render the component
   * @returns {JSX}
   */
  render() {
    return (
      <NavigationContext.Provider value={this.state}>
        {this.props.children}
      </NavigationContext.Provider>
    );
  }
}

NavigationContextProvider.displayName = 'NavigationContextProvider';
NavigationContextProvider.propTypes = {
  context: PropTypes.object, // The application context
  children: PropTypes.any, // The component children
  location: PropTypes.object, // The router location
  match: PropTypes.object, // The router match helper
  history: PropTypes.object, // The router history
};

export default withRouter(withAppContext(NavigationContextProvider));

/**
 * Navigation Context Consumer HOC
 * @param WrappedComponent
 */
export function withNavigationContext(WrappedComponent) {
  return class WithAdministrationWorkspace extends React.Component {
    render() {
      return (
        <NavigationContext.Consumer>
          {
            navigationContext => <WrappedComponent navigationContext={navigationContext} {...this.props} />
          }
        </NavigationContext.Consumer>
      );
    }
  };
}
