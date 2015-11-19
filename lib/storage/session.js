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

    if (Object.keys(groupsData).length == 0) {
      this.addGroup(chromeWindow);
      groupsData = this._getGroupsData(chromeWindow);
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

      let group = this.getCurrentGroup(chromeWindow);
      if (!(tabData && tabData.groupID)) {
        this.setTabGroup(tab, group);
      } else {
        group = tabData.groupID;
      }

      tabs.push({
        active: tab.selected,
        group: group,
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

      let group = 0;
      if (tabData && tabData.groupID) {
        group = tabData.groupID;
      }

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
   * Assigns a tab to a group.
   *
   * @param {XULElement} tab
   * @param {Number} groupID
   */
  setTabGroup: function(tab, groupID) {
    this._setTabData(
      tab,
      Object.assign({}, this._getTabData(tab), {groupID})
    );
  },

  /**
   * Returns the next possible GroupID
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Number}
   */
  getNextGroupID: function(chromeWindow) {
    let groupData = this._getCurrentGroupData(chromeWindow);
    let id = groupData.nextID;
    groupData.nextID += 1;
    this._setCurrentGroupData(chromeWindow, groupData);
    return id;
  },

  /**
   *
   */
  addGroup: function(chromeWindow, title = "") {
    let groups = this._getGroupsData(chromeWindow);
    let groupID = this.getNextGroupID(chromeWindow);
    groups[groupID] = {
      id: groupID,
      title: title,

      // TODO remove me if polaris-compatibility is no longer an issue.
      bounds: {
        height: 100,
        left: (groupID-1)*145 + 15,
        top: 15,
        width: 100
      }
    };

    let currentGroups = this._getCurrentGroupData(chromeWindow);
    currentGroups.totalNumber += 1;

    this._setGroupsData(chromeWindow, groups);
    this._setCurrentGroupData(chromeWindow, currentGroups);
  },

  /**
   * Returns the data for a tab.
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
   * Stores the data for a tab.
   *
   * @param {XULElement} tab
   * @param {Object} data
   * @returns {Object}
   */
  _setTabData: function(tab, data) {
    this._store.setTabValue(
      tab,
      "tabview-tab",
      JSON.stringify(data)
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
   * Set group information for the given window.
   *
   * @param {ChromeWindow} chromeWindow
   * @param {Object} data
   * @returns {Object}
   */
  _setGroupsData: function(chromeWindow, data) {
    this._store.setWindowValue(
      chromeWindow,
      "tabview-group",
      JSON.stringify(data)
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
    let data = this._parseOptionalJson(
      this._store.getWindowValue(chromeWindow, "tabview-groups")
    );

    if (Object.keys(data).length == 0) {
      data = {
        activeGroupId: 1,
        nextID: 1,
        totalNumber: 0
      };
    }

    return data;
  },

  /**
   * Stores information about the current session.
   *
   * @param {ChromeWindow} chromeWindow
   * @param {Object} data
   * @returns {Object}
   */
  _setCurrentGroupData: function(chromeWindow, data) {
    this._store.setWindowValue(
      chromeWindow,
      "tabview-groups",
      JSON.stringify(data)
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
