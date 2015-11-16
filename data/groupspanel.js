const store = Redux.createStore(Reducer);

const Actions = {
  uiHeightChanged: function() {
    addon.port.emit("UI:Resize", {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    });
  },

  selectTab: function(groupId, tabIndex) {
    addon.port.emit("Tab:Select", {groupId, tabIndex});
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider,
      {store: store},
      React.createElement(App, {
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
