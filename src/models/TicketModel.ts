import { Document, Model, model, Types, Schema, SchemaOptions } from "mongoose"
import { ObjectId } from "mongodb"
import { IUserSubset, UserSubsetSchema } from "./UserModel"
//interface for the Ticket itself.
export interface ITicket extends Document{
    projectId: ObjectId
    title: String,
    assignedTo: IUserSubset,
    description: String
}

//interface for the model itself to give us type checking on the model
export interface ITicketModel extends Model<ITicket> {}

/**
 * SCHEMA DECLARATIONS
 */
const options:SchemaOptions = {
    timestamps:true
}
const TicketSchema = new Schema<ITicket, ITicketModel>({
    projectId: {type: Types.ObjectId, ref:"Projects"},
    title: {type: String, required: true},
    assignedTo: UserSubsetSchema,
    description: {type: String}
},options)


export default model<ITicket>("Ticket",TicketSchema)