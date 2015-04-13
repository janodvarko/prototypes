/* See license.txt for terms of usage */

define(function(require, exports, module) {

// Dependencies
const React = require("react");

// Firebug SDK
const { Reps } = require("reps/repository");

// RDP Inspector

// Shortcuts
const { TR, TD, TABLE, TBODY, THEAD, TH, DIV, SPAN, CODE } = Reps.DOM;

/**
 * @template xxxHonza TODO docs
 */
var Headers = React.createClass({
/** @lends Headers */

  displayName: "Headers",

  getInitialState: function() {
    return {
    };
  },

  render: function() {
    var data = this.props.data;

    return (
      DIV({className: "netInfoHeadersTable", "role": "tabpanel"},
        DIV({className: "netHeadersGroup collapsed", "data-pref": "netResponseHeadersVisible"},
          DIV({className: "netInfoHeadersGroup netInfoResponseHeadersTitle"},
            SPAN({className: "netHeader twisty",
              onclick: "$toggleHeaderContent"},
              Locale.$STR("jsonViewer.responseHeaders")
            )
          ),
          TABLE({className: "netInfoHeadersTable", cellPadding: 0, cellSpacing: 0},
            HeaderList({headers: data.response})
          )
        ),
        DIV({className: "netHeadersGroup collapsed", "data-pref": "netRequestHeadersVisible"},
          DIV({className: "netInfoHeadersGroup netInfoRequestHeadersTitle"},
            SPAN({className: "netHeader twisty",
              onclick: "$toggleHeaderContent"},
              Locale.$STR("jsonViewer.requestHeaders")
            )
          ),
          TABLE({className: "netInfoHeadersTable", cellPadding: 0, cellSpacing: 0},
            HeaderList({headers: data.request})
          )
        )
      )
    );
  }
});

/**
 * @template xxxHonza TODO docs
 */
var HeaderList = React.createFactory(React.createClass({
/** @lends HeaderList */

  displayName: "HeaderList",

  getInitialState: function() {
    return {
      headers: []
    };
  },

  render: function() {
    var headers = this.props.headers;

    headers.sort(function(a, b) {
      return a.name > b.name ? 1 : -1;
    });

    var rows = [];
    headers.forEach(header => {
      rows.push(
        TR({"role": "listitem"},
          TD({className: "netInfoParamName", "role": "presentation"},
            SPAN({title: header.name}, header.name)
          ),
          TD({className: "netInfoParamValue", "role": "list", "aria-label": "$param.name"},
            CODE({className: "focusRow subFocusRow", "role": "listitem"},
              header.value
            )
          )
        )
      )
    });

    return (
      TBODY({className: "netInfoHeadersBody", "role": "list",
        "aria-label": Locale.$STR("xhrSpy.responseHeaders")},
        rows
      )
    )
  }
}));

// Exports from this module
exports.Headers = React.createFactory(Headers);
});
