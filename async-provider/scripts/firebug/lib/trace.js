/* See license.txt for terms of usage */

define([
    "core/trace"
],
function(Trace) {

// ********************************************************************************************* //

var FBTrace =
{
    sysout: function()
    {
        Trace.log.apply(Trace, arguments);
    },

    to: function()
    {
        return FBTrace;
    },
};

return FBTrace;

// ********************************************************************************************* //
});
