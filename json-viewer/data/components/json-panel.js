/* See license.txt for terms of usage */

define(function(require, exports, module) {

// ReactJS
const React = require("react");

// Firebug SDK
const { Reps } = require("reps/repository");
const { TreeView } = require("reps/tree-view");

// RDP Inspector
const { JsonToolbar } = require("./json-toolbar");

// Constants
const { DIV } = Reps.DOM;

/**
 * @template This template represents the 'JSON' panel and responsible
 * for rendering its content.
 */
var JsonPanel = React.createClass({
/** @lends JsonPanel */

  displayName: "JsonPanel",

  getInitialState: function() {
    return {};
  },

  render: function() {
    var content;

    try {
      content = TreeView({
        data: this.props.data,
        mode: "tiny",
        searchFilter: this.props.searchFilter
      });
    } catch (err) {
      content = DIV({className: "jsonTree"},
        err + ""
      );
    }

    return (
      DIV({className: "jsonPanelBox"},
        JsonToolbar({actions: this.props.actions}),
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
