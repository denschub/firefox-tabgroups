const store = Redux.createStore(Reducer);

addon.port.on("TabgroupsChanged", (tabgroups) => {
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider,
      {store: store},
      React.createElement(App, {})
    ),
    document.getElementById("content")
  );

  store.dispatch(ActionCreators.setTabgroups(tabgroups));
});
