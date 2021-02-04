import { Request,Response } from 'express';
import {Container} from 'typedi'
import {body, check,param,ValidationChain} from 'express-validator'
import TicketService from '../services/TicketService';
import { ITicket} from '../models/TicketModel';
import { ObjectId } from 'mongodb';

/**
 * the structure of this controller is such that any function that depends on validation of parameters should define BOTH 
 *      a handler function 
 *      and array of express-validator.ValidationChain functions
 */

const createTicketHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const ticket:ITicket = req.body
    const ticketService:TicketService = Container.get(TicketService)
    const ticketDoc:ITicket = await ticketService.createTicket(ticket)
    res.json(ticketDoc)
}
const createTicketValidator:Array<ValidationChain>=[
    check('email').exists().isEmail().normalizeEmail().trim(),
    check('name').exists().isAlphanumeric().trim(),
    check('password').exists().isLength({max:256,min:8}).trim().escape()
]
const getTicketHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    try{
        const ticketId:ObjectId = new ObjectId(req.params.id)
        const ticketService:TicketService = Container.get(TicketService)
        const ticket = await ticketService.findTicketById(ticketId)
        res.status(200).json(ticket)
    }catch(e){
        console.error(e)
        res.status(404).send()
    }
}
const getTicketValidator:Array<ValidationChain> = [
    param('id').exists().isMongoId()
]

const updateTicketHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const ticketId:ObjectId = req.body.ticketId

    const updates:Partial<ITicket> = {
    }
    req.body.assignedTo ? updates.assignedTo = req.body.name: null ;
    req.body.description ? updates.description = req.body.email: null ;
    req.body.title ? updates.title = req.body.password: null ;
    
    const ticketService:TicketService = Container.get(TicketService)
    try{
        await ticketService.updateTicket(ticketId,updates)
        res.status(204).send()
    }catch(e){
        console.log(e)
        res.status(404).send('Resource was not found')
    }
}

const updateTicketValidator:Array<ValidationChain>=[
    body('email').optional().isEmail().normalizeEmail().trim().optional(),
    body('name').optional().isAlphanumeric().trim(),
    body('password').optional().isLength({max:256,min:8}).trim().escape(),
    param('ticketId').exists().isMongoId(),
]

const deleteTicketHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const ticketId:ObjectId = new ObjectId(req.params.id)
    const ticketService:TicketService = Container.get(TicketService)
    try{
        await ticketService.deleteTicket(ticketId)
        res.status(200).send()
    }catch(e){
        console.error(e)
        res.status(404).send()
    }
}
const deleteTicketValidator:Array<ValidationChain>=[
    param('ticketId').exists().isMongoId()
]




export default {
    createTicket:{ handler:createTicketHandler , validator: createTicketValidator},
    updateTicket:{ handler:updateTicketHandler , validator: updateTicketValidator},
    deleteTicket: { handler:deleteTicketHandler, validator: deleteTicketValidator},
    getTicket: { handler: getTicketHandler, validator: getTicketValidator }
}
