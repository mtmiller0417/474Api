/*
    This file handles connecting to the database
*/

import mongoose from "mongoose";

export default (db: string) => {
  const connect = () => {
    mongoose
      .connect(db, { useNewUrlParser: true, useUnifiedTopology: true}) // second part gets rid of some deprecated warning
      .then(() => {
        //return console.log(`Successfully connected to ${db}`);
        return console.log('\nSuccessfully connected to the database')
      })
      .catch(error => {
        console.log("Error connecting to database: ", error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect);
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