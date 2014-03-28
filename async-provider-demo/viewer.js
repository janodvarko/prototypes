// ********************************************************************************************* //
// Viewer Implementation

/**
 * The viewer is implemeneted as a simple list renderer. It only uses
 * associated provider to access data.
 */
function Viewer(provider)
{
    this.provider = provider;
}

// ********************************************************************************************* //

Viewer.prototype =
{
    render: function(parentNode, input)
    {
        var self = this;
        this.provider.getChildren(input).then(function(children)
        {
            self.renderContent(parentNode, children);
        });

        var img = document.createElement("img");
        img.src = "spinner.png"
        parentNode.appendChild(img);
    },

    renderContent: function(parentNode, children)
    {
        parentNode.innerHTML = "";

        for (var i=0; i<children.length; i++)
        {
            var child = children[i];
            var label = this.provider.getLabel(child);
            var value = this.provider.getValue(child);

            var row = document.createElement("div");
            row.textContent = label + " - " + value;
            parentNode.appendChild(row);
        }
    }
}

// ********************************************************************************************* //
