const store = Redux.createStore(Reducer);

const Actions = {
  addGroup: function() {
    addon.port.emit("Group:Add");
  },

  addGroupWithTab: function(sourceGroupID, tabIndex) {
    addon.port.emit("Group:AddWithTab", {sourceGroupID, tabIndex});
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

  moveTabToGroup: function(sourceGroupID, tabIndex, targetGroupID) {
    addon.port.emit("Group:Drop", {sourceGroupID, tabIndex, targetGroupID});
  },

  selectTab: function(groupID, tabIndex) {
    addon.port.emit("Tab:Select", {groupID, tabIndex});
  },

  dragTab: function(groupID, tabIndex) {
    addon.port.emit("Tab:Drag", {groupID, tabIndex});
  },

  dragTabStart: function(groupID, tabIndex) {
    addon.port.emit("Tab:DragStart", {groupID, tabIndex});
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider,
      {store: store},
      React.createElement(App, {
        onGroupAddClick: Actions.addGroup,
        onGroupAddDrop: Actions.addGroupWithTab,
        onGroupClick: Actions.selectGroup,
        onGroupDrop: Actions.moveTabToGroup,
        onGroupCloseClick: Actions.closeGroup,
        onGroupTitleChange: Actions.renameGroup,
        onTabClick: Actions.selectTab,
        onTabDrag: Actions.dragTab,
        onTabDragStart: Actions.dragTabStart,
        uiHeightChanged: Actions.uiHeightChanged
      })
    ),
    document.getElementById("content")
  );
});

addon.port.on("Groups:Changed", (tabgroups) => {
  store.dispatch(ActionCreators.setTabgroups(tabgroups));
});

addon.port.on("Groups:CloseTimeoutChanged", (timeout) => {
  store.dispatch(ActionCreators.setGroupCloseTimeout(timeout));
});
