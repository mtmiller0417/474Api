"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
function generateToken(user) {
    return jsonwebtoken_1.default.sign(user, config_1.secret, {
        expiresIn: 10080 // in seconds
    });
}
// Gets all the users
exports.allUsers = (req, res) => {
    console.log('Trying to get all users');
    var allUsers = [];
    const users = user_1.default.find((err, user) => {
        if (err) {
            res.send(err);
        }
        else {
            //console.log(user.firstName)
            console.log(user);
            allUsers.push(user);
            //console.log(name_list)
            res.send(user);
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
exports.addUser = (req, res, next) => {
    console.log("Register new user");
    const user = new user_1.default(req.body);
    console.log(req);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const clientID = req.body._id;
    // Check if ID is present
    if (!clientID) {
        return res.status(422).send({ error: 'No clientid passed to register against.' });
    }
    // Check if firstName and lastName exist
    if (!firstName || !lastName) {
        return res.status(422).send({ error: 'You must enter your full name.' });
    }
    user_1.default.findOne({ _id: clientID }, function (err, existingUser) {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            // User already exists...
        }
        else {
            var user = new user_1.default({
                firstName: firstName,
                lastName: lastName,
            });
            user.save(function (err, user) {
                if (err) {
                    return (err);
                }
                let userInfo = user.toJSON();
                res.status(201).json({
                    token: 'JWT ' + generateToken(userInfo),
                    user: userInfo
                });
            });
        }
    });
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
exports.deleteAll = (req, res) => {
    const users = user_1.default.deleteOne((err, user) => {
        if (err) {
            res.send(err);
        }
        else {
            console.log(user);
            res.send(user);
        }
    });
};
//# sourceMappingURL=UserController.js.map