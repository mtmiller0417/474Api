"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const group_1 = __importDefault(require("../models/group"));
const passport_1 = require("../security/passport");
// GETs
// Get all groups
exports.allGroups = (req, res) => {
    console.log('\nTrying to get all groups');
    const groups = group_1.default.find((err, group) => {
        if (err) {
            res.send(err);
        }
        else {
            console.log(group);
            res.send(group);
        }
    });
};
// Gets a specific group
exports.showGroup = (req, res) => {
    console.log('\nTrying to get a specific group');
    group_1.default.findOne({ _id: req.body._id }, function (err, group) {
        if (err) {
            return res.status(400).json({ error: 'bad data 0' });
        }
        if (!group) {
            return res.status(400).json({ error: 'Your group info cannot be verified. Please try again.' });
        }
        else {
            console.log('Here is the specific group that you are looking for.');
            let groupInfo = group.toJson();
            res.status(200).json({
                group: groupInfo
            });
        }
    });
};
// POSTs
// Creates a new group, adds the user who created it as first member
exports.createGroup = (req, res, next) => {
    console.log('\nTrying to create a group');
    console.log(req.body);
    var groupName = req.body.groupName;
    var members = req.body.members;
    var messages = req.body.messages;
    var events = req.body.events;
    var groupImage = req.body.groupImage;
    if (!groupName) {
        return res.status(422).send({ error: 'You must enter a group name.' });
    }
    // Check if there's at least one member
    if (!members) {
        return res.status(422).send({ error: 'You must have at least one member in a group.' });
    }
    var group = new group_1.default({
        groupName: groupName,
        members: members,
        messages: messages,
        events: events,
        groupImage: groupImage
    });
    group.save(function (err, group) {
        if (err) {
            return (err);
        }
        let groupInfo = group.toJSON();
        res.status(201).json({
            group: groupInfo
        });
    });
};
// Creates a new message for a specific group
exports.createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Takes in group_id and message
    console.log('\nTrying to create a message');
    const bool = yield passport_1.checkUserInGroup(req.body._id, req.headers.authorization);
    if (!bool) {
        // The user is part of the group theyre t2rying to access
        return res.status(422).send({ error: 'User does not belongs to the group' });
    }
    // Rest of code here
});
// Creates a new event for a specific group
exports.createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\nTrying to create an event');
    // Takes in group_id and message
    const bool = yield passport_1.checkUserInGroup(req.body._id, req.headers.authorization);
    if (!bool) {
        // The user is part of the group theyre t2rying to access
        return res.status(422).send({ error: 'User does not belongs to the group' });
    }
    // Rest of code here
});
// PUTs
// May need to add some unique identifier for evens and messages
// Edits a message to a specific groups messages
exports.editMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\nTrying to edit a specific message');
    // Takes in group_id and message
    const bool = yield passport_1.checkUserInGroup(req.body._id, req.headers.authorization);
    if (!bool) {
        // The user is part of the group theyre t2rying to access
        return res.status(422).send({ error: 'User does not belongs to the group' });
    }
    // Rest of code here
});
// Edits an event to a specific groups eventList
exports.editEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\nTrying to edit a specific event');
    // Takes in group_id and message
    const bool = yield passport_1.checkUserInGroup(req.body._id, req.headers.authorization);
    if (!bool) {
        // The user is part of the group theyre t2rying to access
        return res.status(422).send({ error: 'User does not belongs to the group' });
    }
    // Rest of code here
});
// DELETEs
// Deletes a specific group
exports.deleteGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\nTrying to delete a specific group');
    // Takes in group_id and message
    const bool = yield passport_1.checkUserInGroup(req.body._id, req.headers.authorization);
    if (!bool) {
        // The user is part of the group theyre t2rying to access
        return res.status(422).send({ error: 'User does not belongs to the group' });
    }
    // Rest of code here
    const group = group_1.default.deleteOne({ _id: req.body._id }, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Group deleted from database");
        }
    });
});
// Deletes a specific event for a specific group
exports.deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\nTrying to delete a specific event');
    // Takes in group_id and message
    const bool = yield passport_1.checkUserInGroup(req.body._id, req.headers.authorization);
    if (!bool) {
        return res.status(422).send({ error: 'User does not belongs to the group' });
    }
    // Rest of code here
    console.log("group_id: " + req.body._id);
    const group = yield group_1.default.findById({ _id: req.body._id }); // Wait for the call to come back
    console.log(group);
    if (!group) {
        return res.status(422).send({ error: 'User not found' });
    }
    const eventList = group.events;
    var index = -1;
    for (var i = 0; i < eventList.length; i++) {
        if (req.body.event_id.localeCompare(eventList[i]._id) == 0) {
            console.log('Event found!');
            index = i;
            break;
        }
    }
    eventList.splice(index, 1);
    console.log(eventList);
    yield group_1.default.updateOne({ _id: req.body._id }, { events: eventList }, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send('Group event has been updated(deleted)');
        }
    });
});
// Actually deletes the first user in the database...
exports.deleteAllGroups = (req, res) => {
    console.log("\nTrying to delete all users");
    const users = group_1.default.deleteOne((err, group) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(group);
        }
    });
};
//# sourceMappingURL=GroupController.js.map