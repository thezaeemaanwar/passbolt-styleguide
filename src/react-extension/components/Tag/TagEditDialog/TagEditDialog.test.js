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

import React from "react";
import {render, fireEvent, waitFor} from "@testing-library/react";
import AppContext from "../../../contexts/AppContext";
import MockPort from "../../../test/mock/MockPort";
import TagEditDialog from "./TagEditDialog";
import {ActionFeedbackContext} from "../../../contexts/ActionFeedbackContext";
import PassboltApiFetchError from "../../../../react/lib/Common/Error/PassboltApiFetchError";
import DialogContextProvider from "../../../contexts/Common/DialogContext";
import ManageDialogs from "../../Common/Dialog/ManageDialogs/ManageDialogs";

beforeEach(() => {
  jest.resetModules();
});

const getAppContext = function(appContext) {
  const port = new MockPort();
  const defaultAppContext = {
    port,
    tagToEdit: {
      id: "8e3874ae-4b40-590b-968a-418f704b9d9a",
      slug: "tardis",
      is_shared: false
    },
    setContext: function(newContext) {
      // In this scope this reference the object context.
      Object.assign(this, newContext);
    },
  };

  return Object.assign(defaultAppContext, appContext || {});
};

const getDummyTag = () => ({
  onClose: jest.fn()
});

const renderTagEditDialog = function(appContext, props) {
  appContext = getAppContext(appContext);

  return render(
    <AppContext.Provider value={appContext}>
      <DialogContextProvider>
        <ManageDialogs/>
        <TagEditDialog debug onClose={props.onClose}/>
      </DialogContextProvider>
    </AppContext.Provider>
  );
};

describe("TagEditDialog", () => {
  it("matches the styleguide.", () => {
    const context = getAppContext();
    const props = getDummyTag();
    const {container} = renderTagEditDialog(context, props);

    // Dialog title exists and correct
    const dialogTitle = container.querySelector(".dialog-header h2 span");
    expect(dialogTitle).not.toBeNull();
    expect(dialogTitle.textContent).toBe("Edit tag");

    // Close button exists
    const closeButton = container.querySelector(".dialog-close");
    expect(closeButton).not.toBeNull();

    // Name input field exists.
    const nameInput = container.querySelector("[name=\"name\"]");
    expect(nameInput).not.toBeNull();
    expect(nameInput.value.trim()).toBe(context.tagToEdit.slug);

    // Save button exists
    const saveButton = container.querySelector(".submit-wrapper [type=\"submit\"]");
    expect(saveButton).not.toBeNull();
    expect(saveButton.value).toBe("Save");

    // Cancel button exists
    const cancelButton = container.querySelector(".submit-wrapper .cancel");
    expect(cancelButton).not.toBeNull();
    expect(cancelButton.textContent).toBe("Cancel");
  });

  it("calls onClose props when clicking on the close button.", () => {
    const context = getAppContext();
    const props = getDummyTag();
    const {container} = renderTagEditDialog(context, props);

    const leftClick = {button: 0};
    const dialogCloseIcon = container.querySelector(".dialog-close");
    fireEvent.click(dialogCloseIcon, leftClick);
    expect(props.onClose).toBeCalled();
  });

  it("calls onClose props when clicking on the cancel button.", () => {
    const context = getAppContext();
    const props = getDummyTag();
    const {container} = renderTagEditDialog(context, props);

    const leftClick = {button: 0};
    const cancelButton = container.querySelector(".submit-wrapper .cancel");
    fireEvent.click(cancelButton, leftClick);
    expect(props.onClose).toBeCalled();
  });

  it("validates the form when clicking on the submit button.", async() => {
    const context = getAppContext();
    const props = getDummyTag();
    const {container} = renderTagEditDialog(context, props);

    const nameInput = container.querySelector("[name=\"name\"]");
    expect(nameInput.value).toBe("tardis");
    const nameInputEvent = {target: {value: ""}};
    fireEvent.change(nameInput, nameInputEvent);
    expect(nameInput.value).toBe("");
    await waitFor(() => {
    });

    const leftClick = {button: 0};
    const submitButton = container.querySelector("input[type=\"submit\"]");
    fireEvent.click(submitButton, leftClick);

    await waitFor(() => {
      // Throw name error message
      const nameErrorMessage = container.querySelector(".name.error.message");
      expect(nameErrorMessage.textContent).toBe("A tag name is required.");
    });
  });

  it("requests the addon to edit a tag when clicking on the submit button.", async() => {
    const context = getAppContext();
    const props = getDummyTag();
    const {container} = renderTagEditDialog(context, props);

    const tagMeta = {
      slug: "tardis-updated",
      is_shared: false,
    };

    // Fill the form
    const nameInput = container.querySelector("[name=\"name\"]");
    const nameInputEvent = {target: {value: tagMeta.slug}};
    fireEvent.change(nameInput, nameInputEvent);

    // Mock the request function to make it the expected result
    jest.spyOn(context.port, 'request').mockImplementationOnce(jest.fn());
    jest.spyOn(ActionFeedbackContext._currentValue, 'displaySuccess').mockImplementation(() => {
    });

    // Submit and assert
    const submitButton = container.querySelector("input[type=\"submit\"]");
    fireEvent.click(submitButton, {button: 0});

    const onApiUpdateTageMeta = {
      id: "8e3874ae-4b40-590b-968a-418f704b9d9a",
      slug: tagMeta.slug,
      is_shared: tagMeta.is_shared
    };

    // API calls are made on submit, wait they are resolved.
    await waitFor(() => {
      expect(context.port.request).toHaveBeenCalledWith("passbolt.tags.update", onApiUpdateTageMeta);
      expect(props.onClose).toBeCalled();
      expect(ActionFeedbackContext._currentValue.displaySuccess).toHaveBeenCalled();
    });
  });

  it("displays an error when the API call fail.", async() => {
    const context = getAppContext();
    const props = getDummyTag();
    const {container} = renderTagEditDialog(context, props);

    const tagMeta = {
      slug: "tardis-updated",
      is_shared: false,
    };

    // Fill the form
    const nameInput = container.querySelector("[name=\"name\"]");
    const nameInputEvent = {target: {value: tagMeta.slug}};
    fireEvent.change(nameInput, nameInputEvent);

    // Mock the request function to make it return an error.
    jest.spyOn(context.port, 'request').mockImplementationOnce(() => {
      throw new PassboltApiFetchError("Jest simulate API error.");
    });

    // Submit and assert
    const submitButton = container.querySelector("input[type=\"submit\"]");
    fireEvent.click(submitButton, {button: 0});

    await waitFor(() => {
    });

    // Throw general error message
    const generalErrorDialog = container.querySelector(".error-dialog");
    expect(generalErrorDialog).not.toBeNull();
    const generalErrorMessage = container.querySelector(".error-dialog .dialog .dialog-content .form-content");
    expect(generalErrorMessage).not.toBeNull();
  });
});