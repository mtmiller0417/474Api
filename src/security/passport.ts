import passport from 'passport';
import jwt from 'passport-jwt';
import mongoose from 'mongoose';
import { db } from '../config/config';
import User from '../models/user';

const ExtractJwt = jwt.ExtractJwt
const JwtStrategy = jwt.Strategy

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: db
};

// Setting up JWT login strategy
const JWTLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    let id = new mongoose.Types.ObjectId(payload._id);
    User.findById(id, function (err, user) {
        if (err) { return done(err, false); }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

passport.use(JWTLogin)
export const requireAuth = passport.authenticate('jwt', {session: false});