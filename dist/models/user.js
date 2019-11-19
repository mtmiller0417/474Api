"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        reqiured: true
    },
    password: {
        type: String,
        reqiured: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    groupIDs: {
        type: [String],
        required: false
    }
});
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    if (this.password === '*') {
        cb(null, false);
        return;
    }
    bcrypt_nodejs_1.default.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            console.log('ERROR: ' + err);
            return cb(err);
        }
        return cb(null, isMatch);
    });
};
UserSchema.methods.toJson = function () {
    return {
        _id: this._id,
        username: this.username,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        profilePicture: this.profilePicture,
        bio: this.bio,
        groupIDs: this.groupIDs
    };
};
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
//# sourceMappingURL=user.js.map