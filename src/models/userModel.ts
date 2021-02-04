import { Document, Model, model, Types, Schema, SchemaOptions } from "mongoose"
import { ObjectId } from "mongodb"
import bcrypt from "bcrypt"
import { IProjectSubset, ProjectSubsetSchema } from "./ProjectModel"

//interface for the user itself.
export interface IUser extends Document{
    name: String
    email: String,
    password: String,
    projects:IUsersProjects
}
export interface IUsersProjects{
    develops: Array<IProjectSubset>,
    manages: Array<IProjectSubset>,
    owns: Array<IProjectSubset>
}


//interface for the model itself to give us type checking on the model
export interface IUserModel extends Model<IUser> {}

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
const UserSchema = new Schema<IUser, IUserModel>({
    name:{type:String,required: true},
    email:{type:String,required: true , unique:true , set:toLower},
    projects:{
        develops:[{ type:ProjectSubsetSchema, required:true}],
        manages:[{type:ProjectSubsetSchema, required:true}],
        owns:[{type:ProjectSubsetSchema, required:true}]
    },
    password : {type:String,required: true,set:hashPassword}

   
},options)

//a schema for the other collections that use this document
export const UserSubsetSchema = new Schema({
    name: { type:"string", required:true },
    id: { type:Types.ObjectId, ref:"User", required:true }
})
//the associated interface
export interface IUserSubset{
    name: String,
    id: {type:ObjectId}
}

export default model<IUser>("User",UserSchema)