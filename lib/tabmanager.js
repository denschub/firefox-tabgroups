function TabManager(storage) {
  this._storage = storage;
}

TabManager.prototype = {
  /**
   * Returns all groups with their tabs.
   *
   * @param {ChromeWindow} chromeWindow
   * @returns {Object}
   */
  getGroupsWithTabs: function(chromeWindow) {
    let groups = this._storage.getGroups(chromeWindow);
    let tabs = this._storage.getTabs(chromeWindow);

    return groups.map((group) => {
      return Object.assign({}, group, {
        tabs: tabs.filter((tab) => {
          return tab.group == group.id;
        })
      });
    });
  },

  /**
   * Selects a given tab.
   *
   * @param {ChromeWindow} chromeWindow
   * @param {TabBrowser} tabBrowser
   * @param {Number} index - the tabs index
   * @param {Number} groupID - the tabs groupID
   */
  selectTab: function(chromeWindow, tabBrowser, index, groupID) {
    let currentGroup = this._storage.getCurrentGroup(chromeWindow);

    if (currentGroup == groupID) {
      tabBrowser.selectedTab = tabBrowser.tabs[index];
    } else {
      this.selectGroup(chromeWindow, tabBrowser, groupID, index);
    }
  },

  /**
   * Selects a given group.
   *
   * @param {ChromeWindow} chromeWindow
   * @param {TabBrowser} tabBrowser
   * @param {Number} groupID - the groupID
   * @param {Number} tabIndex - the tab to activate
   */
  selectGroup: function(chromeWindow, tabBrowser, groupID, tabIndex = 0) {
    let currentGroup = this._storage.getCurrentGroup(chromeWindow);
    if (currentGroup == groupID) {
      return;
    }

    let tabs = this._storage.getTabIndexesByGroup(tabBrowser, groupID);

    if (tabIndex) {
      tabBrowser.selectedTab = tabBrowser.tabs[tabIndex];
    } else {
      tabBrowser.selectedTab = tabBrowser.tabs[tabs[tabIndex]];
    }
    tabBrowser.showOnlyTheseTabs(tabs.map((tab) => {
      return tabBrowser.tabs[tab];
    }));
  },

  /**
   * Adds a blank group
   *
   * @param {ChromeWindow} chromeWindow
   */
  addGroup: function(chromeWindow) {
    this._storage.addGroup(chromeWindow);
  }
};

exports.TabManager = TabManager;
