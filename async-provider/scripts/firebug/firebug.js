/* See license.txt for terms of usage */

define([
    "domplate/reps"
],
function(Reps) {

// ********************************************************************************************* //

var Firebug =
{
    getRep: function()
    {
        return Reps.getRep.apply(Reps, arguments);
    }
}

// ********************************************************************************************* //
// Registration

return Firebug;

// ********************************************************************************************* //
});
