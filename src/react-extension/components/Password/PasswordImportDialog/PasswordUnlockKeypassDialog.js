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
 * @since         2.14.0
 */

import React, {Component} from "react";
import PropTypes from "prop-types";
import AppContext from "../../../contexts/AppContext";
import {withActionFeedback} from "../../../contexts/ActionFeedbackContext";
import {withDialog} from "../../../../react/contexts/Common/DialogContext";
import DialogWrapper from "../../../../react/components/Common/Dialog/DialogWrapper/DialogWrapper";
import FormSubmitButton from "../../../../react/components/Common/Inputs/FormSubmitButton/FormSubmitButton";
import FormCancelButton from "../../../../react/components/Common/Inputs/FormSubmitButton/FormCancelButton";
import Icon from "../../../../react/components/Common/Icons/Icon";
import {withResourceWorkspace} from "../../../contexts/ResourceWorkspaceContext";
import PasswordImportResultDialog from "./PasswordImportResultDialog";
import ErrorDialog from "../../Dialog/ErrorDialog/ErrorDialog";

/**
 * This component is the second step of the import dialog when the file to import is KDB(X) file
 */
class PasswordUnlockKeypassDialog extends Component {
  /**
   * Default constructor
   * @param props Component props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
    this.bindHandlers();
    this.createReferences();
  }

  /**
   * Returns the default component state
   */
  get defaultState() {
    return {
      // Dialog states
      processing: false,

      showPassword: false, // True if the password should be textually displayed
      keyFile: null, // The optional key file
      errors: {} // The import errors
    };
  }

  /**
   * Bind component handlers
   */
  bindHandlers() {
    this.handleSelectFile = this.handleSelectFile.bind(this);
    this.handleFileSelected = this.handleFileSelected.bind(this);
    this.handlePasswordViewToggled = this.handlePasswordViewToggled.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Create elements references
   */
  createReferences() {
    this.fileUploaderRef = React.createRef();
    this.passwordInputRef = React.createRef();
  }

  /**
   * Returns the selected file's name
   */
  get selectedFilename() {
    return this.state.keyFile ? this.state.keyFile.name : '';
  }

  /**
   * Returns the current file to import
   */
  get fileToImport() {
    return this.props.resourceWorkspaceContext.resourceFileToImport;
  }

  /**
   * Handle the password view mode toggle
   */
  async handlePasswordViewToggled() {
    await this.setState({showPassword: !this.state.showPassword});
  }

  /**
   * Handle the selection of a file by file explorer
   */
  handleSelectFile() {
    this.fileUploaderRef.current.click();
  }

  /**
   * Handle the event that a file has been selected
   * @param event A dom event
   */
  async handleFileSelected(event) {
    const [keyFile] = event.target.files;
    await this.setState({keyFile});
  }

  /**
   * Handle the cancellation of the import
   */
  handleCancel() {
    this.props.resourceWorkspaceContext.onResourceFileToImport(null);
    this.close();
  }

  /**
   * Handle the import submit event
   * @param event A dom event
   */
  async handleSubmit(event) {
    event.preventDefault();

    if (!this.state.processing) {
      this.import();
    }
  }

  /**
   * Read the selected file and returns its content in a base 64
   * @return {Promise<string>}
   */
  readFile() {
    if (!this.state.keyFile) {
      return;
    }

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = event => {
        try {
          const base64Url = event.target.result;
          const fileBase64 = base64Url.split(",")[1];
          resolve(fileBase64);
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsDataURL(this.state.keyFile);
    });
  }

  /**
   * Import the resource file
   */
  async import() {
    const resourceFileToImport = this.fileToImport;
    const b64FileContent = resourceFileToImport.b64FileContent;
    const fileType = resourceFileToImport.fileType;
    const password = this.passwordInputRef.current.value;
    const keyfile = await this.readFile();
    const options = Object.assign({}, resourceFileToImport.options, {credentials: {password, keyfile}});

    this.toggleProcessing();
    await this.resetValidation();
    try {
      const result = await this.context.port.request("passbolt.import-resources.import-file", fileType, b64FileContent, options);
      this.handleImportSuccess(result);
    } catch (error) {
      this.handleImportError(error);
    }
  }

  /**
   * Reset the validation process
   */
  async resetValidation() {
    await this.setState({errors: {}});
  }

  /**
   * Handle the success of the KDBX import
   * @parama importResult The import result
   */
  async handleImportSuccess(importResult) {
    await this.props.resourceWorkspaceContext.onResourceFileImportResult(importResult);
    await this.props.resourceWorkspaceContext.onResourceFileToImport(null);
    await this.props.dialogContext.open(PasswordImportResultDialog);
    this.close();
  }

  /**
   * Handle the failure of the KDBX import
   * @param error The import error
   */
  async handleImportError(error) {
    const userAbortsOperation = error.name === "UserAbortsOperationError";
    const isInvalidPasswordOrKeyFile = error.code === "InvalidKey" || error.code === "InvalidArg";

    this.toggleProcessing();

    if (userAbortsOperation) {
      // If the user aborts the operation, then do nothing. It happens when the users close the passphrase dialog
    } else if (isInvalidPasswordOrKeyFile) {
      // If the credentials are invalid.
      await this.setState({errors: {invalidPasswordOrKeyfile: true}});
    } else {
      // If an unexpected error occurred.
      const errorDialogProps = {
        title: "There was an unexpected error...",
        message: error.message
      };
      this.context.setContext({errorDialogProps});
      this.props.dialogContext.open(ErrorDialog);
    }
  }

  /**
   * Close the dialog
   */
  close() {
    this.props.onClose();
  }

  /**
   * Toggle processing state
   * @returns {Promise<void>}
   */
  async toggleProcessing() {
    const prev = this.state.processing;
    return this.setState({processing: !prev});
  }

  /**
   * Should input be disabled? True if state is processing
   * @returns {boolean}
   */
  hasAllInputDisabled() {
    return this.state.processing;
  }

  /**
   * Render the component
   */
  render() {
    const errors = this.state.errors;
    const isInvalidPasswordOrKeyFile = errors && errors.invalidPasswordOrKeyfile;
    return (
      <DialogWrapper
        title="Enter the password and/or key file"
        className="import-password-dialog"
        disabled={this.hasAllInputDisabled()}
        onClose={this.handleCancel}>
        <form onSubmit={this.handleSubmit}>

          <div className="form-content">

            <div className="input-password-wrapper">
              <label htmlFor="import-password-dialog-password">Keepass password</label>
              <div className="input password">
                <input
                  id="import-password-dialog-password"
                  type={this.state.showPassword ? "text" : "password"}
                  disabled={this.hasAllInputDisabled()}
                  placeholder="Passphrase"
                  ref={this.passwordInputRef}/>
              </div>
              <ul className="actions inline">
                <li>
                  <a
                    onClick={this.handlePasswordViewToggled}
                    className={`password-view button button-icon toggle ${this.state.showPassword ? "selected" : ""} ${this.hasAllInputDisabled() ? "disabled" : ""}`}>
                    <Icon name='eye-open' big={true}/>
                    <span className="visually-hidden">view</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="input-file-chooser-wrapper">
              <input
                type="file"
                ref={this.fileUploaderRef}
                onChange={this.handleFileSelected}/>
              <div className="input text">
                <label>Keepass key file (optional)</label>
                <input
                  type="text"
                  placeholder="No key file selected"
                  disabled
                  value={this.selectedFilename}/>
                <a
                  className={`button primary ${this.hasAllInputDisabled() ? "disabled" : ""}`}
                  onClick={this.handleSelectFile}>
                  <Icon name="upload-a"/> Choose a file
                </a>
              </div>
            </div>

            {isInvalidPasswordOrKeyFile &&
            <div className="message ready error">
              Cannot decrypt the file, invalid credentials.
            </div>
            }
          </div>

          <div className="submit-wrapper clearfix">
            <FormSubmitButton
              value="Continue import"
              disabled={this.hasAllInputDisabled()}
              processing={this.state.processing}/>
            <FormCancelButton
              disabled={this.hasAllInputDisabled()}
              onClick={this.handleCancel}/>
          </div>
        </form>
      </DialogWrapper>
    );
  }
}

PasswordUnlockKeypassDialog.contextType = AppContext;

PasswordUnlockKeypassDialog.propTypes = {
  onClose: PropTypes.func,
  actionFeedbackContext: PropTypes.any, // The action feedback context
  dialogContext: PropTypes.any, // The dialog context
  resourceWorkspaceContext: PropTypes.any // The resource workspace context
};

export default withResourceWorkspace(withActionFeedback(withDialog(PasswordUnlockKeypassDialog)));