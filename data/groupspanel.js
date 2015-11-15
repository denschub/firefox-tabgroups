const store = Redux.createStore(Reducer);

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider,
      {store: store},
      React.createElement(App, {
        uiHeightChanged: () => {
          addon.port.emit("ResizePanel", {
            width: document.body.clientWidth,
            height: document.body.clientHeight
          });
        }
      })
    ),
    document.getElementById("content")
  );
});

addon.port.on("TabgroupsChanged", (tabgroups) => {
  store.dispatch(ActionCreators.setTabgroups(tabgroups));
});
