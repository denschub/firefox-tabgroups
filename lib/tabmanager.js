function TabManager(storage) {
  this._storage = storage;
}

TabManager.prototype = {
  /**
   * Returns all groups with their tabs
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
   * Selects a given tab
   *
   * @param {TabBrowser} tabBrowser
   * @param {Number} index - the tabs index
   * @param {Number} groupId - the tabs groupId
   */
  selectTab: function(tabBrowser, index, group) {
    // TODO select the group first if necessary
    tabBrowser.selectTabAtIndex(index);
  }
};

exports.TabManager = TabManager;
