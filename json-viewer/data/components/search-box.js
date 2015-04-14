/* See license.txt for terms of usage */

define(function(require, exports, module) {

// ReactJS
var React = require("react");

// Firebug SDK
const { Reps } = require("reps/reps");

// Constants
const { INPUT } = Reps.DOM;

// For smooth incremental searching (in case the user is typing quickly).
const searchDelay = 250;

/**
 * This object represents a search box located at the
 * top right corner of the application.
 *
 * xxxHonza localization
 */
var SearchBox = React.createClass(
/** @lends SearchBox */
{
  render: function() {
    return (
      INPUT({className: "searchBox", placeholder: "Filter JSON",
        ref: "searchBox", onChange: this.onChange})
    )
  },

  onChange: function(event) {
    this.onSearch();
  },

  onSearch: function() {
    var searchBox = this.refs.searchBox.getDOMNode();
    var win = searchBox.ownerDocument.defaultView;

    if (this.searchTimeout) {
      win.clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = win.setTimeout(this.doSearch.bind(this),
      searchDelay);
  },

  doSearch: function(searchBox) {
    var searchBox = this.refs.searchBox.getDOMNode();
    this.props.actions.onSearch(searchBox.value);
  }
});

// Exports from this module
exports.SearchBox = React.createFactory(SearchBox);
});
