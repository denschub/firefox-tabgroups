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
  }
};

exports.TabManager = TabManager;
