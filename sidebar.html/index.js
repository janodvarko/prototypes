/* See license.txt for terms of usage */

"use strict";

var Sidebar = React.createFactory(require("devtools/client/shared/components/tabs/sidebar"));

// Render the Sidebar.
let content = document.getElementById("content");
let sidebar = ReactDOM.render(Sidebar({}), content);

sidebar.addTab("tab1", "tab1.html");
sidebar.addTab("tab2", "tab2.html", true);
