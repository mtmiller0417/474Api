"use strict";
/*
    This file handles connecting to the database
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = (db) => {
    const connect = () => {
        mongoose_1.default
            .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }) // second part gets rid of some deprecated warning
            .then(() => {
            //return console.log(`Successfully connected to ${db}`);
            return console.log('\nSuccessfully connected to the database');
        })
            .catch(error => {
            console.log("Error connecting to database: ", error);
            return process.exit(1);
        });
    };
    connect();
    mongoose_1.default.connection.on("disconnected", connect);
};
/*

export default(db: string) => {
    const connect = () => {
        mongoose.connect(db, {useNewUrlParser: true});
        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
        mongoose.connection.once('open', function(){
            // We're connected
            console.log('Successfully connected!')
        })
    }
}*/
/*
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('were in')
});
*/ 
//# sourceMappingURL=connect.js.map