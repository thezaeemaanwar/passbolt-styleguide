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
 * @since        3.0.0
 */
import React, {Component} from "react";
import PropTypes from "prop-types";

class InsertRecoverAuthenticationIframe extends Component {
  constructor(props) {
    super(props);
    this.createRefs();
  }

  componentDidMount() {
    this.loadIframe();
  }

  createRefs() {
    this.iframeRef = React.createRef();
  }

  /**
   * Load the react app iframe
   * @returns {void}
   */
  loadIframe() {
    const iframeUrl = `${this.props.browserExtensionUrl}webAccessibleResources/passbolt-iframe-recover.html?passbolt=passbolt-iframe-recover`;
    this.iframeRef.current.contentWindow.location = iframeUrl;
  }

  /**
   * Render the component
   * @return {JSX}
   */
  render() {
    return (
      <iframe id="passbolt-iframe-recover" ref={this.iframeRef} className="full-screen"/>
    );
  }
}

InsertRecoverAuthenticationIframe.propTypes = {
  browserExtensionUrl: PropTypes.string, // The browser extension url
};

export default InsertRecoverAuthenticationIframe;
