/* See license.txt for terms of usage */

define([
    "domplate/domplate",
    "domplate/domTree",
    "domplate/reps",
    "core/trace",
    "diffObj",
],

function(Domplate, DomTree, Reps, Trace, DiffObj) { with (Domplate) {

// ********************************************************************************************* //

function DomDiffTree(provider)
{
    this.provider = provider;
}

/**
* @domplate Represents a tree of properties/objects
*/
DomDiffTree.prototype = domplate(new DomTree(),
{
    rowTag:
        TR({"class": "memberRow $member.open $member.type\\Row $member|hasChildren",
            _repObject: "$member", level: "$member.level"},
            TD({"class": "memberHeaderCell"},
                DIV({"class": "sourceLine memberRowHeader"},
                    "&nbsp;"
                )
            ),
            TD({"class": "memberLabelCell", style: "padding-left: $member|getIndent\\px"},
                SPAN({"class": "memberLabel $member.type\\Label"}, "$member|getLabel")
            ),
            TD({"class": "memberValueCell"},
                SPAN({"class": "memberValueWrapper oldValue"},
                    TAG("$member|getDiffValueTag", {object: "$member|getDiffValue"})
                )
            ),
            TD({"class": "memberSeparator", width: "10px"}),
/*            TD({"class": "memberLabelCell", style: "padding-left: $member|getIndent\\px"},
                SPAN({"class": "memberLabel $member.type\\Label"}, "$member|getLabel")
            ),*/
            TD({"class": "memberValueCell"},
                TAG("$member|getValueTag2", {object: "$member|getValue2"})
            )
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    getValue1: function(member)
    {
        if (member.provider)
            return member.provider.getValue(member.value, "old");
        return member.value;
    },

    getValue2: function(member)
    {
        if (member.provider)
            return member.provider.getValue(member.value, "new");
        return member.value;
    },

    getValueTag1: function(member)
    {
        var value = this.getValue1(member);
        var valueRep = Reps.getRep(value);
        if (valueRep == Reps.Rep)
            return Reps.Obj.shortTag;

        return valueRep.tag;
    },

    getValueTag2: function(member)
    {
        var value = this.getValue2(member);
        var valueRep = Reps.getRep(value);
        if (valueRep == Reps.Rep)
            return Reps.Obj.shortTag;

        return valueRep.tag;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    getDiffValue: function(member)
    {
        var value1 = this.getValue1(member);
        var value2 = this.getValue2(member);

        if (value1 && value2 && typeof(value1) == "object" && typeof(value2) == "object")
            return member.value.children;

        return this.getValue1(member);
    },

    getDiffValueTag: function(member)
    {
        var value1 = this.getValue1(member);
        var value2 = this.getValue2(member);

        if (value1 && value2 && typeof(value1) == "object" && typeof(value2) == "object")
            return DiffObj.tag;

        return this.getValueTag1(member);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    getRowTag: function(member)
    {
        return this.rowTag;
    },
});

// ********************************************************************************************* //

return DomDiffTree;

// ********************************************************************************************* //
}});
