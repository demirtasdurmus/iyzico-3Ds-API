const mongoose = require("mongoose");
const dbenv = require("./dbenv")

const connectMongoDb = () => {
    //connecting mongoose**********************************
    mongoose.connect(`mongodb://localhost:27017/${dbenv.dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

    //Mongoose connection error handling********************
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
        console.log(`Connected to ${dbenv.dbName} database`);
    });
}
module.exports = connectMongoDb;