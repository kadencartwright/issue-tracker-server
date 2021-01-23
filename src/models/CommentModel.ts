import { ObjectId } from "mongodb"
import { Document, Model, model, Schema, SchemaOptions ,Types} from "mongoose"
import {IUserDocument, UserSubsetSchema, IUserSubset } from "./UserModel"
//interface for the Comment itself.
export interface IComment{
    content:String,
    author: IUserSubset,
    parents: Array<ObjectId>,
    children: Array<ObjectId>
}
//interface for the document
export interface ICommentDocument extends IComment,Document{}

//interface for the model itself to give us type checking on the model
export interface ICommentModel extends Model<ICommentDocument> {}

/**
 * SCHEMA DECLARATIONS
 */
const options:SchemaOptions = {
    timestamps:true
}

const CommentSchema = new Schema<ICommentDocument, ICommentModel>({
    content:{type:String, required:true},
    author: UserSubsetSchema,
    parents: [{type: Types._ObjectId, ref:"User" }],
    children: [{type: Types._ObjectId, ref:"User" }]
}, options)

export default model<ICommentDocument>("Comment",CommentSchema)