const TabList = React.createClass({
  propTypes: {
    onTabClick: React.PropTypes.func,
    tabs: React.PropTypes.array.isRequired
  },

  render: function() {
    return (
      React.DOM.ul(
        {className: "tab-list"},
        this.props.tabs.map((tab) => {
          return React.createElement(Tab, {
            key: tab.index,
            tab: tab,
            onTabClick: this.props.onTabClick,
            uiHeightChanged: this.props.uiHeightChanged
          });
        })
      )
    );
  }
});
