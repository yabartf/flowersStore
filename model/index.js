const debug = require("debug")("mongo:model");
const mongo = require("mongoose");
//mongo.Promise = Promise;

let db = mongo.createConnection('mongodb://localhost:27017/lab5',
 { useMongoClient: true });
db.then(() => debug("Connected to DB"));
db.catch(err => debug("Error connecting to DB: " + err));

debug('Pending DB connection');

require("./users")(db);
require("./branchs")(db);
require("./flowers")(db);


module.exports = model => db.model(model);
