"use strict";

const { DebuggerClient } = require("devtools-sham/shared/client/main");
const { DebuggerTransport } = require("devtools-sham/transport/transport");
const { TargetFactory } = require("devtools-sham/client/framework/target");
const defer = require("devtools/shared/defer");

let debuggerClient = null;
let threadClient = null;
let tabTarget = null;

function getThreadClient() {
  return threadClient;
}

function setThreadClient(client) {
  threadClient = client;
}

function getTabTarget() {
  return tabTarget;
}

function setTabTarget(target) {
  tabTarget = target;
}

function lookupTabTarget(tab) {
  const options = { client: debuggerClient, form: tab, chrome: false };
  return TargetFactory.forRemoteTab(options);
}

function connectClient() {
  const deferred = defer();
  let isConnected = false;

  const socket = new WebSocket("ws://localhost:9000");
  const transport = new DebuggerTransport(socket);
  debuggerClient = new DebuggerClient(transport);

  // TODO: the timeout logic should be moved to DebuggerClient.connect.
  setTimeout(() => {
    if (isConnected) {
      return;
    }

    deferred.resolve([]);
  }, 1000);

  debuggerClient.connect().then(() => {
    isConnected = true;
    return debuggerClient.listTabs().then(response => {
      deferred.resolve(response);
    });
  }).catch(err => {
    console.log(err);
    deferred.reject();
  });

  return deferred.promise;
}

function connectTab(tab) {
  return new Promise((resolve, reject) => {
    window.addEventListener("beforeunload", () => {
      getTabTarget() && getTabTarget().destroy();
    });

    lookupTabTarget(tab).then(target => {
      tabTarget = target;
      target.activeTab.attachThread({}, (res, _threadClient) => {
        threadClient = _threadClient;
        threadClient.resume();
        resolve(target);
      });
    });
  });
}

function initPage(actions) {
  tabTarget = getTabTarget();
  threadClient = getThreadClient();

  setupCommands({ threadClient, tabTarget });

  tabTarget.on("will-navigate", actions.willNavigate);
  tabTarget.on("navigate", actions.navigate);

  // Listen to all the requested events.
  setupEvents({ threadClient, actions });
  Object.keys(clientEvents).forEach(eventName => {
    threadClient.addListener(eventName, clientEvents[eventName]);
  });

  // In Firefox, we need to initially request all of the sources which
  // makes the server iterate over them and fire individual
  // `newSource` notifications. We don't need to do anything with the
  // response since `newSource` notifications are fired.
  threadClient.getSources();
}

module.exports = {
  connectClient,
  connectTab,
  getThreadClient,
  setThreadClient,
  getTabTarget,
  setTabTarget,
  initPage
};
