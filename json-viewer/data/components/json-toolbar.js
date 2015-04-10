/* See license.txt for terms of usage */

define(function(require, exports, module) {

// Dependencies
var React = require("react");
var ReactBootstrap = require("react-bootstrap");

// Shortcuts
var ButtonToolbar = React.createFactory(ReactBootstrap.ButtonToolbar);
var Button = React.createFactory(ReactBootstrap.Button);

const { Reps } = require("reps/reps");
const { DIV } = Reps.DOM;

/**
 * xxxHonza: TODO docs localization
 */
var JsonToolbar = React.createClass({
/** @lends JsonToolbar */

  displayName: "JsonToolbar",

  render: function() {
    return (
      ButtonToolbar({className: "toolbar"},
        Button({bsSize: "xsmall", onClick: this.onSave},
          "Save"
        )
      )
    )
  },

  // Commands

  onSave: function(event) {
    // xxxHonza: TODO
    alert("TODO");
  },
});

// Exports from this module
exports.JsonToolbar = React.createFactory(JsonToolbar);
});
