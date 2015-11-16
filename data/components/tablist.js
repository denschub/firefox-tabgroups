const TabList = React.createClass({
  propTypes: {
    tabs: React.PropTypes.array.isRequired
  },

  render: function() {
    return (
      React.DOM.ul(
        {className: "tab-list"},
        this.props.tabs.map((tab) => {
          return React.createElement(Tab, {key: tab.index, tab: tab});
        })
      )
    );
  }
});
