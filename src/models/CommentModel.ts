import { ObjectId } from "mongodb"
import { Document, Model, model, Schema, SchemaOptions ,Types} from "mongoose"
import { UserSubsetSchema, IUserSubset } from "./UserModel"
//interface for the Comment itself.
export interface IComment extends Document{
    ticketId: ObjectId
    content:String,
    author: IUserSubset,
    parent?: ObjectId,
    children?: Array<ObjectId>
}

//interface for the model itself to give us type checking on the model
export interface ICommentModel extends Model<IComment> {}

/**
 * SCHEMA DECLARATIONS
 */
const options:SchemaOptions = {
    timestamps:true
}

const CommentSchema = new Schema<IComment, ICommentModel>({
    ticketId: {type: Types.ObjectId, ref:"Ticket", required:true },
    content:{type:String, required:true},
    author: UserSubsetSchema,
    parent: {type: Types.ObjectId, ref:"User" },
    children: [{type: Types.ObjectId, ref:"User" }]
}, options)

export default model<IComment>("Comment",CommentSchema)