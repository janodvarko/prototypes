/* See license.txt for terms of usage */

'use strict';

const { gDevTools } = require("resource:///modules/devtools/gDevTools.jsm");
const React = require("devtools/client/shared/vendor/react");
const TabPanel = require("./tab-panel");

gDevTools.on("inspector-ready", (event, panel, inspector) => {
  addTab(
    inspector,
    "inspector-tab-test",
    "My Tab",
    false
  );
});

function addTab(inspector, id, title, selected) {
  // Following API introduced in bug 1305979.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1305979
  var tabPanel = React.createFactory(TabPanel);
  inspector.addSidebarTab(id, title, tabPanel, selected);
}
