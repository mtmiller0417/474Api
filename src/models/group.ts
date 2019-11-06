import mongoose, { Schema, Document } from "mongoose";

export interface groupInterface extends Document {
    groupName: String;
    messages: {
        text: String,
        time_sent: String,
        sender: String
    };
}

const UserSchema: Schema = new Schema({
    groupName:{
        type: String,
        required: true
    },
    messages:{
        type: [{
            text: String,
            time_sent: String,
            sender: String
        }]
    }
});