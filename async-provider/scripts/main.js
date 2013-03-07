/* See license.txt for terms of usage */

define([
    "core/lib",
    "core/trace",
    "core/promise",
    "firebug/dom/domBaseTree",
    "app/objectStorage",
    "app/objectCache",
    "app/objectAsyncProvider",
],
function(Lib, Trace, Promise, DomBaseTree, ObjectStorage, ObjectCache, ObjectAsyncProvider) {

// ********************************************************************************************* //
// The Application

// Application UI location
var content = document.getElementById("content");

// Data storage is initialized asynchronously
var storage = new ObjectStorage();
storage.initialize("data/object.json").then(function onInitialize(root)
{
    try
    {
        // 1) Synchronous scenario
        //var provider = new ObjectProvider(storage);
        //var tree = new DomTree(provider);
        //tree.append(content, input);

        // 2) Asynchronous scenario
        // Create async provider with async access to the storage.
        // The access is done through a cache that returns cached data synchronously
        // and fetches new data asynchronously.
        var cache = new ObjectCache(storage);
        var provider = new ObjectAsyncProvider(cache);
        var tree = new DomBaseTree(provider);

        window.cache = cache;

        // Render tree with the given parent element and input data object.
        var input = {object: root};
        tree.replace(content, input);

        // Refresh tree
        $("#refresh").click(function()
        {
            tree.refresh();
        });

        // Final log
        Trace.log("initialization ok");
    }
    catch (e)
    {
        Trace.log(e);
    }
})

// ********************************************************************************************* //
});

