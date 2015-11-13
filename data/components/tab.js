const Tab = React.createClass({
  render: function() {
    let tabClasses = classNames({
      active: this.props.tab.active,
      tab: true
    });

    return (
      React.DOM.li({className: tabClasses}, this.props.tab.title)
    );
  }
});
