/* See license.txt for terms of usage */

define(function(require, exports, module) {

// For smooth incremental searching (in case the user is typing quickly).
const searchDelay = 150;

/**
 * This object represents a search box located at the
 * top right corner of the app.
 */
var SearchBox =
/** @lends SearchBox */
{
  create: function(parentNode) {
    var doc = parentNode.ownerDocument;
    var tabArea = doc.querySelector(".mainTabbedArea.nav-tabs");
    var item = doc.createElement("li");
    tabArea.appendChild(item);

    // Search box
    var searchBox = doc.createElement("input");
    searchBox.setAttribute("class", "searchBox");
    searchBox.setAttribute("type", "search");
    searchBox.setAttribute("results", "true");
    searchBox.setAttribute("placeholder", "Filter JSON");
    item.appendChild(searchBox);

    searchBox.addEventListener("command", this.onChange.bind(this, searchBox), false);
    searchBox.addEventListener("input", this.onChange.bind(this, searchBox), false);
    searchBox.addEventListener("keypress", this.onKeyPress.bind(this, searchBox), false);
  },

  destroy: function(parentNode) {
    var doc = parentNode.ownerDocument;
    var searchBox = doc.querySelector(".searchBox");
    searchBox.remove();
  },

  onKeyPress: function(searchBox, event) {
    this.onSearch(searchBox);
  },

  onChange: function(searchBox, event) {
    this.onSearch(searchBox);
  },

  onSearch: function(searchBox) {
    var win = searchBox.ownerDocument.defaultView;

    if (this.searchTimeout) {
      win.clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = win.setTimeout(this.doSearch.bind(this, searchBox),
      searchDelay);
  },

  doSearch: function(searchBox) {
    var win = searchBox.ownerDocument.defaultView;
    var event = new win.MessageEvent("search", {
      data: searchBox.value,
    });

    win.dispatchEvent(event);
  }
}

// Exports from this module
exports.SearchBox = SearchBox;
});
