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
 * @since         2.11.0
 */

import {fireEvent, render} from "@testing-library/react";
import React from "react";
import MockTranslationProvider from "../../../test/mock/components/Internationalisation/MockTranslationProvider";
import DisplayUnexpectedError from "./DisplayUnexpectedError";

/**
 * The DisplayUnexpectedError component represented as a page
 */
export default class DisplayUnexpectedErrorTestPage {
  /**
   * Default constructor
   */
  constructor() {
    this._page = render(
      <MockTranslationProvider>
        <DisplayUnexpectedError/>
      </MockTranslationProvider>
    );
  }

  /**
   * Returns the title
   */
  get title() {
    return this._page.container.querySelector('.setup-error h1').textContent;
  }

  /**
   * Returns the try again element
   */
  get tryAgainButton() {
    return this._page.container.querySelector('.button.primary');
  }

  /**
   * Request new account
   */
  async tryAgain() {
    const leftClick = {button: 0};
    fireEvent.click(this.tryAgainButton, leftClick);
  }
}
