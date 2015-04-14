/* See license.txt for terms of usage */

define(function(require, exports, module) {

// ReactJS
const React = require("react");

// Firebug SDK
const { Reps } = require("reps/repository");

// Constants
const { TR, TD, TABLE, TBODY, THEAD, TH, DIV, SPAN, CODE } = Reps.DOM;

/**
 * @template This template is responsible for rendering basic layout
 * of the 'Headers' panel. It displays HTTP headers groups such as
 * received or response headers.
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
 * @template This template renders headers list,
 * name + value pairs.
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
        TR({},
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
