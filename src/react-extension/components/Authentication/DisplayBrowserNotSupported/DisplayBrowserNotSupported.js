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
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withAppContext } from "../../../contexts/AppContext";
import { Trans, withTranslation } from "react-i18next";
import {
  CHROME_ARBISOFT_STORE_BROWSER_EXTENSION_URL,
  CHROME_EDLY_STORE_BROWSER_EXTENSION_URL,
  FIREFOX_STORE_BROWSER_EXTENSION_URL,
} from "../InstallExtension/InstallExtension";

class DisplayBrowserNotSupported extends Component {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
  }

  /**
   * Returns the default component state
   */
  getDefaultState() {
    return {
      //we should always have a browser selected in the list, so by default the first one in the list is selected
      selectedBrowser: this.compatibleBrowserList[0],
    };
  }

  handleBrowserButtonClick(browserInfo) {
    this.setState({
      selectedBrowser: browserInfo,
    });
  }

  /**
   * Returns the list of compatible browsers and their associated information.
   * @returns {Array<object>}
   */
  get compatibleBrowserList() {
    return [
      {
        name: "Mozilla Firefox",
        img: "firefox.svg",
        url: "https://www.mozilla.org/",
      },
      {
        name: "Google Chrome",
        img: "chrome.svg",
        url: "https://www.google.com/chrome/",
      },
      {
        name: "Microsoft Edge",
        img: "edge.svg",
        url: "https://www.microsoft.com/edge",
      },
      {
        name: "Brave",
        img: "brave.svg",
        url: "https://www.brave.com/",
      },
      {
        name: "Vivaldi",
        img: "vivaldi.svg",
        url: "https://www.vivaldi.com/",
      },
    ];
  }
  /**
   * Render the component
   * @returns {JSX}
   */
  render() {
    return (
      <div className="browser-not-supported">
        <h1>
          <Trans>Sorry, your browser is not supported.</Trans>
        </h1>
        <p>
          <Trans>
            Please download one of these browsers to get started with passbolt:
          </Trans>
        </p>
        <div className="browser-button-list">
          {this.compatibleBrowserList.map((browserInfo, key) => (
            <button
              key={key}
              className={`browser${
                browserInfo.name === this.state.selectedBrowser.name
                  ? " focused"
                  : ""
              }`}
              target="_blank"
              onClick={() => this.handleBrowserButtonClick(browserInfo)}
            >
              <img
                src={`${this.props.context.trustedDomain}/img/third_party/${browserInfo.img}`}
              />
            </button>
          ))}
        </div>
        <div className="form-actions">
          <a
            href={this.state.selectedBrowser.url}
            rel="noopener noreferrer"
            className="button primary big full-width"
            role="button"
            target="_blank"
          >
            <Trans>
              Download {{ browserName: this.state.selectedBrowser.name }}
            </Trans>
          </a>
        </div>
        <div>
          <br />
          <p>
            If you think you&apos;re seeing this page by mistake, please
            download and install extension for chromium based browsers using the
            following links.
          </p>
          <div className="form-actions">
            <a
              href={CHROME_ARBISOFT_STORE_BROWSER_EXTENSION_URL}
              rel="noopener noreferrer"
              className="button primary big full-width"
              role="button"
              target="_blank"
            >
              <Trans>Chromium Extension for Arbisoft</Trans>
            </a>
          </div>
          <div className="form-actions">
            <a
              href={CHROME_EDLY_STORE_BROWSER_EXTENSION_URL}
              rel="noopener noreferrer"
              className="button primary big full-width"
              role="button"
              target="_blank"
            >
              <Trans>Chromium Extension for Edly</Trans>
            </a>
            <br />
            <p> OR Install Extension for firefox using the following link </p>
            <a
              href={FIREFOX_STORE_BROWSER_EXTENSION_URL}
              rel="noopener noreferrer"
              className="button primary big full-width"
              role="button"
              target="_blank"
            >
              <Trans>Firefox Extension</Trans>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

DisplayBrowserNotSupported.propTypes = {
  context: PropTypes.any, // The application context
};
export default withAppContext(
  withTranslation("common")(DisplayBrowserNotSupported)
);
