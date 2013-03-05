/* See license.txt for terms of usage */

define([
    "domplate/domplate",
    "core/lib",
    "core/trace"
],

function(Domplate, Lib, Trace) { with (Domplate) {

// ********************************************************************************************* //
// Templates

var OBJECTBOX =
    PRE({"class": "objectBox inline objectBox-$className", role: "presentation"});

var OBJECTLINK =
    A({
        "class": "objectLink objectLink-$className a11yFocus",
        _repObject: "$object"
    });

// ********************************************************************************************* //

var Reps =
{
    OBJECTLINK: OBJECTLINK,
    OBJECTBOX: OBJECTBOX,

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
                Trace.exception("reps.getRep; ", exc);
            }
        }

        return Reps.Rep;
    }
}

// ********************************************************************************************* //

Reps.Rep = domplate(
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

Reps.Undefined = domplate(Reps.Rep,
{
    tag:
        OBJECTBOX("undefined"),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    className: "undefined",

    supportsObject: function(object, type)
    {
        return type == "undefined";
    }
});

// ********************************************************************************************* //

Reps.Null = domplate(Reps.Rep,
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

Reps.Number = domplate(Reps.Rep,
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

Reps.String = domplate(Reps.Rep,
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

Reps.Arr = domplate(Reps.Rep,
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

Reps.Tree = domplate(Reps.Rep,
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

// ********************************************************************************************* //

Reps.Caption = domplate(Reps.Rep,
{
    tag:
        SPAN({"class": "caption"}, "$object")
});

// ********************************************************************************************* //

Reps.Obj = domplate(Reps.Rep,
{
    tag:
        OBJECTLINK(
            //SPAN({"class": "objectTitle"}, "$object|getTitle "),
            SPAN({"class": "objectLeftBrace", role: "presentation"}, "{"),
            FOR("prop", "$object|shortPropIterator",
                "$prop.name",
                SPAN({"class": "objectEqual", role: "presentation"}, "$prop.equal"),
                TAG("$prop.tag", {object: "$prop.object"}),
                SPAN({"class": "objectComma", role: "presentation"}, "$prop.delim")
            ),
            SPAN({"class": "objectRightBrace"}, "}")
        ),

    shortTag:
        OBJECTLINK(
            //SPAN({"class": "objectTitle"}, "$object|getTitle "),
            SPAN({"class": "objectLeftBrace", role: "presentation"}, "{"),
            FOR("prop", "$object|shortPropIterator",
                "$prop.name",
                SPAN({"class": "objectEqual", role: "presentation"}, "$prop.equal"),
                TAG("$prop.tag", {object: "$prop.object"}),
                SPAN({"class": "objectComma", role: "presentation"}, "$prop.delim")
            ),
            SPAN({"class": "objectRightBrace"}, "}")
        ),

    titleTag:
        SPAN({"class": "objectTitle"}, "$object|getTitleTag"),

    getTitleTag: function(object)
    {
        var title;
        if (typeof(object) == "string")
            title = object;
        else
            title = this.getTitle(object);

        if (title == "Object")
            title = "{...}";

        return title;
    },

    longPropIterator: function (object)
    {
        return this.propIterator(object, 100);
    },

    shortPropIterator: function (object)
    {
        return this.propIterator(object, 3);
    },

    propIterator: function (object, max)
    {
        var props = [];

        // Object members with non-empty values are preferred since it gives the
        // user a better overview of the object.
        this.getProps(props, object, max, function(t, value)
        {
            return (t == "boolean" || t == "number" || (t == "string" && value) ||
                (t == "object" && value && value.toString));
        });

        if (props.length+1 <= max)
        {
            // There is not enough props yet, let's display also empty members and functions.
            this.getProps(props, object, max, function(t, value)
            {
                return ((t == "string" && !value) || (t == "object" && !value) ||
                    (t == "function"));
            });
        }

        if (props.length > max)
        {
            props[props.length-1] = {
                object: "more...",
                tag: Reps.Caption.tag,
                name: "",
                equal: "",
                delim: ""
            };
        }
        else if (props.length > 0)
        {
            props[props.length-1].delim = '';
        }

        return props;
    },

    getProps: function (props, object, max, filter)
    {
        max = max || 3;
        if (!object)
            return [];

        var len = 0;

        try
        {
            for (var name in object)
            {
                var value;
                try
                {
                    value = object[name];
                }
                catch (exc)
                {
                    continue;
                }

                var t = typeof(value);
                if (filter(t, value))
                {
                    var rep = Reps.getRep(value);
                    var tag = rep.shortTag || rep.tag;
                    if ((t == "object" || t == "function") && value)
                    {
                        value = rep.getTitle(value);
                        if (rep.titleTag)
                            tag = rep.titleTag;
                        else
                            tag = Reps.Obj.titleTag;
                    }

                    if (props.length <= max)
                        props.push({tag: tag, name: name, object: value, equal: "=", delim: ", "});
                    else
                        break;
                }
            }
        }
        catch (exc)
        {
            // Sometimes we get exceptions when trying to read from certain objects, like
            // StorageList, but don't let that gum up the works
            // XXXjjb also History.previous fails because object is a web-page object
            // which does not have permission to read the history
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    className: "object",

    supportsObject: function(object, type)
    {
        return true;
    }
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

// Registration
Reps.registerRep(
    Reps.Undefined,
    Reps.Null,
    Reps.Number,
    Reps.String,
    Reps.Arr
    //Reps.Obj
)

// ********************************************************************************************* //

return Reps;

// ********************************************************************************************* //
}});
