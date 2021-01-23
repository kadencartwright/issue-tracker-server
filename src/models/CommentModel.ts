import { Document, Model, model, Schema, SchemaOptions ,Types} from "mongoose"
import {IUserDocument } from "./UserModel"
//interface for the Comment itself.
export interface IComment{
    content:String,
    author: IUserDocument["_id"]
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
    author:{type: Types._ObjectId, required:true}
   
}, options)


/**
 * SCHEMA VIRTUALS
 * computed virtual properties on a document instance
 */


/**
 * SCHEMA METHODS
 * methods to run on a document instance
 */

export default model<ICommentDocument>("Comment",CommentSchema)