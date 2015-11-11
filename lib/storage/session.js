const {Cc, Ci} = require("chrome");
const TabsUtils = require("sdk/tabs/utils");

function SessionStorage() {
  this._store = Cc["@mozilla.org/browser/sessionstore;1"]
    .getService(Ci.nsISessionStore);
}

SessionStorage.prototype = {
  /**
   * Returns an array of available groups
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Object}
   */
  getGroups: function(chromeWindow) {
    let groups = [];
    let groupsData = this.loadGroupsData(chromeWindow);
    let currentGroup = this.loadCurrentGroupData(chromeWindow);

    for(let groupIndex in groupsData) {
      let group = groupsData[groupIndex];

      groups.push({
        id: group.id,
        title: group.title,
        active: group.id == currentGroup.activeGroupId
      });
    }

    return groups;
  },

  /**
   * Returns all tabs grouped by their groupID
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Object}
   */
  getGroupedTabs: function(chromeWindow) {
    let browser = TabsUtils.getTabBrowser(chromeWindow);
    let tabs = {};

    for (let tabIndex = 0; tabIndex < browser.tabs.length; tabIndex++) {
      let tab = browser.tabs[tabIndex];
      let tabData = this.loadTabData(tab);
      let tabState = this.loadTabState(tab);

      if (tabState.pinned) {
        continue;
      }

      let relevantTabData = {
        index: tabIndex,
        title: tab.visibleLabel,
        url: tabState.entries[tabState.entries.length-1].url,
        active: tab.selected
      };

      let groupID = tabData.groupID || 0;
      if (!tabs[groupID]) {
        tabs[groupID] = [];
      }
      tabs[groupID].push(relevantTabData);
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
