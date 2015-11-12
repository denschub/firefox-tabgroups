const Group = React.createClass({
  render: function() {
    return (
      React.DOM.div(
        {},
        [
          React.DOM.div(
            { className: "group-title" },
            this.props.group.title
          ),
          React.createElement(
            TabList,
            { tabs: this.props.group.tabs }
          )
        ]
      )
    );
  }
});
