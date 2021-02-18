import { Document, Model, model, Types, Schema, SchemaOptions } from "mongoose"
import { ObjectId } from "mongodb"
import bcrypt from "bcrypt"
import { IProjectSubset } from "./ProjectModel"
import {ProjectSubsetSchema} from './SubsetSchemas'

//interface for the user itself.
export interface IUser{
    name: String
    email: String,
    password: String,
    projects?:IUsersProjects
}
export interface IUserDocument extends IUser, Document{
    getSubset: ()=>IUserSubset

}
export interface IUsersProjects{
    develops: Array<IProjectSubset>,
    manages: Array<IProjectSubset>,
    owns: Array<IProjectSubset>
}


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
    projects:{
        develops:[{ type:ProjectSubsetSchema, required:true}],
        manages:[{type:ProjectSubsetSchema, required:true}],
        owns:[{type:ProjectSubsetSchema, required:true}]
    },
    password : {type:String,required: true,set:hashPassword}

   
},options)

/**
 * DOCUMENT METHODS
 */

//method declarations
const getSubset: (this:IUserDocument)=>IUserSubset = function(this:IUserDocument){
    const subset:IUserSubset = {
        name: this.name,
        id: this._id
    }
    return subset
}
//attach methods to schema below
UserSchema.method('getSubset',getSubset)




//the associated subset interface
export interface IUserSubset{
    name: String,
    id: {type:ObjectId}
}

export default model<IUserDocument>("User",UserSchema)