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
    setUpdateListener: function(listener)
    {
        this.updateListener = listener;
    },

    hasChildren: function(object)
    {
        return typeof(object.value) == "object";
    },

    getChildren: function(object)
    {
        // A helper flag used to see if the data-fetch has been done
        // synchronously or asynchronously.
        var sync = true;

        var children = [];
        var id = object.id ? object.id : "";

        var self = this;
        this.storage.getObjectProps(id).then(function onGetChildren(props)
        {
            if (sync)
            {
                // The response comes from the cache, which is synchronous.
                for (var i=0; i<props.length; i++)
                {
                    var prop = props[i];
                    children.push({
                        id: prop.id,
                        name: prop.name,
                        value: prop.value,
                    });
                }
            }
            else
            {
                // Update the listner (UI widget), it'll ask for children automatically,
                // which returns them synchronously from the cache.
                self.updateListener.updateObject(object);
            }
        });

        sync = false;

        // Returns an empty array if the data are available only asynchronously.
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
