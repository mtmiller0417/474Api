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

// Creates a new message for a specific group
export const createMessage = async (req: Request, res: Response) => {
    // Takes in group_id and message
    console.log('\nTrying to create a message')
    const bool  = await checkUserInGroup(req.body._id, req.headers.authorization);
    if(!bool){
        // The user is part of the group theyre t2rying to access
        return res.status(422).send({error: 'User does not belongs to the group'})
    } 
    // Rest of code here
}

// Creates a new event for a specific group
export const createEvent = async (req: Request, res: Response) => {
    console.log('\nTrying to create an event')
    // Takes in group_id and message
    const bool  = await checkUserInGroup(req.body._id, req.headers.authorization);
    if(!bool){
        // The user is part of the group theyre t2rying to access
        return res.status(422).send({error: 'User does not belongs to the group'})
    } 
    // Rest of code here
}

// PUTs

// May need to add some unique identifier for evens and messages

// Edits a message to a specific groups messages
export const editMessage = async (req: Request, res: Response) => {
    console.log('\nTrying to edit a specific message')
    // Takes in group_id and message
    const bool  = await checkUserInGroup(req.body._id, req.headers.authorization);
    if(!bool){
        // The user is part of the group theyre t2rying to access
        return res.status(422).send({error: 'User does not belongs to the group'})
    } 
    // Rest of code here
}

// Edits an event to a specific groups eventList
export const editEvent = async (req: Request, res: Response) => {
    console.log('\nTrying to edit a specific event')
    // Takes in group_id and message
    const bool  = await checkUserInGroup(req.body._id, req.headers.authorization);
    if(!bool){
        // The user is part of the group theyre t2rying to access
        return res.status(422).send({error: 'User does not belongs to the group'})
    } 
    // Rest of code here
}

// DELETEs

// Deletes a specific group
export const deleteGroup = async (req: Request, res: Response) => {
    console.log('\nTrying to delete a specific group')
    // Takes in group_id and message
    const bool  = await checkUserInGroup(req.body._id, req.headers.authorization);
    if(!bool){
        // The user is part of the group theyre t2rying to access
        return res.status(422).send({error: 'User does not belongs to the group'})
    } 
    // Rest of code here

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