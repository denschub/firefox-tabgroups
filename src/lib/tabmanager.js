const TabsUtils = require("sdk/tabs/utils");

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
  getGroupsWithTabs: function(chromeWindow, sort) {
    let groups = this._storage.getGroups(chromeWindow);
    let tabs = this._storage.getTabs(chromeWindow);

    let retGroups = groups.map((group) => {
      return Object.assign({}, group, {
        tabs: tabs.filter((tab) => {
          return tab.group == group.id;
        })
      });
    });

    if (sort) {
      retGroups.sort((a, b) => {
        if (a.title.toLowerCase() == b.title.toLowerCase()) {
          return 0;
        }

        return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
      });
    }

    return retGroups;
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
   * Move tab beetwen groups
   *
   * @param {ChromeWindow} chromeWindow
   * @param {TabBrowser} tabBrowser
   * @param {Number} tabIndex - the tabs index
   * @param {Number} targetGroupID - target groupID (where to move tab)
   */
  moveTabToGroup: function(chromeWindow, tabBrowser, tabIndex, targetGroupID) {
    let tab = tabBrowser.tabs[tabIndex];
    if (tab.groupID === targetGroupID) {
      return;
    }
    this._storage.setTabGroup(tab, targetGroupID);
    if (tab.selected) {
      this.selectGroup(chromeWindow, tabBrowser, targetGroupID);
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

    if (curtab) {
      let curindex = tabs.filter((tab) => {
        return tab.group == curtab.group;
      }).indexOf(curtab);

      this._storage.setGroupSelectedIndex(chromeWindow, curtab.group, curindex);
    }
  },

  /**
   * Updates the currently selected group based on the active tab
   *
   * @param {ChromwWindow} chromeWindow
   */
  updateCurrentSelectedGroup: function(chromeWindow) {
    let tabs = this._storage.getTabs(chromeWindow);
    let curtab = tabs.find((tab) => {
      return tab.active;
    });

    if (curtab) {
      let currentGroupID = this._storage.getCurrentGroup(chromeWindow);
      if (currentGroupID && curtab.group !== currentGroupID) {
        this.selectGroup(chromeWindow, TabsUtils.getTabBrowser(chromeWindow), curtab.group, tabs.indexOf(curtab));
      }
    }
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
   * Adds a group with associated tab
   *
   * @param {ChromeWindow} chromeWindow
   * @param {TabBrowser} tabBrowser
   * @param {Number} tabIndex - the tab to place into group
   */
  addGroupWithTab: function(chromeWindow, tabBrowser, tabIndex) {
    this._storage.addGroup(chromeWindow);
    let group = this.getRecentlyAddedGroup(chromeWindow);
    this.moveTabToGroup(
      chromeWindow,
      tabBrowser,
      tabIndex,
      group.id
    );
  },

  /**
   * Return recently added group
   *
   * @param {ChromeWindow} chromeWindow
   */
  getRecentlyAddedGroup: function(chromeWindow) {
    let currentGoups = this._storage.getGroups(chromeWindow);
    let recentlyAddedGroup = null;
    if (currentGoups.length > 0) {
      recentlyAddedGroup = currentGoups[currentGoups.length - 1];
    }
    return recentlyAddedGroup;
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
