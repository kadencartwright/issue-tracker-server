import { ObjectId } from 'mongodb';
import {Service} from 'typedi';
import CommentModel, {IComment, ICommentDocument} from "../models/CommentModel"

@Service()
export default class CommentService{
    constructor(){}

    createComment: (comment:IComment)=> Promise<ICommentDocument> = async function(comment:IComment){
        try{
            return await CommentModel.create(comment)
        }catch(e){
            throw e
        }
    }

    findComments:(comment:Partial<IComment>)=>Promise<Array<ICommentDocument>> = async function(comment:Partial<IComment>){
        try{
            return await CommentModel.find({...comment}).exec()
        }catch(e){
            throw e
        }
    }

    findCommentById:(id:ObjectId)=>Promise<Array<ICommentDocument>> = async function(id:ObjectId){
        try{
            return await CommentModel.findById(id).exec()
        }catch(e){
            throw e
        }
    }

    updateComment:(id:ObjectId, changes:Partial<IComment>) =>Promise<ICommentDocument> = async function (id:ObjectId, changes:Partial<IComment>){
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