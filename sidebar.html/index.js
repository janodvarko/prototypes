/* See license.txt for terms of usage */

"use strict";

window.trace = function(message, obj) {
  console.log(message, obj)
}

var Tabbar = React.createFactory(require("devtools/client/shared/components/tabs/tabbar"));
var SidePanel = React.createFactory(require("devtools/client/inspector/components/side-panel"));

// Render the Tabbar
let content = document.getElementById("content");
let tabbar = ReactDOM.render(Tabbar({}), content);

// Shortcuts
const { div, input, button, label, span } = React.DOM;

var TestPanel = React.createFactory(React.createClass({
  displayName: "TestPanel",

  componentDidMount: function () {
    console.log('componentDidMount ' + this.props.id);
  },

  componentWillUnmount: function () {
    console.log('componentWillUnmount ' + this.props.id);
  },

  render: function () {
    let boxStyle = {
      overflow: 'auto',
      height: '100%',
    }

    let style = {
      height: '2500px',
    };

    return (
      div({style: boxStyle},
        input({type: "checkbox", id: "checkbox"}),
        span({}, "check box"),
        div({style: style}, "this should scroll xxx")
      )
    )
  }
}));

tabbar.addTab("tab1", "tab1.html", false, TestPanel);
tabbar.addTab("tab2", "tab2.html", false, TestPanel);
