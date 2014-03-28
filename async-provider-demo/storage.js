// ********************************************************************************************* //
// Storage Implementation

/**
 * Storage represents a simple database that returns data asynchronously.
 */
function Storage()
{
    // Some data in our storage
    this.data = [
        {model: "Mercedes-Benz", price: 102370},
        {model: "Mazda", price: 19940},
        {model: "Ford Mustang", price: 22200},
        {model: "Chevrolet Camaro", price: 23345},
        {model: "Jaguar", price: 69000},
    ];
}

Storage.prototype =
{
    getPriceList: function()
    {
        var deferred = Promise.defer();

        // Return data asynchronously
        var self = this;
        setTimeout(function()
        {
            deferred.resolve(self.data);
        }, 1500);

        return deferred.promise;
    },
}

// ********************************************************************************************* //
