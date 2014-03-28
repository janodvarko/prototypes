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

function MyPanel(frame, toolbox)
{
    EventEmitter.decorate(this);

    this.frame = frame;
    this.toolbox = toolbox;
    this.target = toolbox.target;

    this.target.on("navigate", this.navigate);
    this.target.on("will-navigate", this.willNavigate);
    this.toolbox.on("select", this.select);
    this.target.on("visible", this.visible);
    this.target.on("hidden", this.hidden);
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
        this.toolbox.off("select", this.select);
        this.target.off("visible", this.visible);
        this.target.off("hidden", this.hidden);
    },

    willNavigate: function()
    {
        FBTrace.sysout("MyPanel.willNavigate");
    },

    navigate: function()
    {
        FBTrace.sysout("MyPanel.navigate");
    },

    select: function()
    {
        FBTrace.sysout("MyPanel.select", arguments);
    },

    visible: function()
    {
        FBTrace.sysout("MyPanel.visible", arguments);
    },

    hidden: function()
    {
        FBTrace.sysout("MyPanel.hidden", arguments);
    },
};

// ********************************************************************************************* //
