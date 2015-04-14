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
 * @template This template represents a toolbar within
 * the 'JSON' panel.
 */
var JsonToolbar = React.createClass({
/** @lends JsonToolbar */

  displayName: "JsonToolbar",

  render: function() {
    return (
      ButtonToolbar({className: "toolbar"},
        Button({bsSize: "xsmall", onClick: this.onSave},
          Locale.$STR("jsonViewer.Save")
        ),
        Button({bsSize: "xsmall", onClick: this.onCopy},
          Locale.$STR("jsonViewer.Copy")
        )
      )
    )
  },

  // Commands

  onSave: function(event) {
  },

  onCopy: function(event) {
  },
});

// Exports from this module
exports.JsonToolbar = React.createFactory(JsonToolbar);
});
