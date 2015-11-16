const App = React.createClass({
  propTypes: {
    uiHeightChanged: React.PropTypes.func
  },

  render: function() {
    return React.createElement(GroupList, {
      uiHeightChanged: this.props.uiHeightChanged
    });
  }
});
