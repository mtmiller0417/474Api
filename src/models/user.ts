import mongoose, { Schema, Document } from "mongoose";

export interface UserInterface extends Document {
    //userName: String,
    firstName: String;
    lastName: String;
}

const UserSchema: Schema = new Schema({
    /*userName:{
        type: String,
        reqiured: true
    },*/
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