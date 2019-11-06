import { Request, Response } from "express";
import User from "../models/user";

// Gets all the users
export const allUsers = (req: Request, res: Response) => {
    console.log('Trying to get all users');
    const users = User.find((err: any, users: any) => {
        if(err){
            res.send(err);
        } else {
            res.send(users)
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
export const addUser = (req: Request, res: Response) => {
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