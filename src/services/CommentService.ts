import { ObjectId } from 'mongodb';
import {FilterQuery} from 'mongoose'
import Container, {Service} from 'typedi';
import CommentModel, {IComment} from "../models/CommentModel"
import { IUserSubset } from '../models/UserModel';

@Service()
export default class CommentService{
    createComment: (comment:IComment)=> Promise<IComment> = async function(comment:IComment){
        try{
            return await CommentModel.create(comment)
        }catch(e){
            throw e
        }
    }

    findCommentsByUser:(userId:IUserSubset['id'])=>Promise<Array<IComment>> = async function(userId:IUserSubset['id']){
        try{
            //return await CommentModel.find({author.id}).exec()
           return await CommentModel.find({"author.id":userId}).exec()
        }catch(e){
            throw e
        }
    }
    findCommentsByTicket:(ticketId:ObjectId)=>Promise<Array<IComment>> = async function(ticketId:ObjectId){
        try{
            //return await CommentModel.find({author.id}).exec()
           return await CommentModel.find({"ticketId": ticketId}).exec()
        }catch(e){
            throw e
        }
    }
    

    findCommentById:(id:ObjectId)=>Promise<IComment> = async function(id:ObjectId){
        try{
            return await CommentModel.findById(id).exec()
        }catch(e){
            throw e
        }
    }


    updateComment:(id:ObjectId, changes:Partial<IComment>) =>Promise<IComment> = async function (id:ObjectId, changes:Partial<IComment>){
        try{
            return await CommentModel.findByIdAndUpdate(id,changes).exec()
        }catch(e){
            throw e
        }
    }

    deleteComment:(id:ObjectId)=>void = async function(id:ObjectId){
        try{
            if (id !=undefined){
                return await CommentModel.deleteOne({_Id:id}).exec()
            }
        }catch(e){
            throw e
        }
    }

}
