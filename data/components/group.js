const Group = React.createClass({
  propTypes: {
    group: React.PropTypes.object.isRequired,
    onGroupClick: React.PropTypes.func,
    onGroupCloseClick: React.PropTypes.func,
    onGroupTitleChange: React.PropTypes.func,
    onTabClick: React.PropTypes.func,
    uiHeightChanged: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      editing: false,
      expanded: false,
      newTitle: this.getTitle()
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
    let titleElement;
    if (this.state.editing) {
      titleElement = React.DOM.input(
        {
          type: "text",
          defaultValue: this.getTitle(),
          onChange: (event) => {
            this.setState({newTitle: event.target.value});
          },
          onKeyUp: this.handleGroupTitleInputKey
        }
      );
    } else {
      titleElement = React.DOM.span({}, this.getTitle());
    }

    let groupClasses = classNames({
      active: this.props.group.active,
      editing: this.state.editing,
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
          {
            className: "group-title"
          },
          titleElement,
          React.createElement(
            GroupControls,
            {
              editing: this.state.editing,
              expanded: this.state.expanded,
              onClose: this.handleGroupCloseClick,
              onEdit: this.handleGroupEditClick,
              onEditAbort: this.handleGroupEditAbortClick,
              onEditSave: this.handleGroupEditSaveClick,
              onExpand: this.handleGroupExpandClick
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

  handleGroupEditClick: function(event) {
    event.stopPropagation();
    this.setState({editing: !this.state.editing});
  },

  handleGroupEditAbortClick: function(event) {
    event.stopPropagation();
    this.setState({editing: false});
  },

  handleGroupEditSaveClick: function(event) {
    event.stopPropagation();
    this.setState({editing: false});
    this.props.onGroupTitleChange(this.props.group.id, this.state.newTitle);
  },

  handleGroupExpandClick: function(event) {
    event.stopPropagation();
    this.setState({expanded: !this.state.expanded});
  },

  handleGroupTitleInputKey: function(event) {
    if (event.keyCode == 13) {
      this.setState({editing: false});
      this.props.onGroupTitleChange(this.props.group.id, this.state.newTitle);
    }
  }
});
