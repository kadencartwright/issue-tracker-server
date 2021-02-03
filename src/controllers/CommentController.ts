import { Request,Response } from 'express';
import {Container} from 'typedi'
import {body, check,param,ValidationChain} from 'express-validator'
import CommentService from '../services/CommentService';
import { IComment, ICommentDocument } from '../models/CommentModel';
import { ObjectId } from 'mongodb';
/**
 * the structure of this controller is such that any function that depends on validation of parameters should define BOTH 
 *      a handler function 
 *      and array of express-validator.ValidationChain functions
 */

const createCommentHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    try{
        const comment:IComment = req.body.comment
        const commentService:CommentService = Container.get(CommentService)
        const commentDoc:ICommentDocument = await commentService.createComment(comment)
        res.json(commentDoc)
    }catch(e){
        console.log(e)
        res.status(500).send('whoops, there was an error on our end. Try your request again.')
    }
}
const createCommentValidator:Array<ValidationChain>=[
    check('content').exists().isString().escape().trim(),
    check('author').exists(),
]

const updateCommentHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const commentId:ObjectId = req.body.commentId
    const updates:Partial<IComment> = {
        content:req.body.content
    }
    const commentService:CommentService = Container.get(CommentService)
    const commentDoc:ICommentDocument = await commentService.updateComment(commentId,updates)
    res.json(commentDoc)
}
const updateCommentValidator:Array<ValidationChain>=[
    //need custom sanitizer
    body('content').exists().isString().escape().trim(),
    param('id').exists().isMongoId()
]

const deleteCommentHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const commentId:ObjectId = req.body.commentId
    const commentService:CommentService = Container.get(CommentService)
    try{
        await commentService.deleteComment(commentId)
        res.status(200).send()
    }catch(e){
        console.error(e)
        res.status(404).send()
    }
}
const deleteCommentValidator:Array<ValidationChain>=[
    check('commentId').exists().isMongoId()
]

const getCommentHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    try{
        const commentId:ObjectId = new ObjectId(req.params.id)
        const commentService:CommentService = Container.get(CommentService)
        const comment = await commentService.findCommentById(commentId)
        res.status(200).json(comment)
    }catch(e){
        console.error(e)
        res.status(404).send()
    }
}
const getCommentValidator:Array<ValidationChain>=[
    param('id').exists().isMongoId()
]


export default {
    createComment:{ handler:createCommentHandler , validator: createCommentValidator},
    updateComment:{ handler:updateCommentHandler , validator: updateCommentValidator},
    deleteComment: { handler:deleteCommentHandler, validator: deleteCommentValidator},
    getComment: { handler: getCommentHandler, validator: getCommentValidator} 
}