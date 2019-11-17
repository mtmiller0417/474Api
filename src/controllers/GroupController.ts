// Import statements
import { Request, Response } from "express";
import Group from "../models/group";
import jwt from 'jsonwebtoken'
import { secret } from '../config/config'
import { NextFunction } from "connect";
import bcrypt from 'bcrypt-nodejs';

// Used for bcrypt
const saltRounds:number = 10;

function generateToken(group: any) {
    return jwt.sign(group, secret, {
        expiresIn: 10080 // in seconds
    });
}

// GETs

// Get all groups
export const allGroups = (req: Request, res: Response) => {
    console.log('\nTrying to get all groups')
}

// Gets a specific group
export const showGroup = (req: Request, res: Response) => {
    console.log('\nTrying to get a specific group')
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

    /**
     * 
    
     */
}

// Creates a new message for a specific group
export const createMessage = (req: Request, res: Response) => {
    console.log('\nTrying to create a message')
}

// Creates a new evnent for a specific group
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
}

// Deletes a specific event
export const deleteEvent = (req: Request, res: Response) => {
    console.log('\nTrying to delete a specific event')
}