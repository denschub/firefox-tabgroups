const store = Redux.createStore(Reducer);

const Actions = {
  addGroup: function() {
    addon.port.emit("Group:Add");
  },

  closeGroup: function(groupID) {
    addon.port.emit("Group:Close", {groupID});
  },

  uiHeightChanged: function() {
    addon.port.emit("UI:Resize", {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    });
  },

  renameGroup: function(groupID, title) {
    addon.port.emit("Group:Rename", {groupID, title});
  },

  selectGroup: function(groupID) {
    addon.port.emit("Group:Select", {groupID});
  },

  selectTab: function(groupID, tabIndex) {
    addon.port.emit("Tab:Select", {groupID, tabIndex});
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider,
      {store: store},
      React.createElement(App, {
        onGroupAddClick: Actions.addGroup,
        onGroupClick: Actions.selectGroup,
        onGroupCloseClick: Actions.closeGroup,
        onGroupTitleChange: Actions.renameGroup,
        onTabClick: Actions.selectTab,
        uiHeightChanged: Actions.uiHeightChanged
      })
    ),
    document.getElementById("content")
  );
});

addon.port.on("Groups:Changed", (tabgroups) => {
  store.dispatch(ActionCreators.setTabgroups(tabgroups));
});
