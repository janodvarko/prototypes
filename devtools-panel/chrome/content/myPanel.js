/* See license.txt for terms of usage */

// ********************************************************************************************* //
// Constants

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

Cu.import("resource:///modules/devtools/EventEmitter.jsm");
Cu.import("resource://gre/modules/commonjs/sdk/core/promise.js");

// ********************************************************************************************* //
// Logging

try
{
    Cu.import("resource://firebug/fbtrace.js");
}
catch (e)
{
    // FBTrace is not installed
    FBTrace =
    {
        sysout: function(msg)
        {
            dump("*** " + msg + "\n");
        }
    }
}

// ********************************************************************************************* //
// Panel Implementation

function MyPanel(frame, target)
{
    EventEmitter.decorate(this);

    this.frame = frame;
    this.target = target;

    this.target.on("navigate", this.navigate);
    this.target.on("will-navigate", this.beforeNavigate);
    this.target.on("hidden", this.hidden);
    this.target.on("visible",  this.visible);
}

MyPanel.prototype =
{
    open: function(win)
    {
        FBTrace.sysout("MyPanel.open");

        this.win = win;
        this.doc = win.document;

        var deferred = Promise.defer();
        deferred.resolve(this);
        return deferred.promise;
    },

    destroy: function()
    {
        this.target.off("navigate", this.navigate);
        this.target.off("will-navigate", this.beforeNavigate);
        this.target.off("hidden", this.hidden);
        this.target.off("visible",  this.visible);
    },

    beforeNavigate: function()
    {
        FBTrace.sysout("MyPanel.beforeNavigate");
    },

    navigate: function()
    {
        FBTrace.sysout("MyPanel.navigate");
    },

    hidden: function()
    {
        FBTrace.sysout("MyPanel.hidden");
    },

    visible: function()
    {
        FBTrace.sysout("MyPanel.visible");
    },
};

// ********************************************************************************************* //
