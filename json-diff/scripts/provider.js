/* See license.txt for terms of usage */

define([
    "core/lib",
    "jsdiff",
],
function(Lib, JSDiff) {

// ********************************************************************************************* //
// The Application

function Provider(diffResult)
{
    this.diffResult = diffResult;
}

Provider.prototype =
{
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Provider

    getLabel: function(member)
    {
        return member.name;
    },

    getValue: function(member, colName)
    {
        if (colName == "old")
            return member.value1;
        else if (colName == "new")
            return member.value2;
    },

    hasChildren: function(member)
    {
        if (member.children)
            return member.children.length > 0;
        return false;
    },

    getChildren: function(member)
    {
        if (Lib.isArray(member))
            return member;
        return member.children;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Decorator

    getType: function(member)
    {
        if (member.diff)
            return "different";

        if (typeof member.value1 == "object" && typeof member.value2 == "object")
            return "object";

        if (member.value1 != member.value2)
            return "different";
        else
            return "equal";

        return null;
    }
}

// ********************************************************************************************* //

return Provider;

// ********************************************************************************************* //
});
