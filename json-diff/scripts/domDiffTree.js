/* See license.txt for terms of usage */

define([
    "domplate/domplate",
    "domplate/domTree",
    "domplate/reps",
    "core/trace"
],

function(Domplate, DomTree, Reps, Trace) { with (Domplate) {

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
                    TAG("$member|getValueTag1", {object: "$member|getValue1"})
                ),
                SPAN({"class": "memberValueWrapper newValue"},
                    TAG("$member|getValueTag2", {object: "$member|getValue2"})
                )
            )
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    getValue1: function(member)
    {
        if (member.provider)
            return member.provider.getValue(member.value, "first");
        return member.value;
    },

    getValue2: function(member)
    {
        if (member.provider)
            return member.provider.getValue(member.value, "second");
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

    getRowTag: function(member)
    {
        return this.rowTag;
    },
});

// ********************************************************************************************* //

return DomDiffTree;

// ********************************************************************************************* //
}});
