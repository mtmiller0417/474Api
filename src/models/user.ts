import mongoose, { Schema, Document } from "mongoose";

export interface UserInterface extends Document {
    firstName: String;
    lastName: String;
}

const UserSchema: Schema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    }
});

const User = mongoose.model<UserInterface>("User", UserSchema);
export default User;