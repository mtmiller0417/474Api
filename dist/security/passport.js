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
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const config_1 = require("../config/config");
const atob_1 = __importDefault(require("atob"));
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
const JwtStrategy = passport_jwt_1.default.Strategy;
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.secret
};
// Setting up JWT login strategy
const JWTLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    //console.log(payload)
    let id = new mongoose_1.default.Types.ObjectId(payload._id);
    user_1.default.findById(id, function (err, user) {
        //console.log(user)
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    });
});
passport_1.default.use(JWTLogin);
exports.requireAuth = passport_1.default.authenticate('jwt', { session: false });
exports.parseUserFromHeader = (authorization_header) => {
    const start_pos = authorization_header.indexOf('.');
    const end_pos = authorization_header.indexOf('.', start_pos + 1);
    // Get the substring of the base64 user
    const str = authorization_header.substring(start_pos + 1, end_pos);
    // Convert the base64 to a string
    var strJson = atob_1.default(str);
    return JSON.parse(strJson);
};
exports.compareHeaderUserID = (user_id, authorization_header) => {
    console.log("compareHeaderUserID");
    const jsonHeader = exports.parseUserFromHeader(authorization_header);
    var header_id = jsonHeader._id;
    //console.log("user_id  : " + user_id)
    //console.log("header_id: " + header_id)
    // compares strings, 0 if equal, not otherwise
    const val = user_id.localeCompare(header_id);
    //console.log(val)
    if (val == 0) {
        return true;
    }
    else {
        return false;
    }
};
exports.checkUserInGroup = (group_id, authorization_header) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the user_id from the token header
    const user_id = exports.parseUserFromHeader(authorization_header)._id;
    // Get the list of groups that the user belongs to
    const user = yield user_1.default.findById({ _id: user_id }); // Wait for this response
    if (user == null) { // User does not exist
        return false;
    }
    const user_group_ids = user.groupIDs;
    // Return whether the passed in group_id is in the list the user belongs to
    if (!user_group_ids) {
        return false;
    }
    else {
        return user_group_ids.includes(group_id);
    }
});
//# sourceMappingURL=passport.js.map