"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
// Used for bcrypt
const saltRounds = 10;
function generateToken(user) {
    return jsonwebtoken_1.default.sign(user, config_1.secret, {
        expiresIn: 10080 // in seconds
    });
}
// Gets all the users
exports.allUsers = (req, res) => {
    console.log('\nTrying to get all users');
    console.log(req.body);
    //var allUsers:any[] = []
    const users = user_1.default.find((err, user) => {
        if (err) {
            res.send(err);
        }
        else {
            //console.log(user.firstName)
            //console.log(user)
            //allUsers.push(user)
            //console.log(name_list)
            console.log(user);
            res.send(user);
        }
    });
};
// Gets a specific user (LOGIN)
exports.showUser = (req, res) => {
    user_1.default.findOne({ userName: req.body.userName }, function (err, user) {
        if (err) {
            return res.status(400).json({ error: "bad data 0" });
        }
        if (!user) {
            return res.status(400).json({ error: 'Your login details could not be verified. Please try again.' });
        }
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (err) {
                return res.status(400).json({ error: "bad data 1" });
            }
            if (!isMatch) {
                return res.status(400).json({ error: 'Your login details could not be verified. Please try again.' });
            }
            console.log('Correct password has been entered');
            let userInfo = user.toJson();
            res.status(200).json({
                token: 'Bearer ' + generateToken(userInfo),
                user: userInfo
            });
        });
    });
};
// Register a new user
exports.addUser = (req, res, next) => {
    console.log("\nRegister new user");
    console.log(req.body);
    console.log(next);
    const userName = req.body.userName;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    // Check if ID is present
    if (!userName) {
        return res.status(422).send({ error: 'No username passed to register against.' });
    }
    if (!password) {
        return res.status(422).send({ error: 'No password passed to register against.' });
    }
    // Check if firstName and lastName exist
    if (!firstName || !lastName) {
        return res.status(422).send({ error: 'You must enter your full name.' });
    }
    let hash = bcrypt_nodejs_1.default.hashSync(password); // Use hashSync with default saltRounds
    user_1.default.findOne({ userName: userName }, function (err, existingUser) {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            // User already exists...
            return res.status(422).send({ error: 'This username is already taken.' });
        }
        else {
            var user = new user_1.default({
                userName: userName,
                password: hash,
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
exports.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nTrying to update a user");
    const userName = req.body.userName;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    // Create the initial JSON
    var update = {
        userName: userName,
        password: password,
        firstName: firstName,
        lastName: lastName
    };
    // remove undefined things from the JSON???
    console.log(update);
    const user = yield user_1.default.findById({ _id: req.body._id }); // Wait for this response
    yield user_1.default.updateOne({ _id: req.body._id }, update, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send('User has been updated');
        }
    });
    /*let user = User.findById({_id: req.body._id}, (err: any) => {
        if (err){
            res.send(err);
        } else {
            console.log('You have updated the user');
            res.send(req.body)
        }
    });*/
    /*let user = User.findByIdAndUpdate(
        req.body.id,
        req.body,
        (err: any, user: any) => {
            if (err) {
                res.send(err);
            } else {
                console.log(user)
                res.send(user);
            }
        }
    );*/
});
exports.deleteUser = (req, res) => {
    console.log("\nTrying to delete a specific user");
    const user = user_1.default.deleteOne({ _id: req.body.id }, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send("User deleted from database");
        }
    });
};
exports.deleteAll = (_req, res) => {
    console.log("\nTrying to delete all users");
    const users = user_1.default.deleteOne((err, user) => {
        if (err) {
            res.send(err);
        }
        else {
            //console.log(user)
            res.send(user);
        }
    });
};
//# sourceMappingURL=UserController.js.map