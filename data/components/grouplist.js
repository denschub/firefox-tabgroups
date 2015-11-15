const GroupList = (() => {
  const GroupListStandalone = React.createClass({
    componentDidUpdate: function() {
      this.props.uiHeightChanged && this.props.uiHeightChanged();
    },

    render: function() {
      return React.DOM.ul(
        {className: "group-list"},
        this.props.groups.map((group) => {
          return React.createElement(Group, {
            key: group.id,
            group: group,
            uiHeightChanged: this.props.uiHeightChanged
          });
        })
      );
    }
  });

  return ReactRedux.connect((state) => {
    return {
      groups: state.get("tabgroups")
    };
  }, ActionCreators)(GroupListStandalone);
})();
