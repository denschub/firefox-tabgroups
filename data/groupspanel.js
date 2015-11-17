const store = Redux.createStore(Reducer);

const Actions = {
  uiHeightChanged: function() {
    addon.port.emit("UI:Resize", {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    });
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
        onGroupClick: Actions.selectGroup,
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
