import {ObjectId, Schema,Types} from 'mongoose'

export const UserSubsetSchema = new Schema({
    name: { type:"string", required:true },
    id: { type:Types.ObjectId, ref:"User", required:true }
},{_id:false,id:false})
//the associated subset interface
export interface IUserSubset{
    name: String,
    id: Types.ObjectId
}
export const ProjectSubsetSchema = new Schema({
    name: { type:"string", required:true },
    id: { type:Types.ObjectId, ref:"Project", required:true }
},{_id:false,id:false})
//the associated subset interface
export interface IProjectSubset{
    name: String,
    id: Types.ObjectId
}
