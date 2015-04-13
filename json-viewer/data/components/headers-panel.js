/* See license.txt for terms of usage */

define(function(require, exports, module) {

// Dependencies
const React = require("react");

// Firebug SDK
const { Reps } = require("reps/repository");
const { TreeView } = require("reps/tree-view");

// RDP Inspector
const { HeadersToolbar } = require("./headers-toolbar");

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
    console.log("data", data)
    var content = TreeView({
      data: data
    });

    return (
      DIV({className: "HeadersPanelBox"},
        HeadersToolbar(),
        content
      )
    );
  }
});

// Exports from this module
exports.HeadersPanel = React.createFactory(HeadersPanel);

});
