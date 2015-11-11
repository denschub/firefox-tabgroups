function SessionStorage() {}

SessionStorage.prototype = {
  /**
   * Dummy function to geturn tabs of the current window
   *
   * @param {XULElement (tabbrowser)} browser - the current tabbrowser
   * @returns {Array} Array of tabs in the current window
   */
  getTabs: function(browser) {
    let tabs = [];

    for (let tabIndex = 0; tabIndex < browser.tabs.length; tabIndex++) {
      tabs.push({
        index: tabIndex,
        label: browser.tabs[tabIndex].visibleLabel
      });
    }

    return tabs;
  }
};

exports.SessionStorage = SessionStorage;
