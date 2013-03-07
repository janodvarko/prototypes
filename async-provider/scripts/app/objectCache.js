/* See license.txt for terms of usage */

define([
    "core/lib",
    "core/trace",
    "core/promise",
],
function(Lib, Trace, Promise) {

// ********************************************************************************************* //
// Constants

var async = true;
var timeout = 500;

// ********************************************************************************************* //
// Object Cache

function ObjectCache(storage)
{
    this.storage = storage;

    // Cache
    this.objects = {};
    this.props = {};
}

ObjectCache.prototype =
{
    getObject: function(id)
    {
        var deferred = Promise.defer();
        var object = this.objects[id];
        if (object)
        {
            Trace.log("cache; object in cache", object);
            return Promise.resolve(object);
        }

        // The object is not in the cache so, return it asynchronosly.
        // This is the place where real application would ask the server.
        var self = this;
        this.setTimeout(function onGetObject()
        {
            Trace.log("cache; onGetObject")

            object = self.storage.getObject(id);
            self.objects[id] = object;

            if (object)
                deferred.resolve(object);
            else
                deferred.reject(object);
        });

        return deferred.promise;
    },

    getObjectProps: function(id)
    {
        var deferred = Promise.defer();
        var props = this.props[id];
        if (props)
            return Promise.resolve(props);

        // The object is not in the cache so, return it asynchronosly.
        // This is the place where real application would ask the server.
        var self = this;
        this.setTimeout(function onGetObjectProps()
        {
            props = self.storage.getObjectProps(id);
            self.props[id] = props;

            if (props)
                deferred.resolve(props);
            else
                deferred.reject({error: "no properties"});
        });

        return deferred.promise;
    },

    setTimeout: function(callback)
    {
        if (async)
            setTimeout(callback, timeout);
        else
            callback();
    }
}

// ********************************************************************************************* //
// Registration

return ObjectCache;

// ********************************************************************************************* //
});
