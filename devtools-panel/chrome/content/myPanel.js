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
    this.target.on("will-navigate", this.willNavigate);
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

        return Promise.resolve(this);
    },

    destroy: function()
    {
        FBTrace.sysout("MyPanel.destroy");

        this.target.off("navigate", this.navigate);
        this.target.off("will-navigate", this.willNavigate);
        this.target.off("hidden", this.hidden);
        this.target.off("visible",  this.visible);
    },

    willNavigate: function()
    {
        FBTrace.sysout("MyPanel.willNavigate");
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
