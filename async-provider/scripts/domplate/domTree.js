/* See license.txt for terms of usage */

define([
    "domplate/domplate",
    "core/lib",
    "core/trace"
],
function(Domplate, Lib, Trace) {
with (Domplate) {

// ********************************************************************************************* //

function DomTree(provider)
{
    this.provider = provider;
}

/**
 * @domplate Represents a tree of properties/objects
 */
DomTree.prototype = domplate(
{
    tag:
        TABLE({"class": "domTable", cellpadding: 0, cellspacing: 0, onclick: "$onClick"},
            TBODY(
                FOR("member", "$object|memberIterator", 
                    TAG("$member|getRowTag", {member: "$member"}))
            )
        ),

    rowTag:
        TR({"class": "memberRow $member.open $member.type\\Row $member|hasChildren", 
            $hasChildren: "$member|hasChildren",
            _repObject: "$member", level: "$member.level"},
            TD({"class": "memberLabelCell", style: "padding-left: $member|getIndent\\px"},
                SPAN({"class": "memberLabel $member.type\\Label"}, "$member|getLabel")
            ),
            TD({"class": "memberValueCell"},
                TAG("$member|getValueTag", {object: "$member|getValue"})
            )
        ),

    loop:
        FOR("member", "$members", 
            TAG("$member|getRowTag", {member: "$member"})),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    hasChildren: function(object)
    {
        return object.hasChildren ? "hasChildren" : "";
    },

    getIndent: function(member)
    {
        return member.level * 16;
    },

    getLabel: function(member)
    {
        if (member.provider)
            return member.provider.getLabel(member.value);

        return member.name;
    },

    getValue: function(member)
    {
        if (member.provider)
            return member.provider.getValue(member.value);

        return member.value;
    },

    getValueTag: function(member)
    {
        // Get proper UI template for the value.
        var value = this.getValue(member);
        var valueTag = DomTree.Reps.getRep(value);
        return valueTag.tag;
    },

    getRowTag: function(member)
    {
        return this.rowTag;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Evenet Handlers

    onClick: function(event)
    {
        var e = Lib.fixEvent(event);
        if (!Lib.isLeftClick(e))
            return;

        var row = Lib.getAncestorByClass(e.target, "memberRow");
        var label = Lib.getAncestorByClass(e.target, "memberLabel");
        if (label && Lib.hasClass(row, "hasChildren"))
            this.toggleRow(row);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    toggleRow: function(row, forceOpen)
    {
        if (!row)
            return;

        var level = parseInt(row.getAttribute("level"));
        if (forceOpen && Lib.hasClass(row, "opened"))
            return;

        if (Lib.hasClass(row, "opened"))
        {
            Lib.removeClass(row, "opened");

            var tbody = row.parentNode;
            for (var firstRow = row.nextSibling; firstRow; firstRow = row.nextSibling)
            {
                if (parseInt(firstRow.getAttribute("level")) <= level)
                    break;
                tbody.removeChild(firstRow);
            }
        }
        else
        {
            Lib.setClass(row, "opened");

            var repObject = row.repObject;
            if (repObject)
            {
                if (!repObject.hasChildren)
                    return;

                var members = this.getMembers(repObject.value, level+1);
                if (members && members.length)
                    this.loop.insertRows({members: members}, row);
                else
                    Lib.setClass(row, "spinning");

            }
        }
    },

    memberIterator: function(object)
    {
        return this.getMembers(object);
    },

    getMembers: function(object, level)
    {
        if (!level)
            level = 0;

        var members = [];

        if (this.provider)
        {
            var children = this.provider.getChildren(object);
            for (var i=0; i<children.length; i++)
            {
                var child = children[i];
                var hasChildren = this.provider.hasChildren(child);

                var member = this.createMember("dom", null, child, level, hasChildren);
                member.provider = this.provider;
                members.push(member);
            }
            return members;
        }

        for (var p in object)
        {
            var value = object[p];
            var valueType = typeof(value);
            var hasChildren = this.hasProperties(value) && (valueType == "object");

            members.push(this.createMember("dom", p, value, level, hasChildren));
        }

        return members;
    },

    createMember: function(type, name, value, level, hasChildren)
    {
        var member = {
            name: name,
            type: type,
            rowClass: "memberRow-" + type,
            open: "",
            level: level,
            hasChildren: hasChildren,
            value: value,
        };

        return member;
    },

    hasProperties: function(ob)
    {
        if (typeof(ob) == "string")
            return false;

        try {
            for (var name in ob)
                return true;
        } catch (exc) {}
        return false;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    append: function(parentNode, input)
    {
        this.parentNode = parentNode;
        this.element = this.tag.append({object: input}, parentNode, this);
        this.element.repObject = this;

        this.input = input;

        // Expand the first node (root) by default
        // Do not expand if the root is an array with more than one element.
        var value = Lib.isArray(input) && input.length > 2;
        var firstRow = this.element.firstChild.firstChild;
        if (firstRow && !value)
            this.toggleRow(firstRow);
    },

    // xxxHonza: put into the core object.
    replace: function(parentNode, input)
    {
        Lib.clearNode(parentNode);
        this.append(parentNode, input);
    },

    expandRow: function(object)
    {
        var row = this.getRow(object);
        this.toggleRow(row, true);
        return row;
    },

    getRow: function(object)
    {
        // If not rendered yet, bail out.
        if (!this.element)
            return;

        // Iterate all existing rows and expand the one associated with specified object.
        // The repObject is a "member" object created in createMember method.
        var rows = Lib.getElementsByClass(this.element, "memberRow");
        for (var i=0; i<rows.length; i++)
        {
            var row = rows[i];
            if (row.repObject.value == object)
                return row;
        }

        return null;
    },

    updateObject: function(object)
    {
        var row = this.getRow(object);

        // The input object itself doesn't have a row.
        if (this.input == object)
        {
            var members = this.getMembers(object);
            if (members)
                this.loop.insertRows({members: members}, this.element.firstChild);
            return;
        }

        if (!row)
            return;

        var member = row.repObject;
        member.hasChildren = this.provider.hasChildren(object);

        // Generate new row with new value.
        var rowTag = this.getRowTag();
        var rows = rowTag.insertRows({member: member}, row, this);

        // If the old row was expanded remember it.
        var expanded = Lib.hasClass(row, "opened");

        // Remove the old row before expanding the new row,otherwise the old one
        // would be expanded and consequently removed.
        row.parentNode.removeChild(row);

        if (expanded)
            this.expandRow(object);

        Lib.removeClass(row, "spinning");
    },
});

// ********************************************************************************************* //
// Helpers

function safeToString(ob)
{
    try
    {
        return ob.toString();
    }
    catch (exc)
    {
        return "";
    }
}

// ********************************************************************************************* //
// Value Templates

var OBJECTBOX =
    DIV({"class": "objectBox objectBox-$className"});

// ********************************************************************************************* //

DomTree.Reps =
{
    reps: [],

    registerRep: function()
    {
        this.reps.push.apply(this.reps, arguments);
    },

    getRep: function(object)
    {
        var type = typeof(object);
        if (type == "object" && object instanceof String)
            type = "string";

        for (var i=0; i<this.reps.length; ++i)
        {
            var rep = this.reps[i];
            try
            {
                if (rep.supportsObject(object, type))
                    return rep;
            }
            catch (exc)
            {
                Trace.exception("domTree.getRep; ", exc);
            }
        }

        return DomTree.Rep;
    }
}

// ********************************************************************************************* //

DomTree.Rep = domplate(
{
    tag:
        OBJECTBOX("$object|getTitle"),

    className: "object",

    getTitle: function(object)
    {
        var label = safeToString(object);
        var re = /\[object (.*?)\]/;
        var m = re.exec(label);
        var result = m ? m[1] : label;

        return Lib.cropString(result, 100);
    },

    getTooltip: function(object)
    {
        return null;
    },

    supportsObject: function(object, type)
    {
        return false;
    }
});

// ********************************************************************************************* //

DomTree.Reps.Null = domplate(DomTree.Rep,
{
    tag:
        OBJECTBOX("null"),

    className: "null",

    supportsObject: function(object, type)
    {
        return object == null;
    }
});

// ********************************************************************************************* //

DomTree.Reps.Number = domplate(DomTree.Rep,
{
    tag:
        OBJECTBOX("$object"),

    className: "number",

    supportsObject: function(object, type)
    {
        return type == "boolean" || type == "number";
    }
});

// ********************************************************************************************* //

DomTree.Reps.String = domplate(DomTree.Rep,
{
    tag:
        //OBJECTBOX("&quot;$object&quot;"),
        OBJECTBOX("$object"),

    className: "string",

    supportsObject: function(object, type)
    {
        return type == "string";
    }
});

// ********************************************************************************************* //

DomTree.Reps.Arr = domplate(DomTree.Rep,
{
    tag:
        OBJECTBOX("$object|getTitle"),

    className: "array",

    supportsObject: function(object, type)
    {
        return Lib.isArray(object);
    },

    getTitle: function(object)
    {
        return "Array [" + object.length + "]";
    }
});

// ********************************************************************************************* //

DomTree.Reps.Tree = domplate(DomTree.Rep,
{
    tag:
        OBJECTBOX(
            TAG("$object|getTag", {object: "$object|getRoot"})
        ),

    className: "tree",

    getTag: function(object)
    {
        return Tree.tag;
    },

    getRoot: function(object)
    {
        // Create fake root for embedded object-tree.
        return [object];
    },

    supportsObject: function(object, type)
    {
        return type == "object";
    }
});

//xxxHonza: Domplate inheritance doesn't work. Modifications are propagated
// into the base object (see: http://code.google.com/p/fbug/issues/detail?id=4425)
var Tree = domplate(DomTree.prototype,
{
    createMember: function(type, name, value, level)
    {
        var member = DomTree.prototype.createMember(type, name, value, level);
        if (level == 0)
        {
            member.name = "";
            member.type = "tableCell";
        }
        return member;
    }
});

// ********************************************************************************************* //

// Registration
DomTree.Reps.registerRep(
    DomTree.Reps.Null,
    DomTree.Reps.Number,
    DomTree.Reps.String,
    DomTree.Reps.Arr
)

// ********************************************************************************************* //

return DomTree;

// ********************************************************************************************* //
}});
