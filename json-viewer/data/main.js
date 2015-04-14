/* See license.txt for terms of usage */

define(function(require, exports, module) {

// ReactJS
var React = require("react");

// RDP Inspector
var { MainTabbedArea } = require("components/main-tabbed-area");
var { Resizer } = require("resizer");

// Register localization bundles.
Locale.registerStringBundle("chrome://jsonviewer-firebug.sdk/locale/reps.properties");
Locale.registerStringBundle("chrome://jsonviewer/locale/json-viewer.properties");

var json = document.getElementById("json");
var headers = document.getElementById("headers");

var input = {
  jsonText: json.textContent,
  headersText: headers.textContent,
  json: JSON.parse(json.textContent),
  headers: JSON.parse(headers.textContent),
}

json.remove();
headers.remove();

/**
 * Application actions/commands
 */
input.actions = {
  onCopyJson: function() {
    this.onCopy(input.json);
  },

  onSaveJson: function() {
    this.onSave(input.json);
  },

  onCopyHeaders: function() {
    this.onCopy(input.headers);
  },

  onCopy: function(data) {
    var value = JSON.stringify(data, null, "  ");
    postChromeMessage("copy", value);
  },

  onSave: function(data) {
    var value = JSON.stringify(data, null, "  ");
    postChromeMessage("save", value);
  },

  onSearch: function(value) {
    theApp.setState({searchFilter: value});
  }
}

/**
 * Render the main application component. It's the main tab bar displayed
 * at the top of the window. This component also represents ReacJS root.
 */
var content = document.getElementById("content");
var theApp = React.render(MainTabbedArea(input), content);
var resizer = new Resizer(window, theApp);

// End of main.js
});
