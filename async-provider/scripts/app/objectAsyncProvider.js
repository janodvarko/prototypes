/* See license.txt for terms of usage */

define([
    "domplate/domplate",
    "core/lib",
    "core/trace"
],
function(Domplate, Lib, Trace) {
with (Domplate) {

// ********************************************************************************************* //

function ObjectAsyncProvider(storage)
{
    this.storage = storage;
}

ObjectAsyncProvider.prototype =
{
    hasChildren: function(object)
    {
        return typeof(object.value) == "object";
    },

    getChildren: function(object)
    {
        var id = object.id ? object.id : "";
        return this.storage.getObjectProps(id);
    },

    getLabel: function(object)
    {
        return Lib.cropString(object.name, 100);
    },

    getValue: function(object)
    {
        return object.value;
    },

    getId: function(object)
    {
        return this.getLabel(object);
    }
}

// ********************************************************************************************* //
// Registration

return ObjectAsyncProvider;

// ********************************************************************************************* //
}});
