/* See license.txt for terms of usage */

define(function(require, exports, module) {

// ReactJS
var React = require("react");
var ReactBootstrap = require("react-bootstrap");

// Constants
var ButtonToolbar = React.createFactory(ReactBootstrap.ButtonToolbar);
var Button = React.createFactory(ReactBootstrap.Button);

const { Reps } = require("reps/reps");
const { DIV } = Reps.DOM;

/**
 * @template This template is responsible for rendering a toolbar
 * within the 'Headers' panel.
 */
var HeadersToolbar = React.createClass({
/** @lends HeadersToolbar */

  displayName: "HeadersToolbar",

  render: function() {
    return (
      ButtonToolbar({className: "toolbar"},
        Button({bsSize: "xsmall", onClick: this.onCopy},
          Locale.$STR("jsonViewer.Copy")
        )
      )
    )
  },

  // Commands

  onCopy: function(event) {
    this.props.actions.onCopyHeaders();
  },
});

// Exports from this module
exports.HeadersToolbar = React.createFactory(HeadersToolbar);
});
