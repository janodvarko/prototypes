/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { DOM, createClass, PropTypes } = require("devtools/client/shared/vendor/react");

// Shortcuts
const { div } = DOM;

/**
 * Custom Inspector side-panel
 */
var TabPanel = createClass({
  displayName: "TabPanel",

  render: function () {
    return (
      div({className: "tab-panel"},
        "Hello World!"
      )
    );
  }
});

module.exports = TabPanel;
