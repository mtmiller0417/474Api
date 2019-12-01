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
const passport_1 = require("../security/passport");
// Used for bcrypt
const saltRounds = 10;
function generateToken(user) {
    return jsonwebtoken_1.default.sign(user, config_1.secret, {
        expiresIn: 10080 // in seconds
    });
}
// GETs
// Gets all the users
exports.allUsers = (req, res) => {
    console.log('\nTrying to get all users');
    console.log(req.body);
    const users = user_1.default.find((err, user) => {
        if (err) {
            res.send(err);
        }
        else {
            console.log(user);
            res.send(user);
        }
    });
};
// Gets all the groupsIDs for a specific user
exports.getGroupIDs = (req, res) => {
    // Pass token in the header
    const userjson = passport_1.parseUserFromHeader(req.headers.authorization);
    user_1.default.findOne({ _id: userjson._id }, function (err, user) {
        if (err) {
            return res.status(400).json({ error: "bad data 0" });
        }
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        else {
            res.send(user.groupIDs);
        }
    });
};
// Gets a specific user (LOGIN)
exports.showUser = (req, res) => {
    console.log('\nGet a specific user');
    user_1.default.findOne({ username: req.body.username }, function (err, user) {
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
exports.addUser = (req, res, next) => {
    console.log("\nRegister new user");
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const profilePicture = req.body.profilePicture;
    const bio = req.body.bio;
    var groupIDs = req.body.groupIDs;
    const requests = req.body.requests;
    // Check if ID is present
    if (!username) {
        return res.status(422).send({ error: 'No username passed to register against.' });
    }
    if (!password) {
        return res.status(422).send({ error: 'No password passed to register against.' });
    }
    // Check if firstName and lastName exist
    if (!firstName || !lastName) {
        return res.status(422).send({ error: 'You must enter your full name.' });
    }
    if (!groupIDs) {
        groupIDs = [];
    }
    let hash = bcrypt_nodejs_1.default.hashSync(password); // Use hashSync with default saltRounds
    user_1.default.findOne({ username: username }, function (err, existingUser) {
        if (err) {
            return res.status(422).send({ error: 'There was an error finding user :(' });
        }
        if (existingUser) {
            // User already exists...
            return res.status(422).send({ error: 'This username is already taken.' });
        }
        else {
            var user = new user_1.default({
                username: username,
                password: hash,
                firstName: firstName,
                lastName: lastName,
                profilePicture: profilePicture,
                bio: bio,
                groupIDs: groupIDs,
                requests: requests
            });
            user.save(function (err, user) {
                if (err) {
                    return (err);
                }
                const userInfo = user.toJSON();
                let userToken = JSON.parse(JSON.stringify(userInfo));
                delete userToken.profilePicture;
                res.status(201).json({
                    token: 'Bearer ' + generateToken(userToken),
                    user: userInfo
                });
            });
        }
    });
};
// Update a user
exports.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nTrying to update a user");
    const headerJSON = passport_1.parseUserFromHeader(req.headers.authorization);
    // If the _id is only gotten from the header, then they must be accessing their own data
    /*// Check if the user is accessing their own data
    if(!compareHeaderUserID(headerJSON._id, req.headers.authorization)){ // req.body._id
        return res.status(422).send({ error: 'You attempted to access data that is not yours' });
    }*/
    var username = req.body.username;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var profilePicture = req.body.profilePicture;
    var bio = req.body.bio;
    var groupIDs = req.body.groupIDs;
    var requests = req.body.requests;
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
    };
    // Get rid of attributes
    if (!username) {
        delete update.username;
    }
    if (!password) {
        delete update.password;
    }
    if (!firstName) {
        delete update.firstName;
    }
    if (!lastName) {
        delete update.lastName;
    }
    if (!profilePicture) {
        delete update.profilePicture;
    }
    if (!bio) {
        delete update.bio;
    }
    if (!groupIDs) {
        delete update.groupIDs;
    }
    if (!requests) {
        delete update.requests;
    }
    // If they're changing their password, make sure to ecrypt it
    if (password) {
        update.password = bcrypt_nodejs_1.default.hashSync(password);
        console.log(password);
    }
    //const user = await User.findById({_id:req.body._id}); // Wait for this response
    // Gotten rid of await
    user_1.default.updateOne({ _id: headerJSON._id }, update, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send('User has been updated');
        }
    });
});
exports.deleteUser = (req, res) => {
    console.log("\nTrying to delete a specific user");
    const user = user_1.default.deleteOne({ _id: req.body._id }, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send("User deleted from database");
        }
    });
};
// Actually deletes the first user in the database...
exports.deleteAll = (req, res) => {
    console.log("\nTrying to delete all users");
    const users = user_1.default.deleteOne((err, user) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(user);
        }
    });
};
//# sourceMappingURL=UserController.js.map