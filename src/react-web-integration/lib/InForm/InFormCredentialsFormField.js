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
 * @since         3.4.0
 *
 */

import InFormCallToActionField from "./InFormCallToActionField";
import DomUtils from "../Dom/DomUtils";
import {v4 as uuidv4} from "uuid";

/**
 * An InFormCredentialsFormField is represented by a DOM element identified as credentials form DOM element which once filled
 * can be auto-saved by Passbolt
 */
class InFormCredentialsFormField {
  /** Button submit select */
  static SUBMIT_BUTTON_SELECTOR = "button[type='submit'], input[type='submit']"
  /**
   * Retrieve all the DOM elements which can be an credentials form fields
   */
  static findAll() {
    const domFields =  Array.from(document.querySelectorAll('form'));
    const iframesFields = InFormCallToActionField.findAllInIframes();
    return domFields.concat(iframesFields);
  }

  /**
   * Retrieve all the iframes elements which can be an credential form field
   * @return {*}
   */
  static findAllInIframes() {
    const iframes = DomUtils.getAccessibleAndSameDomainIframes();
    const queryMapper = iframe => Array.from(iframe.contentDocument.querySelectorAll('form'));
    return iframes
      .map(queryMapper)
      .flat();
  }

  /** The field to which the in-form is attached */
  field;

  /** The username field attached to the form */
  usernameField;

  /** The password field attached to the form */
  passwordField;

  /** Flag telling whether the form submission has already been performed (and avoid twice autosave call) */
  hasAlreadySubmitted;

  /**
   * Default constructor
   * @param field The DOM field which represents the field
   * @param usernameField The username DOM field into the form
   * @param passwordField The password DOM field into the form
   */
  constructor(field, usernameField, passwordField) {
    this.field = field;
    this.usernameField = usernameField;
    this.passwordField = passwordField;
    this.hasAlreadySubmitted = false;
    this.bindCallbacks();
  }

  /**
   * Returns the submit button (if exists)
   */
  get submitButton() {
    return this.field.querySelector(InFormCredentialsFormField.SUBMIT_BUTTON_SELECTOR);
  }

  /**
   * Binds methods callbacks
   */
  bindCallbacks() {
    this.handleAutoSaveEvent = this.handleAutoSaveEvent.bind(this);
    this.autosave = this.autosave.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  /**
   * Whenever one must propose auto-save on the current credentials form
   * @param callback Callback when the auto-save should be performed
   */
  handleAutoSaveEvent() {
    this.field.addEventListener('submit', this.autosave);
    this.submitButton?.addEventListener('click', this.autosave);
  }

  /** Autosave current credentials in the page */
  autosave() {
    const areFieldsFilled = Boolean(this.usernameField?.value?.trim()) && Boolean(this.passwordField?.value?.trim());
    if (!this.hasAlreadySubmitted && areFieldsFilled) {
      this.hasAlreadySubmitted = true;
      port.emit('passbolt.web-integration.autosave', {
        name: document.title,
        username: this.usernameField.value,
        password:  this.passwordField.value,
        url: document.URL
      });
    }
  }

  /** DESTROY */

  /**
   * Remove all listener to clean the page and avoid issue on extension update
   */
  destroy() {
    this.field.removeEventListener('submit', this.autosave);
    this.submitButton?.removeEventListener("click", this.autosave);
  }

}

export default InFormCredentialsFormField;