"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const GroupSchema = new mongoose_1.Schema({
    groupName: {
        type: String,
        required: true
    },
    members: {
        type: [String],
        required: true
    },
    messages: {
        type: [{
                text: String,
                time_sent: String,
                senderUsername: String
            }],
        required: false
    },
    events: {
        type: [{
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
    groupImage: {
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
    };
};
const Group = mongoose_1.default.model("Group", GroupSchema);
exports.default = Group;
//# sourceMappingURL=group.js.map