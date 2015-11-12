const INITIAL_STATE = Immutable.fromJS({
  tabgroups: {}
});

const Reducer = function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "TABGROUPS_RECEIVE":
      console.log(action.tabgroups);
      return state.set("tabgroups", action.tabgroups);
  }

  return state;
};
