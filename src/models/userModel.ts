import { Document, Model, model, Types, Schema, SchemaOptions } from "mongoose"
import { ObjectId } from "mongodb"
import bcrypt from "bcrypt"

//interface for the user itself.
export interface IUser{
    name: String
    email: String,
    password: String
}
//interface for the document
export interface IUserDocument extends IUser,Document{}

//interface for the model itself to give us type checking on the model
export interface IUserModel extends Model<IUserDocument> {}

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
    },
    timestamps:true
}
const UserSchema = new Schema<IUserDocument, IUserModel>({
    name:{type:String,required: true},
    email:{type:String,required: true , unique:true , set:toLower},
    password : {type:String,required: true,set:hashPassword}

   
},options)

//a schema for the other collections that use this document
export const UserSubsetSchema = new Schema({
    name: { type:"string", required:true },
    userId: { type:Types.ObjectId, ref:"User", required:true }
})
//the associated interface
export interface IUserSubset{
    name: String,
    userId: {type:ObjectId}
}

export default model<IUserDocument>("User",UserSchema)