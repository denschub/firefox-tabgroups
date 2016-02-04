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

    this.updateCurrentSelectedTab(chromeWindow);

    let lastSelected = this._storage.getGroupSelectedIndex(chromeWindow, groupID);

    let tabs = this._storage.getTabIndexesByGroup(tabBrowser, groupID);

    let selectedTab;
    if (tabs.length == 0) {
      selectedTab = tabBrowser.addTab("about:newtab");
      this._storage.setTabGroup(selectedTab, groupID);
      tabs.push(selectedTab);
    } else if (tabIndex) {
      selectedTab = tabBrowser.tabs[tabIndex];
    } else {
      selectedTab = tabBrowser.tabs[lastSelected < tabs.length ? tabs[lastSelected] : tabs[0]];
    }

    this._storage.setCurrentGroup(chromeWindow, groupID);
    tabBrowser.selectedTab = selectedTab;

    tabBrowser.showOnlyTheseTabs(tabs.map((tab) => {
      return tabBrowser.tabs[tab];
    }));
  },

  /**
   * Selects the next or previous group in the list
   *
   * @param {ChromeWindow} chromeWindow
   * @param {Number} direction
   */
  selectNextPrevGroup: function(chromeWindow, tabBrowser, direction) {
    let currentGroup = this._storage.getCurrentGroup(chromeWindow);
    let groups = this._storage.getGroups(chromeWindow);
    if (groups.length == 0) {
      return;
    }

    let index = groups.findIndex((group) => {
      return group.id == currentGroup;
    });

    if (index == -1) {
      return;
    }

    index = (index + direction + groups.length) % groups.length;
    this.selectGroup(chromeWindow, tabBrowser, groups[index].id);
  },

  /**
   * Updates the currently selected index for the given window
   *
   * @param {ChromeWindow} chromeWindow
   */
  updateCurrentSelectedTab: function(chromeWindow) {
    let tabs = this._storage.getTabs(chromeWindow);
    let curtab = tabs.find((tab) => {
      return tab.active;
    });

    let curindex = tabs.filter((tab) => {
      return tab.group == curtab.group;
    }).indexOf(curtab);

    this._storage.setGroupSelectedIndex(chromeWindow, curtab.group, curindex);
  },

  /**
   * Renames a given group.
   *
   * @param {ChromeWindow} chromeWindow
   * @param {Number} groupID - the groupID
   * @param {String} title - the new title
   */
  renameGroup: function(chromeWindow, groupID, title) {
    this._storage.renameGroup(chromeWindow, groupID, title);
  },

  /**
   * Adds a blank group
   *
   * @param {ChromeWindow} chromeWindow
   */
  addGroup: function(chromeWindow) {
    this._storage.addGroup(chromeWindow);
  },

  /**
   * Closes a group and all attached tabs
   *
   * @param {Number} groupID - the groupID
   */
  closeGroup: function(chromeWindow, tabBrowser, groupID) {
    this._storage.removeGroup(chromeWindow, groupID);

    let currentGroup = this._storage.getCurrentGroup(chromeWindow);
    if (currentGroup == groupID) {
      let remainingGroups = this._storage.getGroups(chromeWindow);
      this.selectGroup(chromeWindow, tabBrowser, remainingGroups[0].id);
    }

    this._storage.removeGroupTabs(tabBrowser, groupID);
  }
};

exports.TabManager = TabManager;
