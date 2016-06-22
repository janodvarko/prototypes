/* See license.txt for terms of usage */

"use strict";

require("babel-core/register");
require("babel-polyfill");

const { createFactories } = require("devtools/client/shared/components/reps/rep-utils");
const { Rep } = createFactories(require("devtools/client/shared/components/reps/rep"));
const { Grip } = require("devtools/client/shared/components/reps/grip");
const { connectClient, connectTab } = require("./client");
const TreeView = React.createFactory(require("devtools/client/shared/components/tree/tree-view"));

window._a = {
  person: {
    name: "Jan",
    age: 40
  },
  children: [
    {
      name: "Katerina"
    },
    {
      name: "Tomas"
    },
    {
      name: "Teodor"
    }
  ],
  strProp: "test string",
  array: [1, 2, 3,],
}

// Client Connect

var tabTarget = null;

/**
 * Connect to the backend.
 */
window.onConnect = function(event) {
  connectClient().then(response => {
    let selectedTab = response.tabs[0];
    connectTab(selectedTab).then(target => {
      $("#status").innerHTML = "Connected to: " + selectedTab.url;

      tabTarget = target;

      window.onEvaluate();
    });
  });
}

window.onEvaluate = function() {
  let expression = $("#expression").value;

  getGrip(tabTarget, expression).then(grip => {
    let rep = Rep({object: grip, defaultRep: Grip});
    var theApp = ReactDOM.render(
      rep,
      $("#result")
    );

    renderResponse(grip);
  });
}

window.onParse = function() {
  let json = $("#mockedGrip").value;

  let grip;

  try {
    grip = JSON.parse(json);
  } catch (err) {
    $("#parseError").innerHTML = err;
    return;
  }

  let rep = Rep({object: grip, defaultRep: Grip});
  var theApp = ReactDOM.render(
    rep,
    $("#result")
  );

  renderResponse(grip);
}

function getGrip(target, expression) {
  return new Promise((resolve, reject) => {
    target.activeConsole.evaluateJSAsync(expression, res => {
      resolve(res.result);
    });
  });
}

function renderResponse(response) {
  let columns = [{
    "id": "value"
  }];

  let renderValue = props => {
    return Rep(props);
  };

  var tree = TreeView({
    className: "border",
    object: response,
    mode: "short",
    columns: columns,
    renderValue: renderValue,
  });

  ReactDOM.render(
    tree,
    $("#response")
  );

  $("#json").innerHTML = JSON.stringify(response);
}

// Helpers

function $(selector) {
  return document.querySelector(selector);
}
