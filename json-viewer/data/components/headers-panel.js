/* See license.txt for terms of usage */

define(function(require, exports, module) {

// ReactJS
const React = require("react");

// Firebug SDK
const { Reps } = require("reps/repository");

// RDP Inspector
const { HeadersToolbar } = require("./headers-toolbar");
const { Headers } = require("./headers");

// Constants
const { TR, TD, TABLE, TBODY, THEAD, TH, DIV } = Reps.DOM;

/**
 * @template This template represents the 'Headers' panel
 * s responsible for rendering its content.
 */
var HeadersPanel = React.createClass({
/** @lends HeadersPanel */

  displayName: "HeadersPanel",

  getInitialState: function() {
    return {
      data: {}
    };
  },

  render: function() {
    var data = this.props.data;

    return (
      DIV({className: "headersPanelBox"},
        HeadersToolbar({actions: this.props.actions}),
        Headers({data: data})
      )
    );
  }
});

// Exports from this module
exports.HeadersPanel = React.createFactory(HeadersPanel);
});
