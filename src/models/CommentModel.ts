import { ObjectId } from "mongodb"
import { Document, Model, model, Schema, SchemaOptions ,Types} from "mongoose"
import { UserSubsetSchema, IUserSubset } from "./UserModel"
//interface for the Comment itself.
export interface IComment{
    ticketId: ObjectId
    content:String,
    author: IUserSubset,
    parent?: ObjectId,
    children?: Array<ObjectId>
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
    ticketId: {type: Types._ObjectId, ref:"Ticket", required:true },
    content:{type:String, required:true},
    author: UserSubsetSchema,
    parent: {type: Types._ObjectId, ref:"User" },
    children: [{type: Types._ObjectId, ref:"User" }]
}, options)

export default model<ICommentDocument>("Comment",CommentSchema)