import mongoose, { Schema, Document } from "mongoose";

// Add group image variable

export interface GroupInterface extends Document {
    groupName: String;
    members: [String];
    messages: [{
        text: String,
        time_sent: String,
        senderUsername: String
    }];
    events:[{
        title: String,
        description: String,
        dateOfEvent: String,
        locationName: String,
        locationAddress: String,
        username: String,
        time: String
    }];
    groupImage: String;
}

const GroupSchema: Schema = new Schema({
    groupName:{
        type: String,
        required: true
    },
    members: {
        type: [String],
        required: true
    },
    messages:{
        type: [{
            text: String,
            time_sent: String,
            senderUsername: String
        }],
        required: false
    },
    events:{
        type:[{
            title: String,
            description: String,
            dateOfEvent: String,
            locationName: String,
            locationAddress: String,
            username: String,
            time: String
        }],
        required: false
    },
    groupImage:{
        type: String,  
        required: false
    }
});

GroupSchema.methods.toJson = function () {
    return {
      _id: this._id,
      groupName: this.groupName,
      members: this.members,
      messages: this.messages,
      events: this.events,
      groupImage: this.groupImage
    }
  }

const Group = mongoose.model<GroupInterface>("Group", GroupSchema);
export default Group;