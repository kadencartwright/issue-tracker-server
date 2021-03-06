import { ObjectId, UpdateWriteOpResult } from 'mongodb';
import {Service} from 'typedi';
import CommentModel, {IComment, ICommentDocument} from "../models/CommentModel"
import { IUserSubset } from '../models/SubsetSchemas';

@Service()
export default class CommentService{
    createComment: (comment:IComment)=> Promise<ICommentDocument> = async function(comment:IComment){
        try{
            return await CommentModel.create(comment)
        }catch(e){
            throw e
        }
    }

    findCommentsByUser:(userId:IUserSubset['id'])=>Promise<Array<ICommentDocument>> = async function(userId:IUserSubset['id']){
        try{
            //return await CommentModel.find({author.id}).exec()
           return await CommentModel.find({"author.id":userId}).exec()
        }catch(e){
            throw e
        }
    }
    findCommentsByTicket:(ticketId:ObjectId)=>Promise<Array<ICommentDocument>> = async function(ticketId:ObjectId){
        try{
            //return await CommentModel.find({author.id}).exec()
           return await CommentModel.find({"ticketId": ticketId}).exec()
        }catch(e){
            throw e
        }
    }
    
    findCommentById:(id:ObjectId)=>Promise<ICommentDocument> = async function(id:ObjectId){
        try{
            return await CommentModel.findById(id).exec()
        }catch(e){
            throw e
        }
    }

    updateComment:(id:ObjectId, changes:Partial<ICommentDocument>) =>Promise<UpdateWriteOpResult['result']> = async function (id:ObjectId, changes:Partial<IComment>){
        try{
            return await CommentModel.updateOne({_id:id},changes).exec()
        }catch(e){
            throw e
        }
    }

    deleteComment:(id:ObjectId)=>Promise<ICommentDocument>= async function(id:ObjectId){
        try{
            if (id !=undefined){
                return await CommentModel.findByIdAndDelete(id).exec()
            }
        }catch(e){
            throw e
        }
    }
}
