
const Datastore = require('nedb');

//Table for products
class DAO {
    constructor(dbFilePath) {
        //run database as a file
        if (dbFilePath) {
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
            console.log("DB connected to file: ", dbFilePath);
        } else {
            //in memory 
            this.db = new Datastore();
        }
    }

    //Add the entries to the product table
    init() {
        this.db.insert({
            brandField: 'Nike',
            typeField: 'T-Shirt', 
            colourField: 'White'
        });
        console.log('new entry inserted');
    }

    //Returns all entries from the product table
    all() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function (err, entries) {
                if (err) {
                    reject(err);
                    console.log('rejected');
                } else {
                    resolve(entries);
                    console.log('resolved');
                }
            });
        })
    }

    //Adds a new entry to the product table if given correct variables
    add(brand, type, colour){
        var entry = {
            brandField : brand,
            typeField : type,
            colourField : colour
        };

        this.db.insert(entry, function(err, doc){
            if (err){
                console.log("Can't insert product: ", brandField + " " + typeField);
            }
        });
    }

    //Removes all entries from the product table, only used during development.
    deleteAllEntries(){
        this.db.remove({}, { multi: true }, function (err, numRemoved) {});
    }
}

//Module exports
    module.exports = DAO;