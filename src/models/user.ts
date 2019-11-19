import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt-nodejs';

// Add pending requests

export interface UserInterface extends Document {
    username: String,
    password: String,
    firstName: String;
    lastName: String;
    profilePicture: String;
    bio: String;
    groupIDs: [String];
    requests: [{
      sender: String,
      invitedGroupID: String
    }]
}

const UserSchema: Schema = new Schema({
    username:{
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
    },
    profilePicture:{
      type: String,
      required: false
    },
    bio:{
      type: String,
      required: false
    },
    groupIDs:{
      type: [String],
      required: false
    },
    requests:{
      type:{
        sender: String,
        invitedGroupID: String
      },
      required: false
    }
});

UserSchema.methods.comparePassword = function (candidatePassword:any, cb:any) {
    if (this.password==='*') {cb(null,false);return;}
    bcrypt.compare(candidatePassword, this.password, function (err:any, isMatch:any) {
      if (err) { console.log('ERROR: ' + err);return cb(err); }
      return cb(null, isMatch);
    });
  }

UserSchema.methods.toJson = function () {
  return {
    _id: this._id,
    username: this.username,
    password: this.password,
    firstName: this.firstName,
    lastName: this.lastName,
    profilePicture: this.profilePicture,
    bio: this.bio,
    groupIDs: this.groupIDs,
    requests: this.requests
  }
}

const User = mongoose.model<UserInterface>("User", UserSchema);
export default User;