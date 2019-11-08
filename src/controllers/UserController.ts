import { Request, Response } from "express";
import User from "../models/user";
import jwt from 'jsonwebtoken'
import { db } from '../config/config'
import { secret } from '../config/config'
import { NextFunction } from "connect";

function generateToken(user: any) {
    return jwt.sign(user, secret, {
        expiresIn: 10080 // in seconds
    });
}

// Gets all the users
export const allUsers = (req: Request, res: Response) => {
    console.log('Trying to get all users');
    
    var allUsers:any[] = []

    const users = User.find((err: any, user: any) => {
        if(err){
            res.send(err);
        } else {
            //console.log(user.firstName)
            console.log(user)
            allUsers.push(user)
            //console.log(name_list)
            res.send(user)
        }
    });
};

// Gets a specific user
export const showUser = (req: Request, res: Response) => {
    console.log("Trying to get a specific user")
    const user = User.findById(req.params.id, (err: any, user: any) => {
        if(err){
            res.send(err);
        } else {
            res.send(user);
        }
    });
};

// Register a new user
export const addUser = (req: Request, res: Response, next: NextFunction) => {
    console.log("Register new user")
    const user = new User(req.body);
    console.log(req)
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const clientID = req.body._id

    // Check if ID is present
    if(!clientID){
        return res.status(422).send({ error: 'No clientid passed to register against.' })
    }
    // Check if firstName and lastName exist
    if(!firstName || !lastName) {
        return res.status(422).send({ error: 'You must enter your full name.' });
    }

    User.findOne({_id: clientID}, function(err, existingUser){
        if (err) { return next(err); }
        if (existingUser) {
            // User already exists...
        } else {
            var user = new User({
                firstName: firstName, 
                lastName: lastName,
            });

            user.save(function(err, user){
                if(err){ return (err); }
                let userInfo = user.toJSON();
                res.status(201).json({
                    token: 'JWT ' + generateToken(userInfo),
                    user: userInfo
                });
            });
        }
    })
    /*console.log(req.body)
    user.save((err: any) => {
        if(err){
            res.send(err);
        } else {
            res.send(user);
        }
    });*/
};

// Update a user
export const updateUser = (req: Request, res: Response) => {
    console.log("Trying to update a user")
    let user = User.findByIdAndUpdate(
        req.params.id,
        req.body,
        (err: any, user: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(user);
            }
        }
    );
};

export const deleteUser = (req: Request, res: Response) => {
    const user = User.deleteOne({_id: req.params.id}, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("User deleted from database");
        }
    });
};

export const deleteAll = (req: Request, res: Response) => {
    const users = User.deleteOne((err: any, user: any) => {
        if(err){
            res.send(err);
        } else {
            console.log(user)
            res.send(user)
        }
    });
}