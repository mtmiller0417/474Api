"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
// Used for bcrypt
const saltRounds = 10;
function generateToken(group) {
    return jsonwebtoken_1.default.sign(group, config_1.secret, {
        expiresIn: 10080 // in seconds
    });
}
// GETs
// Get all groups
exports.allGroups = (req, res) => {
    console.log('\nTrying to get all groups');
};
// Gets a specific group
exports.showGroup = (req, res) => {
    console.log('\nTrying to get a specific group');
};
// POSTs
// Creates a new group, adds the user who created it as first member
exports.createGroup = (req, res, next) => {
    console.log('\nTrying to create a group');
    console.log(req.body);
    /**
     *
    "groupName": "MattsGroup",
    "members":["mtmiller"],
     "messgaes": [{
        "text": "Hi there",
        "time_sent": "now",
        "senderUsername":"mtmiller"
    },{
        "text": "second message",
        "time_sent": "later",
        "senderUsername":"mtmiller"
    }],
    "events": [{
        "title": "MattsEvent",
        "description": "An event",
        "dateOfEvent": "now",
        "locationName":  "My house",
        "locationAddress": "My house",
        "username": "mtmiller",
        "time": "now"
    }]
     */
};
// Creates a new message for a specific group
exports.createMessage = (req, res) => {
    console.log('\nTrying to create a message');
};
// Creates a new evnent for a specific group
exports.createEvent = (req, res) => {
    console.log('\nTrying to create an event');
};
// PUTs
// May need to add some unique identifier for evens and messages
// Edits a message to a specific groups messages
exports.editMessage = (req, res) => {
    console.log('\nTrying to edit a specific message');
};
// Edits an event to a specific groups eventList
exports.editEvent = (req, res) => {
    console.log('\nTrying to edit a specific event');
};
// DELETEs
// Deletes a specific group
exports.deleteGroup = (req, res) => {
    console.log('\nTrying to delete a specific group');
};
// Deletes a specific event
exports.deleteEvent = (req, res) => {
    console.log('\nTrying to delete a specific event');
};
//# sourceMappingURL=GroupController.js.map