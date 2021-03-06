import { Document, Model, model, Types, Schema, SchemaOptions } from "mongoose"
import { ObjectId } from "mongodb"
import UserModel from "./UserModel"
import {UserSubsetSchema,IUserSubset} from './SubsetSchemas'
import ProjectModel from "./ProjectModel"
//interface for the Ticket itself.
export interface ITicket{
    projectId: ObjectId
    title: String,
    assignedTo?: IUserSubset,
    description: String
}
export interface ITicketDocument extends ITicket,Document{}

//interface for the model itself to give us type checking on the model
export interface ITicketModel extends Model<ITicketDocument> {}

/**
 * SCHEMA DECLARATIONS
 */
const options:SchemaOptions = {
    timestamps:true
}
const TicketSchema = new Schema<ITicketDocument, ITicketModel>({
    projectId: {type: Types.ObjectId, ref:"Projects"},
    title: {type: String, required: true},
    assignedTo: {type:UserSubsetSchema, required:false},
    description: {type: String}
},options)


TicketSchema.pre('save', async function (){
    if(this.isModified('assignedTo')){
        let assignedTo:IUserSubset = this.get('assignedTo')
        if(!await UserModel.exists({_id:assignedTo.id})){
            throw new Error('Referenced User does not exist')
        }
    }
    if (this.isModified('projectId')){
        let projectId = this.get('projectId')
       if(!await ProjectModel.exists({_id:projectId})){
        throw new Error('Referenced Project does not exist') 
       }
    }

})

export default model<ITicketDocument>("Ticket",TicketSchema)