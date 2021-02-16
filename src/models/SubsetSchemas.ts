import {Schema,Types} from 'mongoose'

export const UserSubsetSchema = new Schema({
    name: { type:"string", required:true },
    id: { type:Types.ObjectId, ref:"User", required:true }
})
export const ProjectSubsetSchema = new Schema({
    name: { type:"string", required:true },
    id: { type:Types.ObjectId, ref:"Project", required:true }
})
