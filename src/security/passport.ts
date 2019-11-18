import passport from 'passport';
import passport_jwt from 'passport-jwt';
import mongoose from 'mongoose';
import { db } from '../config/config';
import User from '../models/user';
import { secret } from '../config/config'
import atob from 'atob';

const ExtractJwt = passport_jwt.ExtractJwt
const JwtStrategy = passport_jwt.Strategy

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};

// Setting up JWT login strategy
const JWTLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    //console.log(payload)
    let id = new mongoose.Types.ObjectId(payload._id);
    User.findById(id, function (err, user) {
        //console.log(user)
        if (err) { return done(err, false); }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
});

passport.use(JWTLogin)
export const requireAuth = passport.authenticate('jwt', {session: false});

export const parseUserFromHeader = (authorization_header: any) => {
    const start_pos = authorization_header.indexOf('.');
    const end_pos = authorization_header.indexOf('.', start_pos+1);
    // Get the substring of the base64 user
    const str = authorization_header.substring(start_pos+1, end_pos);
    // Convert the base64 to a string
    var strJson = atob(str);
    return JSON.parse(strJson);
};

export const compareHeaderUserID = (user_id:any, authorization_header:any) => {
    const jsonHeader = parseUserFromHeader(authorization_header);
    var header_id = jsonHeader._id;
    
    if(user_id == header_id){
        return true;
    } else {
        return false;
    }

};
