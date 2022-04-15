/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.6.0
 */

import React, {Component} from "react";
import PropTypes from "prop-types";
import {Trans, withTranslation} from "react-i18next";
import {withAppContext} from "../../../contexts/AppContext";
import {
  AuthenticationAccountRecoveryWorkflowStates,
  withAuthenticationAccountRecoveryContext
} from "../../../contexts/Authentication/AuthenticationAccountRecoveryContext";
import LoadingSpinner from "../../Common/Loading/LoadingSpinner/LoadingSpinner";
import DisplayUnexpectedError from "../../Authentication/DisplayUnexpectedError/DisplayUnexpectedError";
import Login, {LoginVariations} from "../../AuthenticationLogin/Login/Login";

/**
 * The component orchestrates the recover authentication process
 */
class OrchestrateAccountRecovery extends Component {
  /**
   * Render the component
   */
  render() {
    switch (this.props.authenticationAccountRecoveryContext.state) {
      case AuthenticationAccountRecoveryWorkflowStates.VERIFY_PASSPHRASE:
        return <Login
          displayAs={LoginVariations.ACCOUNT_RECOVERY}
          canRememberMe={this.props.context.siteSettings.hasRememberMeUntilILogoutOption}
          account={this.props.authenticationAccountRecoveryContext.account}
          onSignIn={this.props.authenticationAccountRecoveryContext.complete}
          onCheckPassphrase={this.props.authenticationAccountRecoveryContext.verifyPassphrase}
          // onSecondaryActionClick={this.props.authenticationLoginContext.handleSwitchAccount}
        />;
      case AuthenticationAccountRecoveryWorkflowStates.RECOVERING_ACCOUNT:
        return <LoadingSpinner
          title={<Trans>Recovering your account, please wait.</Trans>}
        />;
      case AuthenticationAccountRecoveryWorkflowStates.SIGNING_IN:
        return <LoadingSpinner
          title={<Trans>Signing in, please wait.</Trans>}
        />;
      case AuthenticationAccountRecoveryWorkflowStates.UNEXPECTED_ERROR:
        return <DisplayUnexpectedError
          error={this.props.authenticationAccountRecoveryContext.error}
        />;
      case AuthenticationAccountRecoveryWorkflowStates.LOADING:
        return <LoadingSpinner/>;
    }
  }
}

OrchestrateAccountRecovery.propTypes = {
  context: PropTypes.any, // The application context
  authenticationAccountRecoveryContext: PropTypes.any.isRequired, // The authentication account recovery context
};

export default withAppContext(withAuthenticationAccountRecoveryContext(withTranslation('common')(OrchestrateAccountRecovery)));