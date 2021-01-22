import { Document, Model, model, Types, Schema, Query, SchemaOptions } from "mongoose"
import * as bcrypt from "bcrypt"
//interface for the user itself.
export interface IUser{
    name: {
        first:String,
        last:String
    }
    email: String,
    password: String
}
//interface with the additional fields to be stored in mongoDB
export interface IUserDocument extends IUser,Document{
    created:Date,
    updated:Date
}
//interface for the model itself to give us type checking on the model
export interface IUserModel extends Model<IUserDocument> {
    
}

/**
 * SETTER FUNCTIONS FOR THE SCHEMA
 */
const toLower:(s:String) => String =  function(s:String){
    return s.toLowerCase()
}
const hashPassword:(s:String)=>String = function(s:String){
    return bcrypt.hashSync(s,10)
}

/**
 * SCHEMA DECLARATIONS
 */
const options:SchemaOptions = {
    toObject: {
        virtuals:true
    },
    toJSON: {
        virtuals:true
    }
}
const UserSchema = new Schema<IUserDocument, IUserModel>({
    name:{
        first: {type:String,required: true, set:toLower},
        last: {type:String,required: true, set:toLower}
    },
    email:{type:String,required: true , unique:true , set:toLower},
    password : {type:String,required: true,set:hashPassword}
   
},options)


/**
 * SCHEMA VIRTUALS
 * computed virtual properties on a document instance
 */
let virtualFullName = UserSchema.virtual("fullName")
virtualFullName.get(function(){
    return `${this.name.first} ${this.name.last}`
})

virtualFullName.set(function(fullName){
    [this.name.first,this.name.last] = fullName.split(' ')
})

/**
 * SCHEMA METHODS
 * methods to run on a document instance
 */

export default model<IUserDocument>("User",UserSchema)