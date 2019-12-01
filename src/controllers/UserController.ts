// Import statements
import { Request, Response } from "express";
import User from "../models/user";
import jwt from 'jsonwebtoken'
import { secret } from '../config/config'
import { NextFunction } from "connect";
import bcrypt from 'bcrypt-nodejs';

import { parseUserFromHeader } from '../security/passport'
import { compareHeaderUserID } from '../security/passport'

// Used for bcrypt
const saltRounds:number = 10;

function generateToken(user: any) {
    return jwt.sign(user, secret, {
        expiresIn: 10080 // in seconds
    });
}

// GETs

// Gets all the users
export const allUsers = (req: Request, res: Response) => {
    console.log('\nTrying to get all users');
    console.log(req.body)

    const users = User.find((err: any, user: any) => {
        if(err){
            res.send(err);
        } else {
            console.log(user)
            res.send(user)
        }
    });
};

// Gets all the groupsIDs for a specific user
export const getGroupIDs = (req: Request, res: Response) => {
    // Pass token in the header

    const userjson = parseUserFromHeader(req.headers.authorization);

    User.findOne({_id: userjson._id}, function(err: any, user: any){
        if(err) {  return res.status(400).json({ error: "bad data 0" }); }
        if (!user) { return res.status(400).json({ error: 'User not found' }); }
        else {
            res.send(user.groupIDs);
        }
    })
}

// Gets a specific user (LOGIN)
export const showUser = (req: Request, res: Response) => {
    console.log('\nGet a specific user')
    User.findOne({username: req.body.username}, function(err: any, user: any){
        if(err) {  return res.status(400).json({ error: "bad data 0" }); }
        if (!user) { return res.status(400).json({ error: 'Your login details could not be verified. Please try again.' }); }
        user.comparePassword(req.body.password, function(err:any, isMatch:any){
            if(err) { return res.status(400).json({error: "bad data 1"})}
            if (!isMatch) { return res.status(400).json({ error: 'Your login details could not be verified. Please try again.' }); }
            console.log('Correct password has been entered')
            const userInfo = user.toJson();
            let userToken = JSON.parse(JSON.stringify(userInfo));
            delete userToken.profilePicture;
            res.status(200).json({
                token: 'Bearer ' + generateToken(userToken),
                user: userInfo
            });
        });
    });
};

// POSTs

// Register a new user
export const addUser = (req: Request, res: Response, next: NextFunction) => {
    console.log("\nRegister new user")
    console.log(req.body)
    
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const profilePicture = req.body.profilePicture;
    const bio = req.body.bio;
    var groupIDs = req.body.groupIDs;
    const requests = req.body.requests;


    // Check if ID is present
    if(!username){
        return res.status(422).send({ error: 'No username passed to register against.' })
    }
    if(!password){
        return res.status(422).send({ error: 'No password passed to register against.' })
    }
    // Check if firstName and lastName exist
    if(!firstName || !lastName) {
        return res.status(422).send({ error: 'You must enter your full name.' });
    }
    if(!groupIDs){
        groupIDs = [];
    }

    let hash = bcrypt.hashSync(password) // Use hashSync with default saltRounds

    User.findOne({username: username}, function(err, existingUser){
        if (err) {
            return res.status(422).send({ error: 'There was an error finding user :(' });
        }
        if (existingUser) {
            // User already exists...
            return res.status(422).send({ error: 'This username is already taken.' });
        } else {
            var user = new User({
                username: username,
                password: hash,
                firstName: firstName, 
                lastName: lastName,
                profilePicture: profilePicture,
                bio: bio,
                groupIDs: groupIDs,
                requests: requests
            });

            user.save(function(err, user){
                if(err){ return (err); }
                const userInfo = user.toJSON();
                let userToken = JSON.parse(JSON.stringify(userInfo));
                delete userToken.profilePicture;
                res.status(201).json({
                    token: 'Bearer ' + generateToken(userToken), // Use 'JWT' as header?
                    user: userInfo
                });
            });
        }
    })
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
    console.log("\nTrying to update a user");

    const headerJSON = parseUserFromHeader(req.headers.authorization);

    // If the _id is only gotten from the header, then they must be accessing their own data
    /*// Check if the user is accessing their own data
    if(!compareHeaderUserID(headerJSON._id, req.headers.authorization)){ // req.body._id
        return res.status(422).send({ error: 'You attempted to access data that is not yours' });
    }*/


    var username:string = req.body.username;
    var password:string = req.body.password;
    var firstName:string = req.body.firstName;
    var lastName:string = req.body.lastName;
    var profilePicture:string = req.body.profilePicture;
    var bio:string = req.body.bio;
    var groupIDs:[string] = req.body.groupIDs;
    var requests:[string] = req.body.requests;

    // Create the initial JSON
    var update = { 
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        profilePicture: profilePicture,
        bio: bio,
        groupIDs: groupIDs,
        requests: requests
    }
    // Get rid of attributes
    if(!username){ delete update.username }
    if(!password){ delete update.password }
    if(!firstName){ delete update.firstName }
    if(!lastName){ delete update.lastName }
    if(!profilePicture){ delete update.profilePicture }
    if(!bio){ delete update.bio }
    if(!groupIDs){ delete update.groupIDs }
    if(!requests){ delete update.requests }

    // If they're changing their password, make sure to ecrypt it
    if(password){ update.password = bcrypt.hashSync(password); console.log(password); }

    //const user = await User.findById({_id:req.body._id}); // Wait for this response
    
    // Gotten rid of await (check to see if it still returns an error.)
    User.updateOne({_id: headerJSON._id}, update, (err: any) => {
        if(err){
            res.send(err);
        } else {
            res.send('User has been updated')
        }
    });
};

export const deleteUser = (req: Request, res: Response) => {
    console.log("\nTrying to delete a specific user")
    const user = User.deleteOne({_id: req.body._id}, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("User deleted from database");
        }
    });
};

// Actually deletes the first user in the database...
export const deleteAll = (req: Request, res: Response) => {
    console.log("\nTrying to delete all users")
    const users = User.deleteOne((err: any, user: any) => {
        if(err){
            res.send(err);
        } else {
            res.send(user)
        }
    });
}