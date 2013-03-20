/* See license.txt for terms of usage */

// ********************************************************************************************* //
// Constants

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

// ********************************************************************************************* //
// DevTools Panel Definition

var panelDefinition =
{
    id: "mypanel",
    ordinal: 10,
    killswitch: "mypanel.devtools.enabled",
    label: "My Panel",
    tooltip: "My test panel",
    url: "chrome://devtools-panel/content/myPanel.xul",
    icon: "chrome://devtools-panel/skin/panel.png",

    isTargetSupported: function(target)
    {
        return target.isLocalTab;
    },

    build: function(frame, toolbox)
    {
        var panel = new MyPanel(frame, toolbox);
        return panel.open(window);
    }
};

gDevTools.registerTool(panelDefinition);

// ********************************************************************************************* //
// Registration

// ********************************************************************************************* //
