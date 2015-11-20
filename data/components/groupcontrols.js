const GroupControls = React.createClass({
  propTypes: {
    expanded: React.PropTypes.bool.isRequired,
    onClose: React.PropTypes.func,
    onEdit: React.PropTypes.func,
    onEditAbort: React.PropTypes.func,
    onEditSave: React.PropTypes.func,
    onExpand: React.PropTypes.func
  },

  render: function() {
    let editControls;
    if (this.props.editing) {
      editControls = [
        React.DOM.i({
          className: "group-edit fa fa-fw fa-check",
          onClick: this.props.onEditSave
        }),
        React.DOM.i({
          className: "group-edit fa fa-fw fa-ban",
          onClick: this.props.onEditAbort
        })
      ];
    } else {
      editControls = React.DOM.i({
        className: "group-edit fa fa-fw fa-pencil",
        onClick: this.props.onEdit
      });
    }

    let expanderClasses = classNames({
      "group-expand": true,
      "fa": true,
      "fa-fw": true,
      "fa-chevron-down": !this.props.expanded,
      "fa-chevron-up": this.props.expanded
    });

    return React.DOM.span(
      {
        className: "group-controls"
      },
      editControls,
      React.DOM.i({
        className: "group-close fa fa-fw fa-times",
        onClick: this.props.onClose
      }),
      React.DOM.i({
        className: expanderClasses,
        onClick: this.props.onExpand
      })
    );
  }
});
