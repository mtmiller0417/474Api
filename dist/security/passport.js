"use strict";
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
    const jsonHeader = exports.parseUserFromHeader(authorization_header);
    var header_id = jsonHeader._id;
    if (user_id == header_id) {
        return true;
    }
    else {
        return false;
    }
};
//# sourceMappingURL=passport.js.map