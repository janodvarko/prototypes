/* See license.txt for terms of usage */

define([
    "domplate/domplate",
    "domplate/reps",
    "core/lib",
    "core/trace"
],

function(Domplate, Reps, Lib, Trace) { with (Domplate) {

// ********************************************************************************************* //
// Diff Object

var DiffObj = domplate(Reps.Rep,
{
    tag:
        Reps.OBJECTLINK(
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

    shortPropIterator: function(object)
    {
        Trace.log("shortPropIterator", object)
        return this.propIterator(object, 3);
    },

    propIterator: function(object, max)
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

    getProps: function(props, object, max, filter)
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

return DiffObj;

// ********************************************************************************************* //
}});
