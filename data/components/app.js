const App = React.createClass({
  propTypes: {
    onTabClick: React.PropTypes.func,
    uiHeightChanged: React.PropTypes.func
  },

  render: function() {
    return React.createElement(GroupList, this.props);
  }
});
