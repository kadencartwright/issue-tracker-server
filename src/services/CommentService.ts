import { ObjectId } from 'mongodb';
import Container, {Service} from 'typedi';
import CommentModel, {IComment} from "../models/CommentModel"

@Service()
export default class CommentService{
    createComment: (comment:IComment)=> Promise<IComment> = async function(comment:IComment){
        try{
            return await CommentModel.create(comment)
        }catch(e){
            throw e
        }
    }

    findComments:(commentPartial:Partial<IComment>)=>Promise<Array<IComment>> = async function(commentPartial:Partial<IComment>){
        try{
            //TODO FIX THIS
            return await CommentModel.find({}).exec()
        }catch(e){
            throw e
        }
    }

    findCommentById:(id:ObjectId)=>Promise<Array<IComment>> = async function(id:ObjectId){
        try{
            return await CommentModel.findById(id).exec()
        }catch(e){
            throw e
        }
    }
    //TODO add find comments by user id or user obj

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
