/* See license.txt for terms of usage */

define([
    "differ",
    "provider",
    "domplate/domTree",
    "domDiffTree",
],
function(Differ, Provider, DomTree, DomDiffTree) {

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

        // Test
        var differ = new Differ();
        var result = [];
        differ.diff(myObject1, myObject2, result);

        console.log("Differences:", result);

        // Render log structure as an expandable tree.
        var provider = new Provider(result);
        var domTree = new DomDiffTree(provider);
        domTree.replace(content, result);

        var content = document.getElementById("content");

        var domTree1 = new DomTree();
        domTree1.replace(document.getElementById("oldObject"), myObject1);

        var domTree2 = new DomTree();
        domTree2.replace(document.getElementById("newObject"), myObject2);

        var domTree3 = new DomTree();
        domTree3.replace(document.getElementById("differences"), result);
    },
}

// ********************************************************************************************* //

// Application's entry point.
var content = document.getElementById("content");
var JsonDiff = content.repObject = new JsonDiff();
JsonDiff.initialize(content);

// ********************************************************************************************* //
});
