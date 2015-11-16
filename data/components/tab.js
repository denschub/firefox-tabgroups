const Tab = React.createClass({
  propTypes: {
    tab: React.PropTypes.object.isRequired
  },

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
