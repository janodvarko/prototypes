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

/**
 * Render the main application component. It's the main tab bar displayed
 * at the top of the window. This component also represents ReacJS root.
 */
var content = document.getElementById("content");
var json = document.getElementById("json");
var headers = document.getElementById("headers");
var input = {
  json: json.textContent,
  headers: headers.textContent
}

json.remove();
headers.remove();

var theApp = React.render(MainTabbedArea(input), content);
var resizer = new Resizer(window, theApp);

// End of main.js
});
