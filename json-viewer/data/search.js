/* See license.txt for terms of usage */

define(function(require, exports, module) {

/**
 * This object is responsible for handling search events and
 * update the application UI.
 */
function Search(win, app) {
  this.win = win;
  this.app = app;

  this.win.addEventListener("search", this.onSearch.bind(this));
}

Search.prototype =
/** @lends Search */
{
  onSearch: function(event) {
    var value = event.data;
    this.app.setState({searchFilter: value});
  },
}

// Exports from this module
exports.Search = Search;
});
