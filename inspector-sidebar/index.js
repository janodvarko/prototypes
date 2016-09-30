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
  var tabPanel = React.createFactory(TabPanel);
  inspector.sidebar._tabbar.addTab(id, title, selected, tabPanel);
  inspector.sidebar.emit("new-tab-registered", id);

  // As soon as bug 1305979 is fixed the code should look like
  // as follows:
  // var tabPanel = React.createFactory(TabPanel);
  // inspector.addSidebarTab(id, title, tabPanel, selected);
}
