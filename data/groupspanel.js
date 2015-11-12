const store = Redux.createStore(Reducer);

ReactDOM.render(
  React.createElement(
    ReactRedux.Provider,
    {store: store},
    React.createElement(App, {})
  ),
  document.getElementById("content")
);

self.port.on("TabgroupsChanged", (tabgroups) => {
  store.dispatch(ActionCreators.setTabgroups(tabgroups));
});
