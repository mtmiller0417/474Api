import passport from 'passport';
import passport_jwt from 'passport-jwt';
import mongoose from 'mongoose';
import { db } from '../config/config';
import User from '../models/user';
import { secret } from '../config/config'
import atob from 'atob';
import Group from '../models/group';

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
    console.log("compareHeaderUserID");
    const jsonHeader = parseUserFromHeader(authorization_header);
    var header_id = jsonHeader._id;

    //console.log("user_id  : " + user_id)
    //console.log("header_id: " + header_id)

    // compares strings, 0 if equal, not otherwise
    const val = user_id.localeCompare(header_id) 
    //console.log(val)
    
    if(val == 0){
        return true;
    } else {
        return false;
    }
};

export const checkUserInGroup = async (group_id: any, authorization_header:any) => {

    // Get the user_id from the token header
    const user_id = parseUserFromHeader(authorization_header)._id;

    const group: any = await Group.findById({_id:group_id});
    if (group == null)
        return false;

    // Get the list of groups that the user belongs to
    const user: any = await User.findById({_id:user_id}); // Wait for this response
    if(user == null){ // User does not exist
        return false;
    }

    if(!group.members){
        return false;
    }
    else{
        return group.members.includes(user.username);
    }

    /*
    const user_group_ids: [any] = user.groupIDs;

    // Return whether the passed in group_id is in the list the user belongs to
    if(!user_group_ids){
        return false;
    }
    else{
        return user_group_ids.includes(group_id);
    }
    */
};
