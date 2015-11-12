const ActionCreators = {
  setTabgroups: function(tabgroups) {
    return {
      type: "TABGROUPS_RECEIVE",
      tabgroups: tabgroups
    };
  }
};
