const App = React.createClass({
  render: function() {
    return React.createElement(GroupList, {
      uiHeightChanged: this.props.uiHeightChanged
    });
  }
});
