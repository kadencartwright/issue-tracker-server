import { Request,Response } from 'express';
import {Container} from 'typedi'
import {body, check,param,ValidationChain, validationResult} from 'express-validator'
import TicketService from '../services/TicketService';
import { ITicket} from '../models/TicketModel';
import { DeleteWriteOpResultObject, ObjectId } from 'mongodb';
import UserModel, { IUser, IUserDocument, IUserModel } from '../models/UserModel';

/**
 * the structure of this controller is such that any function that depends on validation of parameters should define BOTH 
 *      a handler function 
 *      and array of express-validator.ValidationChain functions
 */

const createTicketHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const err = validationResult(req)
    if (err.isEmpty()){
        try{
            let ticket:ITicket = {
                title:req.body.title,
                projectId: req.body.projectId,
                description:req.body.description,
            }
            if ('assignedTo' in req.body){
                let user:IUserDocument = await UserModel.findById(req.body.assignedTo)
                ticket.assignedTo = user.getSubset()
            }
            const ticketService:TicketService = Container.get(TicketService)
            const ticketDoc:ITicket = await ticketService.createTicket(ticket)
            res.status(200).json(ticketDoc)
        }catch(e){
            //console.error(e)
            res.status(404).json({error:'one of the object refs did not exist'})
        }

    }else{
        res.status(400).json(err.mapped())
    }

}
const createTicketValidator:Array<ValidationChain>=[
    body('projectId').exists().isMongoId(),
    body('title').exists().isString().trim().notEmpty({ignore_whitespace:true}),
    body('description').exists().trim().escape(),
    body('assignedTo').optional().isMongoId()
]
const getTicketHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const err = validationResult(req)
    if(err.isEmpty()){
        try{
            const ticketId:ObjectId = new ObjectId(req.params.id)
            const ticketService:TicketService = Container.get(TicketService)
            const ticket = await ticketService.findTicketById(ticketId)
            if(!ticket){
                throw new Error('the referenced object does not exist')
            }
            res.status(200).json(ticket)
        }catch(e){
            //console.error(e)
            res.status(404).send()
        }
    }else{
        res.status(400).json(err.mapped())
    }
}
const getTicketValidator:Array<ValidationChain> = [
    param('id').exists().isMongoId()
]

const updateTicketHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const err = validationResult(req)
    if(err.isEmpty()){
        const ticketId:ObjectId = new ObjectId(req.params.id)

        const updates:Partial<ITicket> = {}
        if('assignedTo' in req.body){
            updates.assignedTo = ( await UserModel.findById(req.body.assignedTo)).getSubset()
        }
        if ('description' in req.body){
            updates.description = req.body.description
        }
        if('title' in req.body){
            updates.title = req.body.title
        }
        
        const ticketService:TicketService = Container.get(TicketService)
        try{
            if(Object.keys(updates).length == 0){throw new Error('No Updates recieved')}

            let updateStatus = await ticketService.updateTicket(ticketId,updates)
            if (updateStatus.nModified == 0 || updateStatus == null){
                throw new Error('No document modified')
            }
            res.status(204).send()
        }catch(e){
            //console.error(e)
            res.status(404).json({error:'Resource was not found'})
        }
    }else{
        res.status(400).json(err.mapped())
    }
}

const updateTicketValidator:Array<ValidationChain>=[
    body('title').optional().trim().escape().notEmpty({ignore_whitespace:true}),
    body('description').optional().trim().escape().notEmpty({ignore_whitespace:true}),
    body('assignedTo').optional().isMongoId(),
    param('id').exists().isMongoId()

  
]

const deleteTicketHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const err = validationResult(req)
    if(err.isEmpty()){ 
        const ticketId:ObjectId = new ObjectId(req.params.id)
        const ticketService:TicketService = Container.get(TicketService)
        try{
            let result:DeleteWriteOpResultObject['result'] = await ticketService.deleteTicket(ticketId)
            if(result.n == 0 || result == undefined){ throw new Error('Delete failed')}
            res.status(204).json({message:'Deleted Ticket Successfully'})
        }catch(e){
            //console.error(e)
            res.status(404).send()
        }
    }else{
        res.status(400).json(err.mapped())
    }
}
const deleteTicketValidator:Array<ValidationChain>=[
    param('id').exists().isMongoId()
]




export default {
    createTicket:{ handler:createTicketHandler , validator: createTicketValidator},
    updateTicket:{ handler:updateTicketHandler , validator: updateTicketValidator},
    deleteTicket: { handler:deleteTicketHandler, validator: deleteTicketValidator},
    getTicket: { handler: getTicketHandler, validator: getTicketValidator }
}
