/* See license.txt for terms of usage */

"use strict";

// Add-on SDK
const { Cc, Ci, components } = require("chrome");

// Platform
const globalMM = Cc["@mozilla.org/globalmessagemanager;1"].
  getService(Ci.nsIMessageListenerManager);

function onLoad(options, callbacks) {
  const url = module.uri.replace("main.js", "convertor.js");
  globalMM.loadFrameScript(url, true);
};

function onUnload(reason) {
};

// Exports from this module
exports.main = onLoad;
exports.onUnload = onUnload;
