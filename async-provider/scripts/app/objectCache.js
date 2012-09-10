/* See license.txt for terms of usage */

define([
    "core/lib",
    "core/trace",
    "core/promise",
],
function(Lib, Trace, Promise) {

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

        var self = this;
        setTimeout(function onGetObject()
        {
            Trace.log("cache; onGetObject")

            object = self.storage.getObject(id);
            self.objects[id] = object;

            if (object)
                deferred.resolve(object);
            else
                deferred.reject(object);
        }, 1000);

        return deferred.promise;
    },

    getObjectProps: function(id)
    {
        var deferred = Promise.defer();
        var props = this.props[id];
        if (props)
            return Promise.resolve(props);

        var self = this;
        window.setTimeout(function onGetObjectProps()
        {
            props = self.storage.getObjectProps(id);
            self.props[id] = props;

            if (props)
                deferred.resolve(props);
            else
                deferred.reject({error: "no properties"});
        }, 1000);

        return deferred.promise;
    },
}

// ********************************************************************************************* //
// Registration

return ObjectCache;

// ********************************************************************************************* //
});
