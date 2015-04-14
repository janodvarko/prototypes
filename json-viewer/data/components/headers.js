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
      DIV({className: "netInfoHeadersTable"},
        DIV({className: "netHeadersGroup"},
          DIV({className: "netInfoHeadersGroup"},
            SPAN({className: "netHeader twisty"},
              Locale.$STR("jsonViewer.responseHeaders")
            )
          ),
          TABLE({cellPadding: 0, cellSpacing: 0},
            HeaderList({headers: data.response})
          )
        ),
        DIV({className: "netHeadersGroup"},
          DIV({className: "netInfoHeadersGroup"},
            SPAN({className: "netHeader twisty"},
              Locale.$STR("jsonViewer.requestHeaders")
            )
          ),
          TABLE({cellPadding: 0, cellSpacing: 0},
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
          TD({className: "netInfoParamName"},
            SPAN({title: header.name}, header.name)
          ),
          TD({className: "netInfoParamValue"},
            CODE({}, header.value)
          )
        )
      )
    });

    return (
      TBODY({},
        rows
      )
    )
  }
}));

// Exports from this module
exports.Headers = React.createFactory(Headers);
});
