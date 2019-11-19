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
        return res.status(422).send({ error: 'User does not belongs to the group' });
    }
    // Get the group the user is trying to edit
    const group = yield group_1.default.findById({ _id: req.body._id }); // Wait for the call to come back
    if (!group) {
        return res.status(422).send({ error: 'User not found' });
    }
    const messageList = group.messages;
    var text = req.body.text;
    var time_sent = req.body.time_sent;
    var senderUsername = req.body.senderUsername;
    // Create an initial JSON
    var update = {
        text: text,
        time_sent: time_sent,
        senderUsername: senderUsername,
    };
    // Get rid of attributes that weren't passed in
    if (!text) {
        delete update.text;
    }
    if (!time_sent) {
        delete update.time_sent;
    }
    if (!senderUsername) {
        delete update.senderUsername;
    }
    var index = -1;
    for (var i = 0; i < messageList.length; i++) {
        if (req.body.message_id.localeCompare(messageList[i]._id) == 0) {
            console.log('Message found!');
            index = i;
            break;
        }
    }
    if (index > -1) {
        //messageList[index] = update;
        if (text) {
            messageList[index].text = update.text;
        }
        if (time_sent) {
            messageList[index].time_sent = update.time_sent;
        }
        if (senderUsername) {
            messageList[index].senderUsername = update.senderUsername;
        }
    }
    // Update the according group to reflect the changes in events
    yield group_1.default.updateOne({ _id: req.body._id }, { messages: messageList }, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send('Group message has been updated');
        }
    });
});
// Edits an event to a specific groups eventList
exports.editEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\nTrying to edit a specific event');
    // Takes in group_id and message
    const bool = yield passport_1.checkUserInGroup(req.body._id, req.headers.authorization);
    if (!bool) {
        return res.status(422).send({ error: 'User does not belongs to the group' });
    }
    // Get the group the user is trying to edit
    const group = yield group_1.default.findById({ _id: req.body._id }); // Wait for the call to come back
    if (!group) {
        return res.status(422).send({ error: 'User not found' });
    }
    const eventList = group.events;
    var title = req.body.title;
    var description = req.body.description;
    var dateOfEvent = req.body.dateOfEvent;
    var locationName = req.body.locationName;
    var locationAddress = req.body.locationAddress;
    var username = req.body.username;
    var time = req.body.time;
    // Create an initial JSON
    var update = {
        title: title,
        description: description,
        dateOfEvent: dateOfEvent,
        locationName: locationName,
        locationAddress: locationAddress,
        username: username,
        time: time
    };
    // Get rid of attributes that weren't passed in
    if (!title) {
        delete update.title;
    }
    if (!description) {
        delete update.description;
    }
    if (!dateOfEvent) {
        delete update.dateOfEvent;
    }
    if (!locationName) {
        delete update.locationName;
    }
    if (!locationAddress) {
        delete update.locationAddress;
    }
    if (!username) {
        delete update.username;
    }
    if (!time) {
        delete update.time;
    }
    console.log(update);
    var index = -1;
    for (var i = 0; i < eventList.length; i++) {
        if (req.body.event_id.localeCompare(eventList[i]._id) == 0) {
            console.log('Event found!');
            index = i;
            break;
        }
    }
    console.log(index);
    if (index > -1) {
        if (title) {
            eventList[index].title = update.title;
        }
        if (description) {
            eventList[index].description = update.description;
        }
        if (dateOfEvent) {
            eventList[index].dateOfEvent = update.dateOfEvent;
        }
        if (locationName) {
            eventList[index].locationName = update.locationName;
        }
        if (locationAddress) {
            eventList[index].locationAddress = update.locationAddress;
        }
        if (username) {
            eventList[index].username = update.username;
        }
        if (time) {
            eventList[index].time = update.time;
        }
    }
    // Update the according group to reflect the changes in events
    yield group_1.default.updateOne({ _id: req.body._id }, { events: eventList }, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send('Group event has been updated');
        }
    });
});
// DELETEs
// Deletes a specific group
exports.deleteGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\nTrying to delete a specific group');
    // Takes in group_id and message
    const bool = yield passport_1.checkUserInGroup(req.body._id, req.headers.authorization);
    if (!bool) {
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
    // Get the group the user is trying to edit
    const group = yield group_1.default.findById({ _id: req.body._id }); // Wait for the call to come back
    if (!group) {
        return res.status(422).send({ error: 'User not found' });
    }
    const eventList = group.events;
    // Find the index of the event to remove
    var index = -1;
    for (var i = 0; i < eventList.length; i++) {
        if (req.body.event_id.localeCompare(eventList[i]._id) == 0) {
            console.log('Event found!');
            index = i;
            break;
        }
    }
    // Remove the event with splice
    eventList.splice(index, 1);
    console.log(eventList);
    // Update the according group to reflect the changes in events
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