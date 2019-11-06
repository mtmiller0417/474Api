"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
// Gets all the users
exports.allUsers = (req, res) => {
    console.log('Trying to get all users');
    const users = user_1.default.find((err, users) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(users);
        }
    });
};
// Gets a specific user
exports.showUser = (req, res) => {
    console.log("Trying to get a specific user");
    const user = user_1.default.findById(req.params.id, (err, user) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(user);
        }
    });
};
// Register a new user
exports.addUser = (req, res) => {
    console.log("Trying to add a new user");
    const user = new user_1.default(req.body); //req.body,req.query
    console.log(req.body);
    user.save((err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(user);
        }
    });
};
// Update a user
exports.updateUser = (req, res) => {
    console.log("Trying to update a user");
    let user = user_1.default.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(user);
        }
    });
};
exports.deleteUser = (req, res) => {
    const user = user_1.default.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send("User deleted from database");
        }
    });
};
//# sourceMappingURL=UserController.js.map