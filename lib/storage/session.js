const {Cc, Ci} = require("chrome");
const TabsUtils = require("sdk/tabs/utils");

function SessionStorage() {
  this._store = Cc["@mozilla.org/browser/sessionstore;1"]
    .getService(Ci.nsISessionStore);
}

/**
 * NOTE
 *
 * Dirty API to access the original SessionStore as used by Panorama to avoid
 * having to write migrations for now.
 *
 * This will eventually get replaced by the SDKs simple-storage.
 */
SessionStorage.prototype = {
  /**
   * Returns an array of available groups.
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Array}
   */
  getGroups: function(chromeWindow) {
    let groupsData = this._getGroupsData(chromeWindow);
    let currentGroup = this._getCurrentGroupData(chromeWindow);

    /*
     * TODO
     *
     * We actually should go ahead and assign all exiting tabs to a group
     * that has to be created. This fallback group is just a temporary
     * workaround until writing the storage is fully implemented
     */
    if (Object.keys(groupsData).length == 0) {
      return [{
        active: true,
        id: 0,
        title: "_DEFAULT"
      }];
    }

    let groups = [];
    for (let groupIndex in groupsData) {
      let group = groupsData[groupIndex];

      groups.push({
        active: group.id == currentGroup.activeGroupId,
        id: group.id,
        title: group.title
      });
    }

    return groups;
  },

  /**
   * Returns all tabs.
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Array}
   */
  getTabs: function(chromeWindow) {
    let browser = TabsUtils.getTabBrowser(chromeWindow);
    let tabs = [];

    for (let tabIndex = 0; tabIndex < browser.tabs.length; tabIndex++) {
      let tab = browser.tabs[tabIndex];
      let tabData = this._getTabData(tab);
      let tabState = this._getTabState(tab);

      if (tabState.pinned) {
        continue;
      }

      tabs.push({
        active: tab.selected,
        group: tabData.groupID || 0,
        index: tabIndex,
        title: tab.visibleLabel,
        url: tabState.entries[tabState.entries.length - 1].url
      });
    }

    return tabs;
  },

  /**
   * Returns all tab indexes in the specified group.
   *
   * @param {TabBrowser} tabBrowser
   * @param {Number} groupID
   * @returns {Array}
   */
  getTabIndexesByGroup: function(tabBrowser, targetGroupId) {
    let tabs = [];

    for (let tabIndex = 0; tabIndex < tabBrowser.tabs.length; tabIndex++) {
      let tab = tabBrowser.tabs[tabIndex];
      let tabData = this._getTabData(tab);
      let tabState = this._getTabState(tab);

      let group = tabData.groupID || 0;
      if (tabState.pinned || group != targetGroupId) {
        continue;
      }

      tabs.push(tabIndex);
    }

    return tabs;
  },

  /**
   * Returns the ID of the current group.
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Number}
   */
  getCurrentGroup: function(chromeWindow) {
    let groupData = this._getCurrentGroupData(chromeWindow);
    return groupData.activeGroupId || 0;
  },

  /**
   * Returns the data for the current tab.
   *
   * @param {XULElement} tab
   * @returns {Object}
   */
  _getTabData: function(tab) {
    return this._parseOptionalJson(
      this._store.getTabValue(tab, "tabview-tab")
    );
  },

  /**
   * Returns the data for the current tab state.
   *
   * @param {XULElement} tab
   * @returns {Object}
   */
  _getTabState: function(tab) {
    return this._parseOptionalJson(
      this._store.getTabState(tab)
    );
  },

  /**
   * Returns all tab groups with additional information.
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Object}
   */
  _getGroupsData: function(chromeWindow) {
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
  _getCurrentGroupData: function(chromeWindow) {
    return this._parseOptionalJson(
      this._store.getWindowValue(chromeWindow, "tabview-groups")
    );
  },

  /**
   * Safely parses a JSON string.
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
