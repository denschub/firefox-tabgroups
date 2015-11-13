const store = Redux.createStore(Reducer);

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
