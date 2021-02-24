import { Request,Response } from 'express';
import {Container} from 'typedi'
import {body, check,param,ValidationChain} from 'express-validator'
import CommentService from '../services/CommentService';
import CommentModel, { IComment, ICommentDocument} from '../models/CommentModel';
import { ObjectId } from 'mongodb';
import UserModel, { IUserDocument } from '../models/UserModel';
import TicketModel from '../models/TicketModel';
/**
 * the structure of this controller is such that any function that depends on validation of parameters should define BOTH 
 *      a handler function 
 *      and array of express-validator.ValidationChain functions
 */

const createCommentHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const commentService:CommentService = Container.get(CommentService)
    let author:IUserDocument 
    let comment:IComment

    try{
        author = await UserModel.findById(req.body.authorId).exec()
        comment = {
            ticketId: req.body.ticketId,
            content: req.body.content,
            author: author.getSubset()
        }
        if (!!req.body.parent){
            comment.parent = req.body.parent
        }
        const commentDoc:ICommentDocument = await commentService.createComment(comment)
        res.json({
            message:'Comment created',
            id: commentDoc.id
        })
    }catch(e){
        res.status(400).send({error: `Invalid ticket or author ID param`})
    }

}
const createCommentValidator:Array<ValidationChain>=[
    check('content').exists().isString().escape().trim(),
    check('authorId').exists().isMongoId(),
    check('ticketId').exists().isMongoId(),
    check('parent').isMongoId()
]

const updateCommentHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const commentId:ObjectId = req.body.commentId
    const updates:Partial<IComment> = {
        content:req.body.content
    }
    const commentService:CommentService = Container.get(CommentService)
    const commentDoc:IComment = await commentService.updateComment(commentId,updates)
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
        if (!comment){ throw new Error('no comment found for this ID')}
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