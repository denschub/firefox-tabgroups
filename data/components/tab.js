const Tab = React.createClass({
  render: function() {
    return (
      React.DOM.li(
        {},
        this.props.tab.title
      )
    );
  }
});
