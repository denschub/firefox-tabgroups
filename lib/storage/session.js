const {Cc, Ci} = require("chrome");
const TabsUtils = require("sdk/tabs/utils");

function SessionStorage() {
  this._store = Cc["@mozilla.org/browser/sessionstore;1"]
    .getService(Ci.nsISessionStore);
}

SessionStorage.prototype = {
  /**
   * Dummy function to geturn tabs of the current window
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Array}
   */
  getTabs: function(chromeWindow) {
    let browser = TabsUtils.getTabBrowser(chromeWindow);
    let tabs = [];

    for (let tabIndex = 0; tabIndex < browser.tabs.length; tabIndex++) {
      let tab = browser.tabs[tabIndex];

      console.log("tab data", this.loadTabData(tab));
      console.log("tab state", this.loadTabState(tab));
      console.log("groups data", this.loadGroupsData(chromeWindow));
      console.log("current group", this.loadCurrentGroupData(chromeWindow));

      tabs.push({
        index: tabIndex,
        label: tab.visibleLabel
      });
    }

    return tabs;
  },

  /**
   * Returns the data for the current tab
   *
   * @param {XULElement} tab
   * @returns {Object}
   */
  loadTabData: function(tab) {
    return this._parseOptionalJson(
      this._store.getTabValue(tab, "tabview-tab")
    );
  },

  /**
   * Returns the data for the current tab state
   *
   * @param {XULElement} tab
   * @returns {Object}
   */
  loadTabState: function(tab) {
    return this._parseOptionalJson(
      this._store.getTabState(tab)
    );
  },

  /**
   * Returns all tab groups with additional information
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Object}
   */
  loadGroupsData: function(chromeWindow) {
    return this._parseOptionalJson(
      this._store.getWindowValue(chromeWindow, "tabview-group")
    );
  },

  /**
   * Returns the current group as well as the next group ID and the total
   * number of groups.
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Object}
   */
  loadCurrentGroupData: function(chromeWindow) {
    return this._parseOptionalJson(
      this._store.getWindowValue(chromeWindow, "tabview-groups")
    );
  },

  /**
   * Safely parses a JSON string
   *
   * @param {String} jsonString - JSON encoded data
   * @returns {Object} decoded JSON data or an empty object if something failed
   */
  _parseOptionalJson: function(jsonString) {
    if (jsonString) {
      try {
        return JSON.parse(jsonString);
      } catch (e) {
        return {};
      }
    }
    return {};
  }
};

exports.SessionStorage = SessionStorage;
