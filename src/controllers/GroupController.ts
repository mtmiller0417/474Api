// Import statements
import { Request, Response } from "express";
import Group from "../models/group";
import jwt from 'jsonwebtoken'
import { secret } from '../config/config'
import { NextFunction } from "connect";
import bcrypt from 'bcrypt-nodejs';

// Used for bcrypt
/*const saltRounds:number = 10;

function generateToken(group: any) {
    return jwt.sign(group, secret, {
        expiresIn: 10080 // in seconds
    });
}*/

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

    if (!groupName) {
        return res.status(422).send({error: 'You must enter a group name.'})
    }
    // Check if there's at least one member
    if (!members) {
        return res.status(422).send({error: 'You must have at least one member in a group.'})
    }

    /*Group.findOne({groupName: groupName}, function(err) {
        if (err) {
            return res.status(422).send({error: 'There was an error finding the group.'})
        } else {*/
            var group = new Group({
                groupName: groupName,
                members: members,
                messages: messages,
                events: events
            });

            group.save(function(err, group){
                if (err) {return (err);}
                let groupInfo = group.toJSON();
                res.status(201).json({
                    group: groupInfo
                });
            });
        /*}
    })*/
    /**
     * 
    
     */
}

// Creates a new message for a specific group (Updating a group essentially)
export const createMessage = (req: Request, res: Response) => {
    console.log('\nTrying to create a message for a specific group.');
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
        
        console.log(group.messages);
        group.messages.push(new_message);
        console.log(group.messages);
        res.send('New message has been added to this group.');
    });
}

// Creates a new event for a specific group
export const createEvent = (req: Request, res: Response) => {
    console.log('\nTrying to create an event')
}

// PUTs

// May need to add some unique identifier for evens and messages

// Edits a message to a specific groups messages
export const editMessage = (req: Request, res: Response) => {
    console.log('\nTrying to edit a specific message')
}

// Edits an event to a specific groups eventList
export const editEvent = (req: Request, res: Response) => {
    console.log('\nTrying to edit a specific event')
}

// DELETEs

// Deletes a specific group
export const deleteGroup = (req: Request, res: Response) => {
    console.log('\nTrying to delete a specific group')
    const group = Group.deleteOne({_id: req.body._id}, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Group deleted from database");
        }
    });
};

// Deletes a specific event
export const deleteEvent = (req: Request, res: Response) => {
    console.log('\nTrying to delete a specific event')
}