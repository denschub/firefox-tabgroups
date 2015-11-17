const App = React.createClass({
  propTypes: {
    onGroupClick: React.PropTypes.func,
    onTabClick: React.PropTypes.func,
    uiHeightChanged: React.PropTypes.func
  },

  render: function() {
    return React.createElement(GroupList, this.props);
  }
});
