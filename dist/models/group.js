"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    groupName: {
        type: String,
        required: true
    },
    messages: {
        type: [{
                text: String,
                time_sent: String,
                sender: String
            }]
    }
});
//# sourceMappingURL=group.js.map