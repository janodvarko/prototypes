/* See license.txt for terms of usage */

define(function(require, exports, module) {

// Dependencies
const React = require("react");

// Firebug SDK
const { Reps } = require("reps/repository");

// RDP Inspector
const { TextToolbar } = require("./text-toolbar");

// Shortcuts
const { DIV, PRE } = Reps.DOM;

/**
 * @template xxxHonza TODO docs
 */
var TextPanel = React.createClass({
/** @lends TextPanel */

  displayName: "TextPanel",

  getInitialState: function() {
    return {
    };
  },

  render: function() {
    //var json = JSON.parse(this.props.data);
    //var jsonPretty = JSON.stringify(json, null, 2);

    return (
      DIV({className: "TextPanelBox"},
        TextToolbar(),
        PRE({className: "data"}, this.props.data)
      )
    );
  }
});

// Exports from this module
exports.TextPanel = React.createFactory(TextPanel);

});
