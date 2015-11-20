const App = React.createClass({
  propTypes: {
    onGroupAddClick: React.PropTypes.func,
    onGroupClick: React.PropTypes.func,
    onGroupCloseClick: React.PropTypes.func,
    onGroupTitleChange: React.PropTypes.func,
    onTabClick: React.PropTypes.func,
    uiHeightChanged: React.PropTypes.func
  },

  render: function() {
    return React.createElement(GroupList, this.props);
  }
});
