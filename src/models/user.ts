import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt-nodejs';

export interface UserInterface extends Document {
    userName: String,
    password: String,
    firstName: String;
    lastName: String;
}

const UserSchema: Schema = new Schema({
    userName:{
        type: String,
        reqiured: true
    },
    password:{
        type: String,
        reqiured: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    }
});

UserSchema.methods.comparePassword = function (candidatePassword:any, cb:any) {
    console.log(candidatePassword)
    console.log(this.password)
    if (this.password==='*') {cb(null,false);return;}
    bcrypt.compare(candidatePassword, this.password, function (err:any, isMatch:any) {
      if (err) { console.log('ERROR: ' + err);return cb(err); }
      return cb(null, isMatch);
    });
  }

UserSchema.methods.toJson = function () {
  return {
    _id: this._id,
    userName: this.userName,
    password: this.password,
    firstName: this.firstName,
    lastName: this.lastName,
  }
}

const User = mongoose.model<UserInterface>("User", UserSchema);
export default User;