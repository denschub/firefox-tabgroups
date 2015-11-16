const Group = React.createClass({
  propTypes: {
    group: React.PropTypes.object.isRequired,
    onTabClick: React.PropTypes.func,
    uiHeightChanged: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      expanded: false
    };
  },

  componentDidUpdate: function() {
    this.props.uiHeightChanged && this.props.uiHeightChanged();
  },

  getTitle: function() {
    return this.props.group.title || addon.options.l10n.unnamed_group;
  },

  render: function() {
    let groupClasses = classNames({
      active: this.props.group.active,
      expanded: this.state.expanded,
      group: true
    });

    return (
      React.DOM.li(
        {
          className: groupClasses,
          onClick: this.handleGroupClick
        },
        React.DOM.span(
          {className: "group-title"},
          this.getTitle(),
          React.createElement(
            GroupControls,
            {
              expanded: this.state.expanded,
              onExpand: this.handleExpanderClick
            }
          )
        ),
        this.state.expanded && React.createElement(
          TabList,
          {
            tabs: this.props.group.tabs,
            onTabClick: this.props.onTabClick
          }
        )
      )
    );
  },

  handleExpanderClick: function() {
    this.setState({expanded: !this.state.expanded});
  }
});
