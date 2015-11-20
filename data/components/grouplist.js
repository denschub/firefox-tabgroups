const GroupList = (() => {
  const GroupListStandalone = React.createClass({
    propTypes: {
      groups: React.PropTypes.object.isRequired,
      onGroupAddClick: React.PropTypes.func,
      onGroupClick: React.PropTypes.func,
      onGroupCloseClick: React.PropTypes.func,
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
            onGroupCloseClick: this.props.onGroupCloseClick,
            onTabClick: this.props.onTabClick,
            uiHeightChanged: this.props.uiHeightChanged
          });
        }),
        React.createElement(
          GroupAddButton,
          {
            onClick: this.props.onGroupAddClick
          }
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
