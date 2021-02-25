import e, { Request,Response } from 'express';
import {Container} from 'typedi'
import {body, check,param,ValidationChain, validationResult} from 'express-validator'
import CommentService from '../services/CommentService';
import CommentModel, { IComment, ICommentDocument} from '../models/CommentModel';
import { ObjectId, UpdateWriteOpResult } from 'mongodb';
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
    const err = validationResult(req)
    if (err.isEmpty()){

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
    }else{
        res.status(400).json(err.mapped())
    }

}
const createCommentValidator:Array<ValidationChain>=[
    check('content').exists().isString().escape().trim().notEmpty({ignore_whitespace:true}),
    check('authorId').exists().isMongoId(),
    check('ticketId').exists().isMongoId(),
    check('parent').optional().isMongoId()
]

const updateCommentHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const err = validationResult(req)
    if(err.isEmpty()){
        const commentId:ObjectId = new ObjectId(req.params.id)
        const updates:Partial<IComment> = {
            content:req.body.content
        }
        const commentService:CommentService = Container.get(CommentService)
        try{
            let updateStatus:UpdateWriteOpResult['result']= await commentService.updateComment(commentId,updates)
            
            if (updateStatus.nModified == 0){
                throw new Error('No document modified')
            }

            res.status(204).json({message:'updated comment successfully'})
        }catch(e){
            console.error(e)
            res.status(404).json({message:'the resource could not be found'})
        }
    }else{
        res.status(400).json(err.mapped())
    }
    
}
const updateCommentValidator:Array<ValidationChain>=[
    //need custom sanitizer
    body('content').exists().isString().notEmpty({ignore_whitespace:true}).escape().trim(),
    param('id').exists().isMongoId()
]

const deleteCommentHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const err = validationResult(req)
    if(err.isEmpty()){
        const commentId:ObjectId = new ObjectId(req.params.id)
        const commentService:CommentService = Container.get(CommentService)
        try{
            let deletedOne = await commentService.deleteComment(commentId)
            if (!deletedOne){
                throw new Error('Document not found')
            }

            res.status(204).send()
        }catch(e){
            console.error(e)
            res.status(404).json({error:'the comment you referenced does not exist'})
        }
    }else{
        res.status(400).json(err.mapped())

    }
}
const deleteCommentValidator:Array<ValidationChain>=[
    param('id').exists().isMongoId()
]

const getCommentHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const err = validationResult(req)
    if(err.isEmpty()){
        try{
            const commentId:ObjectId = new ObjectId(req.params.id)
            const commentService:CommentService = Container.get(CommentService)
            const comment = await commentService.findCommentById(commentId)
            if (!comment){ throw new Error('no comment found for this ID')}
            res.status(200).json(comment)
        }catch(e){
            console.error(e)
            res.status(404).json(err.mapped())
        }
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