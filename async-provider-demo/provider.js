// ********************************************************************************************* //
// Provider Implementation

/**
 * This Provider si implemented to consume data of specific Storage
 */
function Provider(storage)
{
    this.storage = storage;
}

Provider.prototype =
{
    hasChildren: function(object)
    {
        // We might want to return a promise here too.
        return true;
    },

    getChildren: function(storage)
    {
        return storage.getPriceList();
    },

    getLabel: function(car, column)
    {
        return car.model;
    },

    getValue: function(car, column)
    {
        return car.price;
    },
}

// ********************************************************************************************* //
