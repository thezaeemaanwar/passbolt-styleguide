/**
 * Returns the default app context for the unit test
 * @param appContext An existing app context
 * @returns {any}
 */
export function defaultAppContext(appContext) {
  const defaultAppContext = {
    trustedDomain: "http://localhost:3000",
  };
  return Object.assign(defaultAppContext, appContext || {});
}

/**
 * Default props
 * @returns {{resource: {id: string, name: string}}}
 */
export function defaultProps(selectedAdministration) {
  return {
    administrationWorkspaceContext: {
      selectedAdministration,
      isSaveEnabled: false,
      isTestEnabled: false,
      isSynchronizeEnabled: false,
      mustSynchronizeSettings: false,
      onResetActionsSettings: jest.fn(),
      onMustSaveSettings: jest.fn(),
      onMustTestSettings: jest.fn(),
    },
    dialogContext: {
      open: jest.fn()
    }
  };
}