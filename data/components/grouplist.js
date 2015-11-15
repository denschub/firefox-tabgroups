const GroupList = (() => {
  const GroupListStandalone = React.createClass({
    componentDidUpdate: function() {
      this.props.uiHeightChanged && this.props.uiHeightChanged();
    },

    render: function() {
      let childs;
      if (this.props.groups.size) {
        childs = React.DOM.ul(
          {className: "group-list"},
          this.props.groups.map((group) => {
            return React.createElement(Group, {
              key: group.id,
              group: group,
              uiHeightChanged: this.props.uiHeightChanged
            });
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
