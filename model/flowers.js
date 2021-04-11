const debug = require("debug")("mongo:model-user");
const { Double } = require("bson");
const { Int32 } = require("bson");
const mongo = require("mongoose");

module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({        
        path: { type: String, required: true, unique: true},
        descreption: { type: String, required: true },
        color: {type: String, required: true},
        cost: {type: Number, required: true},               
    }, { autoIndex: false });


    schema.statics.CREATE = async function(flower) {
        return this.create({
            path: flower[0],
            descreption: flower[1],
            color: flower[2],
            cost: flower[3]
        });
    };
     // on every save, add the date
     schema.pre('save', function(next) {      
        next();
    });
    schema.statics.REQUEST = async function() {
        // no arguments - bring all at once
        const args = Array.from(arguments); // [...arguments]
        
        if (args.length === 0) {
            debug("request: no arguments - bring all at once");
            return this.find({}).exec();
        }
        else {        
            debug("request: by flower");
            return this.find(...args).exec();
        }
        
    };

    db.model('flowers', schema); 
    debug("Flowers model created");
};



