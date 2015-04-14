/* See license.txt for terms of usage */

define(function(require, exports, module) {

// ReactJS
const React = require("react");

// Firebug SDK
const { Reps } = require("reps/repository");

// RDP Inspector
const { TextToolbar } = require("./text-toolbar");

// Constants
const { DIV, PRE } = Reps.DOM;

/**
 * @template This template represents the 'Raw Data' panel displaying
 * JSON as a text received from the server.
 */
var TextPanel = React.createClass({
/** @lends TextPanel */

  displayName: "TextPanel",

  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      DIV({className: "textPanelBox"},
        TextToolbar({actions: this.props.actions}),
        PRE({className: "data"}, this.props.data)
      )
    );
  }
});

// Exports from this module
exports.TextPanel = React.createFactory(TextPanel);
});
