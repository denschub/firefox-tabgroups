const GroupAddButton = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func
  },

  render: function() {
    return (
      React.DOM.li(
        {
          className: "group",
          onClick: this.handleClick
        },
        React.DOM.span(
          {className: "group-title"},
          addon.options.l10n.add_group
        )
      )
    );
  },

  handleClick: function(event) {
    event.stopPropagation();
    this.props.onClick();
  }
});
