/* See license.txt for terms of usage */

define([
    "differ",
    "provider",
    "domplate/domTree",
    "domDiffTree",
    "core/trace"
],
function(Differ, Provider, DomTree, DomDiffTree, Trace) {

// ********************************************************************************************* //
// The Application

function JsonDiff()
{
}

/**
 * The main application
 */
JsonDiff.prototype =
/** @lends JsonDiff */
{
    initialize: function initialize(content)
    {
        var mom = {
            name: "Anna",
            surname: "Smith",
            age: 67,
        }

        var father = {
            name: "Johnas",
            surname: "Smith",
            age: 69,
        }

        var myObject1 = {
            name: "Bob",
            age: 41,
            son: {
                age: 13,
            },
            daughter: {
                name: "Lola"
            },
            mom: mom,
            father: father,
            wife: {
                name: "Kathrin",
                surname: "Smith",
                age: 40,
                job: "Teacher",
                // cycle husband: myObject1,
            },
        }

        var myObject2 = {
            name: "Bob",
            age: 53,
            son: {
                name: "K",
                age: 15,
            },
            wife: {
                name: "Katherine",
                surname: "Jones",
                age: 40,
                job: "Teacher",
            },
            mom: mom,
            father: father,
        }

        this.loadJson(function(myObject1, myObject2)
        {
            // Test
            var differ = new Differ();
            var result = [];
            differ.diff(myObject1, myObject2, result);

            console.log("Differences:", result);

            if (!result.length)
                return;

            // Render log structure as an expandable tree.
            var provider = new Provider(result);
            var domTree = new DomDiffTree(provider);
            domTree.replace(content, result);

            var domTree1 = new DomTree();
            domTree1.replace(document.getElementById("oldObject"), myObject1);

            var domTree2 = new DomTree();
            domTree2.replace(document.getElementById("newObject"), myObject2);

            var domTree3 = new DomTree();
            domTree3.replace(document.getElementById("differences"), result);
        });
    },

    loadJson: function(callback)
    {
        var file1 = "data/janodvarko.cz.1.har";
        var file2 = "data/janodvarko.cz.2.har";

        $.ajax({
            url: file1,
            context: this,

            success: function(response1)
            {
                $.ajax({
                    url: file2,
                    context: this,

                    success: function(response2)
                    {
                        var obj1 = jQuery.parseJSON(response1);
                        var obj2 = jQuery.parseJSON(response2);
                        callback(obj1, obj2);
                    },

                    error: function(response, ioArgs)
                    {
                        Trace.exception("Failed to load JSON", response, ioArgs);
                    }
                });
            },

            error: function(response, ioArgs)
            {
                Trace.exception("Failed to load JSON", response, ioArgs);
            }
        });
    }
}

// ********************************************************************************************* //

// Application's entry point.
var content = document.getElementById("content");
var JsonDiff = content.repObject = new JsonDiff();
JsonDiff.initialize(content);

// ********************************************************************************************* //
});
