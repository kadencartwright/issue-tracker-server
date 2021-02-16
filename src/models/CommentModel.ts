import { ObjectId } from "mongodb"
import { Document, Model, model, Schema, SchemaOptions ,Types} from "mongoose"
import { IUserSubset } from "./UserModel"
import {UserSubsetSchema} from './SubsetSchemas'
//interface for the Comment itself.
export interface IComment{
    ticketId: ObjectId
    content:String,
    author: IUserSubset,
    parent?: ObjectId,
    children?: Array<ObjectId>

}
export interface ICommentDocument extends IComment,Document{

}

//interface for the model itself to give us type checking on the model
export interface ICommentModel extends Model<ICommentDocument> {}

/**
 * SCHEMA DECLARATIONS
 */
const options:SchemaOptions = {
    timestamps:true
}

const CommentSchema = new Schema<ICommentDocument, ICommentModel>({
    ticketId: {type: Types.ObjectId, ref:"Ticket", required:true },
    content:{type:String, required:true},
    author: UserSubsetSchema,
    parent: {type: Types.ObjectId, ref:"User" },
    children: [{type: Types.ObjectId, ref:"User" }]
}, options)

export default model<ICommentDocument>("Comment",CommentSchema)