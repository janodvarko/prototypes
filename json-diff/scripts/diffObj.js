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
                SPAN({"class": "diffObj oldValue"},
                    TAG("$prop.tag1", {object: "$prop.object1"})
                ),
/*                SPAN(" "),
                SPAN({"class": "diffObj newValue"},
                    TAG("$prop.tag2", {object: "$prop.object2"})
                ),*/
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

    propIterator: function(children, max)
    {
        var props = this.getProps(children, max);

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
            props[props.length-1].delim = "";
        }

        return props;
    },

    getProps: function(children, max)
    {
        max = max || 3;

        var props = [];
        for (var i=0; i<children.length; i++)
        {
            var child = children[i];
            if (child.value1 != child.value2)
            {
                var rep1 = Reps.getRep(child.value1);
                var tag1 = rep1.shortTag || rep1.tag;

                var rep2 = Reps.getRep(child.value2);
                var tag2 = rep2.shortTag || rep2.tag;

                props.push({
                    tag1: tag1,
                    tag2: tag2,
                    name: child.name,
                    object1: child.value1,
                    object2: child.value2,
                    equal: "=",
                    delim: ", "
                });

                if (props.length >= max)
                    break;
            }
        }

        return props;
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
