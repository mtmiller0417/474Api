// Import statements
import { Request, Response } from "express";
import Group from "../models/group";
import User from "../models/user";
import jwt from 'jsonwebtoken'
import { secret } from '../config/config'
import { NextFunction } from "connect";
import bcrypt from 'bcrypt-nodejs';

import { parseUserFromHeader } from '../security/passport'
import { compareHeaderUserID } from '../security/passport'
import { checkUserInGroup } from '../security/passport'


// GETs

// Get all groups
export const allGroups = (req: Request, res: Response) => {
    console.log('\nTrying to get all groups');
    const groups = Group.find((err: any, group: any) => {
        if (err) {
            res.send(err);
        } else {
            console.log(group);
            res.send(group);
        }
    });
};

// Gets a specific group
export const showGroup = (req: Request, res: Response) => {
    console.log('\nTrying to get a specific group');
    Group.findOne({_id: req.body._id}, function(err: any, group: any) {
        if (err) {
            return res.status(400).json({error: 'bad data 0'});
        }
        if (!group) {
            return res.status(400).json({error: 'Your group info cannot be verified. Please try again.'});
        } else {
            console.log('Here is the specific group that you are looking for.');
            let groupInfo = group.toJson();
            res.status(200).json({
                group: groupInfo
            });
        }
    });
}

// POSTs

// Creates a new group, adds the user who created it as first member
export const createGroup = (req: Request, res: Response, next: NextFunction) => {
    console.log('\nTrying to create a group')
    console.log(req.body)

    var groupName = req.body.groupName;
    var members = req.body.members;
    var messages = req.body.messages;
    var events = req.body.events;
    var groupImage = req.body.groupImage;

    if (!groupName) {
        return res.status(422).send({error: 'You must enter a group name.'})
    }
    // Check if there's at least one member
    if (!members) {
        return res.status(422).send({error: 'You must have at least one member in a group.'})
    }
    var group = new Group({
        groupName: groupName,
        members: members,
        messages: messages,
        events: events,
        groupImage: groupImage
    });

    group.save(function(err, group){
        if (err) {return (err);}
        let groupInfo = group.toJSON();
        res.status(201).json({
            group: groupInfo
        });
    });
}

// Creates a new message for a specific group (Updating a group essentially)
export const createMessage = async (req: Request, res: Response) => {
    console.log('\nTrying to create a message for a specific group.');
    const bool  = await checkUserInGroup(req.body._id, req.headers.authorization);
    if(!bool){ return res.status(422).send({error: 'User does not belongs to the group'}) } 
    Group.findOne({_id: req.body._id}, function(err: any, group: any) {
        if (err) {
            return res.status(400).json({error: 'bad data 0'});
        }
        if (!group) {
            return res.status(400).json({error: 'Your group info could not be verified. Please try again.'});
        }

        var text:string = req.body.text;
        var time_sent:string = req.body.time_sent;
        var senderUsername:string = req.body.senderUsername; 

        var new_message = {
            text: text,
            time_sent: time_sent,
            senderUsername: senderUsername
        }
        
        //console.log(group.messages);
        group.messages.push(new_message);
        
        //console.log(group.messages);
        Group.updateOne({_id: req.body._id}, {messages: group.messages}, (err: any) => {
            if(err){
                res.send(err);
            } else {
                res.send('New message has been added to this group.');
            }
        });
    });
}

// Creates a new event for a specific group
export const createEvent = async (req: Request, res: Response) => {
    console.log('\nTrying to create a new event for a specific group.');

    const bool  = await checkUserInGroup(req.body._id, req.headers.authorization);
    if(!bool){ return res.status(422).send({error: 'User does not belongs to the group'}) } 

    Group.findOne({_id: req.body._id}, function(err: any, group: any) {
        if (err) {
            return res.status(400).json({error: 'bad data 0'});
        }
        if (!group) {
            return res.status(400).json({error: 'Your group info could not be verified. Please try again.'});
        }

        var title:string = req.body.title;
        var description:string = req.body.description;
        var dateOfEvent:string = req.body.dateOfEvent;
        var locationName:string = req.body.locationName;
        var locationAddress:string = req.body.locationAddress;
        var username:string = req.body.username;
        var time:string = req.body.time; 

        var new_event = {
            title: title,
            description: description,
            dateOfEvent: dateOfEvent,
            locationName: locationName,
            locationAddress: locationAddress,
            username: username,
            time: time
        }
        
        //console.log(group.events);
        group.events.push(new_event);
        //console.log(group.events);
        Group.updateOne({_id: req.body._id}, {events: group.events}, (err: any) => {
            if(err){
                res.send(err);
            } else {
                res.send('New event has been added to this group.');
            }
        });
    });
}

// PUTs

// May need to add some unique identifier for evens and messages

// Edits a message to a specific groups messages
export const editMessage = async (req: Request, res: Response) => {
    console.log('\nTrying to edit a specific message')
    // Takes in group_id and message
    const bool  = await checkUserInGroup(req.body._id, req.headers.authorization);
    if(!bool){ return res.status(422).send({error: 'User does not belongs to the group'}) } 

    // Get the group the user is trying to edit
    const group:any = await Group.findById({_id: req.body._id}); // Wait for the call to come back
    if(!group){ return res.status(422).send({error: 'User not found'}) }
    const messageList = group.messages;

    var text: String = req.body.text;
    var time_sent: String = req.body.time_sent;
    var senderUsername: String = req.body.senderUsername;

    // Create an initial JSON
    var update = {
        text: text,
        time_sent: time_sent,
        senderUsername: senderUsername,
    }

    // Get rid of attributes that weren't passed in
    if(!text){ delete update.text }
    if(!time_sent){ delete update.time_sent }
    if(!senderUsername){ delete update.senderUsername }

    var index = -1;
    for(var i = 0; i < messageList.length; i++){
        if(req.body.message_id.localeCompare(messageList[i]._id) == 0){
            console.log('Message found!');
            index = i;
            break;
        }
    }
    if(index > -1){
        //messageList[index] = update;
        if(text){ messageList[index].text = update.text }
        if(time_sent){ messageList[index].time_sent = update.time_sent }
        if(senderUsername){ messageList[index].senderUsername = update.senderUsername }
    }
    // Update the according group to reflect the changes in events
    await Group.updateOne({_id:req.body._id}, {messages: messageList}, (err: any) => {
        if(err){
            res.send(err);
        } else {
            res.send('Group message has been updated')
        }
    });
}

// Edits an event to a specific groups eventList
export const editEvent = async (req: Request, res: Response) => {
    console.log('\nTrying to edit a specific event')
    // Takes in group_id and message
    const bool  = await checkUserInGroup(req.body._id, req.headers.authorization);
    if(!bool){ return res.status(422).send({error: 'User does not belongs to the group'}) } 

    // Get the group the user is trying to edit
    const group:any = await Group.findById({_id: req.body._id}); // Wait for the call to come back
    if(!group){ return res.status(422).send({error: 'User not found'}) }
    const eventList = group.events;

    var title: String = req.body.title;
    var description: String = req.body.description;
    var dateOfEvent: String = req.body.dateOfEvent;
    var locationName: String = req.body.locationName;
    var locationAddress: String = req.body.locationAddress;
    var username: String = req.body.username;
    var time: String = req.body.time;

    // Create an initial JSON
    var update = {
        title: title,
        description: description,
        dateOfEvent: dateOfEvent,
        locationName: locationName,
        locationAddress: locationAddress,
        username: username,
        time: time
    }

    // Get rid of attributes that weren't passed in
    if(!title){ delete update.title }
    if(!description){ delete update.description }
    if(!dateOfEvent){ delete update.dateOfEvent }
    if(!locationName){ delete update.locationName }
    if(!locationAddress){ delete update.locationAddress }
    if(!username){ delete update.username }
    if(!time){ delete update.time }

    console.log(update)

    var index = -1;
    for(var i = 0; i < eventList.length; i++){
        if(req.body.event_id.localeCompare(eventList[i]._id) == 0){
            console.log('Event found!');
            index = i;
            break;
        }
    }
    console.log(index)
    if(index > -1){
        if(title){ eventList[index].title = update.title }
        if(description){ eventList[index].description = update.description }
        if(dateOfEvent){ eventList[index].dateOfEvent = update.dateOfEvent }
        if(locationName){ eventList[index].locationName = update.locationName }
        if(locationAddress){ eventList[index].locationAddress = update.locationAddress }
        if(username){ eventList[index].username = update.username }
        if(time){ eventList[index].time = update.time }
    }
    // Update the according group to reflect the changes in events
    await Group.updateOne({_id:req.body._id}, {events: eventList }, (err: any) => {
        if(err){
            res.send(err);
        } else {
            res.send('Group event has been updated')
        }
    });
}

// DELETEs

// Deletes a specific group
export const deleteGroup = async (req: Request, res: Response) => {
    console.log('\nTrying to delete a specific group')

    const bool  = await checkUserInGroup(req.body._id, req.headers.authorization);
    if(!bool){ return res.status(422).send({error: 'User does not belongs to the group'}) } 

    const group = Group.deleteOne({_id: req.body._id}, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Group deleted from database");
        }
    });
};

// Deletes a specific event for a specific group
export const deleteEvent = async (req: Request, res: Response) => {
    console.log('\nTrying to delete a specific event')
    
    // Takes in group_id and message
    const bool = await checkUserInGroup(req.body._id, req.headers.authorization);
    if(!bool){ return res.status(422).send({error: 'User does not belongs to the group'}) } 

    // Get the group the user is trying to edit
    const group:any = await Group.findById({_id: req.body._id}); // Wait for the call to come back
    if(!group){ return res.status(422).send({error: 'User not found'}) }
    const eventList = group.events;

    // Find the index of the event to remove
    var index = -1;
    for(var i = 0; i < eventList.length; i++){
        if(req.body.event_id.localeCompare(eventList[i]._id) == 0){
            console.log('Event found!');
            index = i;
            break;
        }
    }

    // Remove the event with splice
    eventList.splice(index, 1);
    console.log(eventList)

    // Update the according group to reflect the changes in events
    await Group.updateOne({_id:req.body._id}, {events: eventList}, (err: any) => {
        if(err){
            res.send(err);
        } else {
            res.send('Group event has been updated(deleted)')
        }
    });
}

// Actually deletes the first user in the database...
export const deleteAllGroups = (req: Request, res: Response) => {
    console.log("\nTrying to delete all users")
    const users = Group.deleteOne((err: any, group: any) => {
        if(err){
            res.send(err);
        } else {
            res.send(group)
        }
    });
}