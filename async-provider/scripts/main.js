/* See license.txt for terms of usage */

define([
    "core/lib",
    "core/trace",
    "core/promise",
    "domplate/domTree",
    "app/objectProvider",
    "app/objectStorage",
    "app/objectCache",
    "app/objectAsyncProvider",
],
function(Lib, Trace, Promise, DomTree, ObjectProvider, ObjectStorage, ObjectCache,
    ObjectAsyncProvider) {

// ********************************************************************************************* //
// The Application

// Application UI location
var content = document.getElementById("content");

// Data storage is initialized asynchronously
var storage = new ObjectStorage();
storage.initialize("data/object.json").then(function onInitialize(input)
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
    var tree = new DomTree(provider);

    // Set update callback. The provider needs a mechanisme
    // to update the associated UI widget when data are received
    // from the server.
    provider.setUpdateListener(tree);

    // Render tree with the given parent element and input data object.
    tree.append(content, input);

    // Final log
    Trace.log("initialization ok");
})

// ********************************************************************************************* //
});

