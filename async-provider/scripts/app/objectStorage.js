/* See license.txt for terms of usage */

define([
    "core/lib",
    "core/trace",
    "core/promise",
],
function(Lib, Trace, Promise) {

// ********************************************************************************************* //
// Globals

var counter = 0;
function generateId()
{
    return "id-" + (++counter);
}

// ********************************************************************************************* //
// Object Cache

/**
 * ObjectStorage represents a simple object database.
 */
function ObjectStorage()
{
    this.input = null;
    this.objects = {};
}

ObjectStorage.prototype =
{
    initialize: function(uri)
    {
        var deferred = Promise.defer();
        var request = new XMLHttpRequest();
        request.open("GET", uri, true);

        var self = this;
        request.onload = function onload()
        {
            var root = JSON.parse(request.response);

            var id = generateId();
            self.objects[id] = root;

            var input = {
                id: id,
                name: "root",
                value: null,
            };

            deferred.resolve(input);
        }

        request.onerror = function(event)
        {
            deferred.reject(event);
        }

        request.send();

        return deferred.promise;
    },

    getObject: function(id)
    {
        return this.objects[id];
    },

    getObjectProps: function(id)
    {
        var props = [];

        var object = this.getObject(id);
        if (!object)
            return props;

        for (var prop in object)
        {
            var id = generateId();
            var value = object[prop];
            if (typeof(value) == "object")
            {
                this.objects[id] = value;
                value = {};
            }

            props.push({
                id: id,
                name: prop,
                value: value,
            });
        }

        return props;
    }
}

// ********************************************************************************************* //
// Registration

return ObjectStorage;

// ********************************************************************************************* //
});
