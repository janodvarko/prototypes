/* See license.txt for terms of usage */

define(function(require, exports, module) {

// ReactJS
var React = require("react");
var ReactBootstrap = require("react-bootstrap");

// Firebug SDK
const { Reps } = require("reps/reps");

// JSON View
const { JsonPanel } = require("./json-panel");
const { TextPanel } = require("./text-panel");
const { HeadersPanel } = require("./headers-panel");

// Constants
const TabbedArea = React.createFactory(ReactBootstrap.TabbedArea);
const TabPane = React.createFactory(ReactBootstrap.TabPane);
const { DIV } = Reps.DOM;

/**
 * @template This object represents the root application template
 * responsible for rendering the basic tab layout.
 */
var MainTabbedArea = React.createClass({
/** @lends MainTabbedArea */

  displayName: "MainTabbedArea",

  getInitialState: function() {
    return {
      json: {},
      headers: {}
   };
  },

  render: function() {
    return (
      TabbedArea({className: "mainTabbedArea", defaultActiveKey: 1,
        animation: false, ref: "tabbedArea"},
        TabPane({eventKey: 1, tab: Locale.$STR("jsonViewer.tab.JSON")},
          JsonPanel({
            data: this.props.json,
            actions: this.props.actions,
            searchFilter: this.state.searchFilter
          })
        ),
        TabPane({eventKey: 2, tab: Locale.$STR("jsonViewer.tab.RawData")},
          TextPanel({
            data: this.props.json,
            actions: this.props.actions
          })
        ),
        TabPane({eventKey: 3, tab: Locale.$STR("jsonViewer.tab.Headers")},
          HeadersPanel({
            data: this.props.headers,
            actions: this.props.actions,
            searchFilter: this.props.searchFilter
          })
        )
      )
    )
  }
});

// Exports from this module
exports.MainTabbedArea = React.createFactory(MainTabbedArea);
});
