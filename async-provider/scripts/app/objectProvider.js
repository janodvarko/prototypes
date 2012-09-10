/* See license.txt for terms of usage */

define([
    "domplate/domplate",
    "core/lib",
    "core/trace"
],
function(Domplate, Lib, Trace) {
with (Domplate) {

// ********************************************************************************************* //

function ObjectProvider(storage)
{
    this.storage = storage;
}

ObjectProvider.prototype =
{
    hasChildren: function(object)
    {
        return typeof(object.value) == "object";
    },

    getChildren: function(object)
    {
        var children = [];

        var id = object.id ? object.id : "";
        var props = this.storage.getObjectProps(id);

        for (var i=0; i<props.length; i++)
        {
            var prop = props[i];
            children.push({
                id: prop.id,
                name: prop.name,
                value: prop.value,
            });
        }

        return children;
    },

    getLabel: function(object)
    {
        return Lib.cropString(object.name, 100);
    },

    getValue: function(object)
    {
        return object.value;
    },
}

// ********************************************************************************************* //
// Registration

return ObjectProvider;

// ********************************************************************************************* //
}});
