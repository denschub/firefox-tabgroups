const GroupList = (() => {
  const GroupListStandalone = React.createClass({
    propTypes: {
      groups: React.PropTypes.object.isRequired,
      onGroupClick: React.PropTypes.func,
      onTabClick: React.PropTypes.func,
      uiHeightChanged: React.PropTypes.func
    },

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
            onGroupClick: this.props.onGroupClick,
            onTabClick: this.props.onTabClick,
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
