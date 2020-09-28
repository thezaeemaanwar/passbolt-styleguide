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

/**
 * Unit tests on DisplayComments in regard of specifications
 */



import PasswordWorkspaceMenuPage from "./PasswordWorkspaceMenu.test.page";
import {
  defaultAppContext, defaultPropsMultipleResource,
  defaultPropsNoResource, defaultPropsOneResourceNotOwned,
  defaultPropsOneResourceOwned
} from "./PasswordWorkspaceMenu.test.data";
import {ActionFeedbackContext} from "../../../contexts/ActionFeedbackContext";

beforeEach(() => {
  jest.resetModules();
});

describe("See Workspace Menu", () => {
  let page; // The page to test against
  const context = defaultAppContext(); // The applicative context

  describe('As LU I can see the workspace menu with one resource selected owned', () => {
    const propsOneResourceOwned = defaultPropsOneResourceOwned(); // The props to pass

    /**
     * Given a selected resource
     * When I open the more menu
     * Then I should see the delete
     * Then I should see the edit menu
     * Then I should see the permalink menu
     */

    beforeEach(() => {
      page = new PasswordWorkspaceMenuPage(context, propsOneResourceOwned);
    });

    it('As LU I can start deleting a resource via the workspace main menu', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.moreMenu).not.toBeNull();
      page.displayMenu.clickOnMoreMenu();
      expect(page.displayMenu.dropdownMenuDelete).not.toBeNull();
      expect(page.displayMenu.dropdownMenuDeleteDisabled).toBeNull();
    });

    it('As LU I can start editing a resource via the workspace main menu', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.editMenu).not.toBeNull();
      expect(page.displayMenu.editMenuDisabled).toBeNull();
    });

    it('As LU I can start copying a resource\'s permalink via the workspace main menu', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.moreMenu).not.toBeNull();
      page.displayMenu.clickOnMoreMenu();
      expect(page.displayMenu.dropdownMenuPermalink).not.toBeNull();
      expect(page.displayMenu.dropdownMenuPermalinkDisabled).toBeNull();
      // Mock the notification function
      jest.spyOn(ActionFeedbackContext._currentValue, 'displaySuccess').mockImplementation(() => {
      });

      page.displayMenu.clickOnMenu(page.displayMenu.dropdownMenuPermalink);
      expect(ActionFeedbackContext._currentValue.displaySuccess).toHaveBeenCalled();
    });

    it('As LU I should be able to copy a resource username from the resource sidebar', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.moreMenu).not.toBeNull();
      page.displayMenu.clickOnMoreMenu();
      expect(page.displayMenu.dropdownMenuUsername).not.toBeNull();
      expect(page.displayMenu.dropdownMenuUsernameDisabled).toBeNull();
      // Mock the notification function
      jest.spyOn(ActionFeedbackContext._currentValue, 'displaySuccess').mockImplementation(() => {
      });

      page.displayMenu.clickOnMenu(page.displayMenu.dropdownMenuUsername);
      expect(ActionFeedbackContext._currentValue.displaySuccess).toHaveBeenCalled();
    });

    it('As LU I can start sharing a resource via the workspace main menu', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.shareMenu).not.toBeNull();
      expect(page.displayMenu.shareMenuDisabled).toBeNull();
    });
  });

  describe('As LU I can see the workspace menu with one resource selected not owned', () => {
    const propsOneResourceNotOwned = defaultPropsOneResourceNotOwned(); // The props to pass

    /**
     * Given a selected resource not owned
     * When I open the more menu
     * Then I should see the delete disable
     * Then I should see the edit menu disable
     */

    beforeEach(() => {
      page = new PasswordWorkspaceMenuPage(context, propsOneResourceNotOwned);
    });

    it('As LU I cannot delete a resource I do not have update permission from the workspace main menu', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.moreMenu).not.toBeNull();
      page.displayMenu.clickOnMoreMenu();
      expect(page.displayMenu.dropdownMenuDeleteDisabled).not.toBeNull();
    });

    it('As LU I cannot edit a resource I do not have update permission from the workspace main menu', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.editMenuDisabled).not.toBeNull();
    });

    it('As LU I cannot share a resource I do not own from the workspace main menu', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.shareMenuDisabled).not.toBeNull();
    });
  });

  describe('As LU I can see the workspace menu with no resource selected', () => {
    const propsNoResource = defaultPropsNoResource(); // The props to pass

    /**
     * Given no selected resource
     * Then I should see the more menu disable
     * Then I should see the edit menu disable
     */

    beforeEach(() => {
      page = new PasswordWorkspaceMenuPage(context, propsNoResource);
    });

    it('As LU I should see the delete button disable if nothing is selected', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.moreMenuDisabled).not.toBeNull();
    });

    it('As LU I should see the edit button disable if nothing is selected', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.editMenuDisabled).not.toBeNull();
    });

    it('As LU I should see the share button disable if nothing is selected', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.shareMenuDisabled).not.toBeNull();
    });
  });

  describe('As LU I can see the workspace menu with multiple resource selected', () => {
    const propsMultipleResource = defaultPropsMultipleResource(); // The props to pass

    /**
     * Given multiple selected resource
     * Then I should see the edit menu disable
     * Then I should see the permalink menu disable
     */

    beforeEach(() => {
      page = new PasswordWorkspaceMenuPage(context, propsMultipleResource);
    });

    it('As LU I should see the edit button disable if multiple resources is selected', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.editMenuDisabled).not.toBeNull();
    });

    it('As LU I should see the copy permalink disable if multiple resources is selected', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.dropdownMenuPermalinkDisabled).not.toBeNull();
    });

    it('As LU I should see the copy username disable if multiple resources is selected', () => {
      expect(page.displayMenu.exists()).toBeTruthy();
      expect(page.displayMenu.dropdownMenuUsernameDisabled).not.toBeNull();
    });
  });
});