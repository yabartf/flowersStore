const debug = require("debug")("mongo:model-user");
const mongo = require("mongoose");

module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({        
        managerFirstName: { type: String, required: true},
        managerLastName: { type: String, required: true },
        address: {type: String, required: true},
        branch_name: {type: String, required: true},               
    }, { autoIndex: false });


    schema.statics.CREATE = async function(branch) {
        return this.create({
            managerFirstName: branch[0],
            managerLastName: branch[1],
            address: branch[2],
            branch_name: branch[3]
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
            debug("request: by branch");
            return this.find(...args).exec();
        }
        
    };

    db.model('Branchs', schema); 
    debug("Branchs model created");
};



