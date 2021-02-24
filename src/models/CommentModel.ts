import { ObjectId } from "mongodb"
import { Document, Model, model, Schema, SchemaOptions ,Types} from "mongoose"
import UserModel, { IUserSubset } from "./UserModel"
import {UserSubsetSchema} from './SubsetSchemas'
import TicketModel from "./TicketModel"
import { userInfo } from "os"
//interface for the Comment itself.
export interface IComment{
    ticketId: ObjectId
    content:String,
    author: IUserSubset,
    parent?: ObjectId,

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
}, options)



/**
 * MIDDLEWARES
 */

CommentSchema.pre('save', async function (){
    let exists = true
    let authorId = this.get('author.id')
    let ticketId = this.get('ticketId')
    if(this.isModified('author')){
        exists = exists && await UserModel.exists({_id:authorId})
    }
    if (this.isModified('ticketId')){
        exists = exists && await TicketModel.exists({_id:ticketId})
    }
    
    if(!exists){
        throw new Error('referenced author does not exist')
    }
})
export default model<ICommentDocument>("Comment",CommentSchema)