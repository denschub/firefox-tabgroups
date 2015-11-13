const INITIAL_STATE = Immutable.fromJS({
  tabgroups: {}
});

const Reducer = function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "TABGROUPS_RECEIVE":
      return state.set("tabgroups", Immutable.fromJS(action.tabgroups));
  }

  return state;
};
