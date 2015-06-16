/* See license.txt for terms of usage */

define(function(require, exports, module) {

// Dependencies
const React = require("react");
const { Reps } = require("reps/repository");
const { isCropped } = require("reps/string");
const { TR, TD, SPAN, TABLE, TBODY, DIV } = Reps.DOM;

var uid = 0;

/**
 * @template TODO docs
 */
var JsonTree = React.createFactory(React.createClass(
/** @lends JsonTree */
{
  displayName: "JsonTree",

  getInitialState: function() {
    return {
      data: {},
      searchFilter: null
    };
  },

  // Rendering

  render: function() {
    var mode = this.props.mode;
    var root = this.state.data;

    var children = [];

    if (Array.isArray(root)) {
      for (var i=0; i<root.length; i++) {
        var child = root[i];
        children.push(TreeNode({
          key: child.key,
          data: child,
          mode: mode,
          searchFilter: this.state.searchFilter || this.props.searchFilter
        }));
      }
    } else {
      children.push(root);
    }

    return (
      DIV({className: "domTable", cellPadding: 0, cellSpacing: 0,
        onClick: this.onClick},
          children
      )
    );
  },

  // Data

  componentDidMount: function() {
    var members = initMembers(this.props.data, 0);
    this.setState({data: members, searchFilter: this.props.searchFilter});
  },

  componentWillReceiveProps: function(nextProps) {
    var updatedState = {
      searchFilter: nextProps.searchFilter
    };

    if (this.props.data !== nextProps.data) {
      updatedState.data = initMembers(nextProps.data, 0);
    }

    this.setState(updatedState);
  }
}));

/**
 * @template TODO docs
 */
var TreeNode = React.createFactory(React.createClass(
/** @lends TreeNode */
{
  displayName: "TreeNode",

  getInitialState: function() {
    return { data: {}, searchFilter: null };
  },

  componentDidMount: function() {
    this.setState({data: this.props.data});
  },

  render: function() {
    var member = this.state.data;
    var mode = this.props.mode;

    var classNames = ["memberRow"];
    classNames.push(member.type + "Row");

    if (member.hasChildren) {
      classNames.push("hasChildren");
    }

    if (member.open) {
      classNames.push("opened");
    }

    if (!member.children) {
      // Cropped strings are expandable, but they don't have children.
      var isString = typeof(member.value) == "string";
      if (member.hasChildren && !isString) {
        member.children = initMembers(member.value);
      } else {
        member.children = [];
      }
    }

    var children = [];
    if (member.open && member.children.length) {
      for (var i in member.children) {
        var child = member.children[i];
        children.push(TreeNode({
          key: child.key,
          data: child,
          mode: mode,
          searchFilter: this.state.searchFilter || this.props.searchFilter
        }));
      };
    }

    var filter = this.props.searchFilter;
    var name = member.name || "";
    var value = member.value || "";

    if (filter && (name.indexOf(filter) < 0)) {
      // Cache the stringify result, so the filtering is fast
      // the next time.
      if (!member.valueString) {
        member.valueString = JSON.stringify(value);
      }

      if (member.valueString && member.valueString.indexOf(filter) < 0) {
        classNames.push("hidden");
      }
    }

    var TAG = Reps.getRep(member.value);
    return (
      DIV({className: classNames.join(" "), onClick: this.onClick},
        SPAN({className: "memberLabelCell"},
          SPAN({className: "memberLabel " + member.type + "Label"},
            member.name)
        ),
        SPAN({className: "memberValueCell"},
          SPAN({},
            TAG({
              object: member.value,
              mode: this.props.mode,
              member: member
            })
          )
        ),
        DIV({className: "memberChildren", colspan: "2"},
          children
        )
      )
    )
  },

  onClick: function(event) {
    var member = this.state.data;
    member.open = !member.open;

    this.setState({data: member});

    event.stopPropagation();
  },
}));

// Helpers

function initMembers(parent) {
  var members = getMembers(parent);
  return members;
}

function getMembers(object) {
  var members = [];
  getObjectProperties(object, function(prop, value) {
    var valueType = typeof(value);
    var hasChildren = (valueType === "object" && hasProperties(value));

    // Cropped strings are expandable, so the user can see the
    // entire original value.
    if (isCropped(value)) {
      hasChildren = true;
    }

    var type = getType(value);
    var member = createMember(type, prop, value, hasChildren);
    members.push(member);
  });

  return members;
}

function createMember(type, name, value, hasChildren) {
  var member = {
    name: name,
    type: type,
    rowClass: "memberRow-" + type,
    open: "",
    hasChildren: hasChildren,
    value: value,
    open: false,
    key: uid++
  };

  return member;
}

function getObjectProperties(obj, callback) {
  for (var p in obj) {
    try {
      callback.call(this, p, obj[p]);
    }
    catch (e) {
      console.log(e)
      Trace.sysout("domTree.getObjectProperties; EXCEPTION " + e, e);
    }
  }
}

function hasProperties(obj) {
  if (typeof(obj) == "string") {
    return false;
  }

  try {
    for (var name in obj) {
      return true;
    }
  }
  catch (exc) {
  }

  return false;
}

function getType(object) {
  // A type provider (or a decorator) should be used here.
  return "dom";
}

// Exports from this module
exports.JsonTree = JsonTree;
});
