const debug = require("debug")("mongo:model-user");
const mongo = require("mongoose");



module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({        
        userName: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        active: {type: Boolean, required: true},
        role: {type: String, required: true},
        
        created_at: Date,
        updated_at: Date
    }, { autoIndex: false });


    schema.statics.CREATE = async function(user) {
        return this.create({
            userName: user[0],
            password: user[1],
            active: true,
            role: user[2]
        });
    };
     // on every save, add the date
     schema.pre('save', function(next) {
        // get the current date
        let currentDate = new Date();
        // change the updated_at field to current date
        this.updated_at = currentDate;
        // if created_at doesn't exist, add to that field
        if (!this.created_at)
            this.created_at = currentDate;
        next();
    });
    schema.statics.REQUEST = async function() {
        // no arguments - bring all at once
        const args = Array.from(arguments); // [...arguments]
        
        if (args.length === 0) {
            debug("request: no arguments - bring all at once");
            return this.find({active:true}).exec();
        }
        if (args.length == 2){        
            debug("request: by username and password");
            return this.find({userName:args[0], password:args[1], active:true}).exec();
        }

        // There is no callback - bring requested at once
        debug(`request: somthing wrong`);
        return;
    };

    // the schema is useless so far
    // we need to create a model using it
    db.model('users', schema); // (model, schema, collection)
    //db.model('Users', schema); // if model name === collection name
    debug("Users model created");
};

