/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2021 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2021 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.4.0
 */
import React from "react";
import {MemoryRouter, Route} from "react-router-dom";
import MockTranslationProvider from "../../../test/mock/components/Internationalisation/MockTranslationProvider";
import DisplayAccountRecoveryNotSupported from "./DisplayAccountRecoveryNotSupported";

export default {
  title: 'Passbolt/Authentication/DisplayAccountRecoveryNotSupported',
  component: DisplayAccountRecoveryNotSupported
};

const Template = args =>
  <MockTranslationProvider>
    <div id="container" className="container page login">
      <div className="content">
        <div className="login-form">
          <MemoryRouter initialEntries={['/']}>
            <Route component={routerProps => <DisplayAccountRecoveryNotSupported {...args} {...routerProps}/>}/>
          </MemoryRouter>
        </div>
      </div>
    </div>
  </MockTranslationProvider>;

export const Initial = Template.bind({});
