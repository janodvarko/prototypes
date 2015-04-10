// ********************************************************************************************* //
// Application

// UI location
var content = document.getElementById("content");

// First create a Storage. It represents a document with data
// returned asynchronously.
var storage = new Storage();

// Now create a provider for our storage, the provider will
// be consumed by the viewer to access data from the storage.
var provider = new Provider(storage);

// Creat a viewer and render!
var viewer = new Viewer(provider);
viewer.render(content, storage);

// ********************************************************************************************* //
