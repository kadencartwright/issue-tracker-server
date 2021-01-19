import {Schema} from 'mongoose'



const UserSchema:Schema = new Schema({
    email: { type:String, required:true, unique:true},
    firstName: { type:String, required:true},
    lastName: { type:String, required:true},
    created: { type:Date, default: new Date()},
    updated: { type:Date, default: new Date()}
});


export default UserSchema;