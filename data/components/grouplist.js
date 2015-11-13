const GroupList = (() => {
  const GroupListStandalone = React.createClass({
    render: function() {
      return (
        React.DOM.ul(
          {className: "group-list"},
          this.props.groups.map((group) => {
            return React.createElement(Group, {key: group.id, group: group});
          })
        )
      );
    }
  });

  return ReactRedux.connect((state) => {
    return {
      groups: state.get("tabgroups")
    };
  }, ActionCreators)(GroupListStandalone);
})();
