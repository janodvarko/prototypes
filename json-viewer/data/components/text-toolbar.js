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
var TextToolbar = React.createClass({
/** @lends TextToolbar */

  displayName: "TextToolbar",

  render: function() {
    return (
      ButtonToolbar({className: "toolbar"},
        Button({bsSize: "xsmall", onClick: this.onPrettify},
          "Pretty Print"
        )
      )
    )
  },

  // Commands

  onPrettify: function(event) {
    // xxxHonza: TODO
    alert("TODO");
  },
});

// Exports from this module
exports.TextToolbar = React.createFactory(TextToolbar);
});
