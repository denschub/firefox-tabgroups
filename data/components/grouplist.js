const GroupList = (() => {
  const GroupListStandalone = React.createClass({
    render: function() {
      let childs;
      if (this.props.groups.size) {
        childs = React.DOM.ul(
          {className: "group-list"},
          this.props.groups.map((group) => {
            return React.createElement(Group, {key: group.id, group: group});
          })
        );
      } else {
        childs = React.DOM.p(
          {},
          "No groups available!"
        );
      }

      return childs;
    }
  });

  return ReactRedux.connect((state) => {
    return {
      groups: state.get("tabgroups")
    };
  }, ActionCreators)(GroupListStandalone);
})();
