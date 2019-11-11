// Import statements
import { Request, Response } from "express";
import User from "../models/user";
import jwt from 'jsonwebtoken'
import { db } from '../config/config'
import { secret } from '../config/config'
import { NextFunction } from "connect";
import bcrypt from 'bcrypt-nodejs';

// Used for bcrypt
const saltRounds:number = 10;

function generateToken(user: any) {
    return jwt.sign(user, secret, {
        expiresIn: 10080 // in seconds
    });
}

// Gets all the users
export const allUsers = (req: Request, res: Response) => {
    console.log('\nTrying to get all users');
    console.log(req.body)
    
    //var allUsers:any[] = []

    const users = User.find((err: any, user: any) => {
        if(err){
            res.send(err);
        } else {
            //console.log(user.firstName)
            //console.log(user)
            //allUsers.push(user)
            //console.log(name_list)
            console.log(user)
            res.send(user)
        }
    });
};

// Gets a specific user (LOGIN)
export const showUser = (req: Request, res: Response) => {
    /*console.log("Trying to get a specific user")
    const user = User.findById(req.params.id, (err: any, user: any) => {
        if(err){
            res.send(err);
        } else {
            res.send(user);
        }
    });*/

    User.findOne({userName: req.body.userName}, function(err: any, user: any){
        if(err) {  return res.status(400).json({ error: "bad data 0" }); }
        if (!user) { return res.status(400).json({ error: 'Your login details could not be verified. Please try again.' }); }
        user.comparePassword(req.body.password, function(err:any, isMatch:any){
            if(err) { return res.status(400).json({error: "bad data 1"})}
            if (!isMatch) { return res.status(400).json({ error: 'Your login details could not be verified. Please try again.' }); }
            console.log('Passwords matched!')
            let userInfo = user.toJson();
            res.status(200).json({
                token: 'Bearer ' + generateToken(userInfo),
                user: userInfo
            });
        });
    });
};

// Register a new user
export const addUser = (req: Request, res: Response, next: NextFunction) => {
    console.log("\nRegister new user")
    console.log(req.body)
    const userName = req.body.userName;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    // Check if ID is present
    if(!userName){
        return res.status(422).send({ error: 'No username passed to register against.' })
    }
    if(!password){
        return res.status(422).send({ error: 'No password passed to register against.' })
    }
    // Check if firstName and lastName exist
    if(!firstName || !lastName) {
        return res.status(422).send({ error: 'You must enter your full name.' });
    }

    let hash = bcrypt.hashSync(password) // Use hashSync with default saltRounds

    User.findOne({userName: userName}, function(err, existingUser){
        if (err) { return next(err); }
        if (existingUser) {
            // User already exists...
            return res.status(422).send({ error: 'This username is already taken.' });
        } else {
            var user = new User({
                userName: userName,
                password: hash,
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
    /*
    console.log("Trying to add a new user")
    const user = new User(req.body);//req.body,req.query
    console.log(req.body)
    user.save((err: any) => {
        if(err){
            res.send(err);
        } else {
            res.send(user);
        }
    });
    */
};

// Update a user
export const updateUser = (req: Request, res: Response) => {
    console.log("\nTrying to update a user")
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
    console.log("\nTrying to delete a specific user")
    const user = User.deleteOne({_id: req.params.id}, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("User deleted from database");
        }
    });
};

export const deleteAll = (req: Request, res: Response) => {
    console.log("\nTrying to delete all users")
    const users = User.deleteOne((err: any, user: any) => {
        if(err){
            res.send(err);
        } else {
            //console.log(user)
            res.send(user)
        }
    });
}