const store = Redux.createStore(Reducer);

/**
 * Global function to retrigger the reizing
 *
 * TODO build into the react components
 */
function resizePanel() {
  addon.port.emit("ResizePanel", {
    width: document.body.clientWidth,
    height: document.body.clientHeight
  });
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider,
      {store: store},
      React.createElement(App, {})
    ),
    document.getElementById("content")
  );
});

addon.port.on("TabgroupsChanged", (tabgroups) => {
  store.dispatch(ActionCreators.setTabgroups(tabgroups));
});
