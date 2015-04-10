/* See license.txt for terms of usage */

define(function(require, exports, module) {

// Dependencies
const React = require("react");

// Firebug SDK
const { Reps } = require("reps/repository");
const { TreeView } = require("reps/tree-view");

// RDP Inspector
const { JsonToolbar } = require("./json-toolbar");

// Shortcuts
const { TR, TD, TABLE, TBODY, THEAD, TH, DIV } = Reps.DOM;

/**
 * @template xxxHonza TODO docs
 */
var JsonPanel = React.createClass({
/** @lends JsonPanel */

  displayName: "JsonPanel",

  getInitialState: function() {
    return {
    };
  },

  render: function() {
    var content;

    try {
      var data = JSON.parse(this.props.data);
      content = TreeView({
        data: data,
        mode: "tiny"
      });
    } catch (err) {
      content = DIV({className: "jsonTree"},
        err + ""
      );
    }

    return (
      DIV({className: "JsonPanelBox"},
        JsonToolbar(),
        DIV({className: "jsonTree"},
          content
        )
      )
    );
  }
});

// Exports from this module
exports.JsonPanel = React.createFactory(JsonPanel);
});
