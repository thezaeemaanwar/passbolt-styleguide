import {MemoryRouter, Route} from "react-router-dom";
import React from "react";
import ConfirmSaveAccountRecoverySettings from "./ConfirmSaveAccountRecoverySettings";
import {
  mockAccountRecoveryDisableWithOrganizationKey,
  mockAccountRecoveryMandatory
} from "./ConfirmSaveAccountRecoverySettings.test.data";


export default {
  title: 'Passbolt/Administration/ConfirmSaveAccountRecoverySettings',
  component: ConfirmSaveAccountRecoverySettings
};

const Template = args =>
  <MemoryRouter initialEntries={['/']}>
    <Route component={routerProps => <ConfirmSaveAccountRecoverySettings {...args} {...routerProps}/>}></Route>
  </MemoryRouter>;

export const Mandatory = Template.bind({});
Mandatory.args = {
  context: {
    locale: 'en-US'
  },
  mockAccountRecoveryMandatory
};

export const MandatoryWithOrganizationKey = Template.bind({});
MandatoryWithOrganizationKey.args = {
  context: {
    locale: 'en-US'
  },
  mockAccountRecoveryDisableWithOrganizationKey
};

export const OrganizationRecoveryKey = Template.bind({});
OrganizationRecoveryKey.args = {
  context: {
    locale: 'en-US'
  },
  accountRecovery: {
    policy: {
      value: 'mandatory',
      info: "",
      hasChanged: false
    },
    organizationRecoveryKey: {
      value: {
        fingerprint: "848E95CC7493129AD862583129B81CA8936023DD",
        algorithm: "RSA",
        keyLength: 4096,
        created: "2021-08-05T02:50:34.12",
        expires: "Never"
      },
      hasChanged: true
    }
  }
};
