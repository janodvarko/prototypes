/* See license.txt for terms of usage */

define(function(require, exports, module) {

// Dependencies
const React = require("react");

// Firebug SDK
const { Reps } = require("reps/repository");

// RDP Inspector
const { HeadersToolbar } = require("./headers-toolbar");
const { Headers } = require("./headers");

// Shortcuts
const { TR, TD, TABLE, TBODY, THEAD, TH, DIV } = Reps.DOM;

/**
 * @template xxxHonza TODO docs
 */
var HeadersPanel = React.createClass({
/** @lends HeadersPanel */

  displayName: "HeadersPanel",

  getInitialState: function() {
    return {
    };
  },

  render: function() {
    var data = JSON.parse(this.props.data);

    return (
      DIV({className: "headersPanelBox"},
        HeadersToolbar(),
        Headers({data: data})
      )
    );
  }
});

// Exports from this module
exports.HeadersPanel = React.createFactory(HeadersPanel);

});
