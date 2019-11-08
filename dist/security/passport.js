"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config/config");
const user_1 = __importDefault(require("../models/user"));
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
const JwtStrategy = passport_jwt_1.default.Strategy;
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.db
};
// Setting up JWT login strategy
const JWTLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    let id = new mongoose_1.default.Types.ObjectId(payload._id);
    user_1.default.findById(id, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        }
        else {
            done(null, false);
        }
    });
});
passport_1.default.use(JWTLogin);
exports.requireAuth = passport_1.default.authenticate('jwt', { session: false });
//# sourceMappingURL=passport.js.map