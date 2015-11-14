const Group = React.createClass({
  getInitialState: function() {
    return {
      expanded: false
    };
  },

  componentDidUpdate: function() {
    resizePanel();
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

    let expanderClasses = classNames({
      "group-expand": true,
      "fa": true,
      "fa-fw": true,
      "fa-chevron-down": !this.state.expanded,
      "fa-chevron-up": this.state.expanded
    });

    return (
      React.DOM.li(
        {
          className: groupClasses,
          onClick: this.handleGroupClick
        },
        [
          React.DOM.span(
            {className: "group-title"},
            [
              this.getTitle(),
              React.DOM.span(
                {
                  className: "group-controls"
                },
                [
                  React.DOM.i({
                    className: "group-edit fa fa-fw fa-pencil",
                    onClick: this.handleEditClick
                  }),
                  React.DOM.i({
                    className: "group-close fa fa-fw fa-times",
                    onClick: this.handleCloserClick
                  }),
                  React.DOM.i({
                    className: expanderClasses,
                    onClick: this.handleExpanderClick
                  })
                ]
              )
            ]
          ),
          this.state.expanded && React.createElement(
            TabList,
            {tabs: this.props.group.tabs}
          )
        ]
      )
    );
  },

  handleGroupClick: function() {
  },

  handleEditClick: function() {
  },

  handleCloserClick: function() {
  },

  handleExpanderClick: function() {
    this.setState({expanded: !this.state.expanded});
  }
});
