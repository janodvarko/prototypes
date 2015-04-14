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
 * @template This object represents a toolbar displayed within the
 * 'Raw Data' panel.
 */
var TextToolbar = React.createClass({
/** @lends TextToolbar */

  displayName: "TextToolbar",

  render: function() {
    return (
      ButtonToolbar({className: "toolbar"},
        Button({bsSize: "xsmall", onClick: this.onPrettify},
          Locale.$STR("jsonViewer.PrettyPrint")
        ),
        Button({bsSize: "xsmall", onClick: this.onCopy},
          Locale.$STR("jsonViewer.Copy")
        )
      )
    )
  },

  // Commands

  onPrettify: function(event) {
  },

  onCopy: function(event) {
  },
});

// Exports from this module
exports.TextToolbar = React.createFactory(TextToolbar);
});
