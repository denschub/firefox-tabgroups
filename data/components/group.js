const Group = React.createClass({
  propTypes: {
    group: React.PropTypes.object.isRequired,
    onGroupClick: React.PropTypes.func,
    onGroupCloseClick: React.PropTypes.func,
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
    return this.props.group.title || (
      addon.options.l10n.unnamed_group + " " + this.props.group.id
    );
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
              onClose: this.handleGroupCloseClick,
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

  handleGroupCloseClick: function(event) {
    event.stopPropagation();
    this.props.onGroupCloseClick(this.props.group.id);
  },

  handleGroupClick: function(event) {
    event.stopPropagation();
    this.props.onGroupClick(this.props.group.id);
  },

  handleExpanderClick: function(event) {
    event.stopPropagation();
    this.setState({expanded: !this.state.expanded});
  }
});
