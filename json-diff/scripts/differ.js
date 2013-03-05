/* See license.txt for terms of usage */

define([
],
function() {

// ********************************************************************************************* //
// The Application

function Differ()
{
}

Differ.prototype =
{
    diff: function diff(first, second, members)
    {
        var props = [];

        // Get all properties from both objects
        if (typeof first == "object")
            props.push.apply(props, Object.keys(first));
        if (typeof second == "object")
            props.push.apply(props, Object.keys(second));

        // Bail out if there are no properties.
        if (!props.length)
            return;

        // Make sure to have each property just once.
        var map = {};
        for (var p in props)
            map[props[p]] = true;

        // Iterate over all properties in both objects.
        var diff = false;
        for (var prop in map)
        {
            var value1 = first ? first[prop] : undefined;
            var value2 = second ? second[prop] : undefined;

            var member = {
                name: prop,
                value1: value1,
                value2: value2,
                first: first,
                second: second,
                children: [],
                diff: false,
            }

            members.push(member);

            if (typeof member.value1 != "object" &&
                typeof member.value2 != "object")
            {
                if (member.value1 != member.value2)
                    diff = member.diff = true;
            }

            // Recursion
            member.diff = this.diff(value1, value2, member.children);

            if (member.diff)
                diff = true;
        }

        // Returns true if:
        // 1) A property of first/second objects is different
        // 2) A property from child objects is different.
        return diff;
    }
}

// ********************************************************************************************* //

return Differ;

// ********************************************************************************************* //
});
