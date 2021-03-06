import { DeleteWriteOpResultObject, ObjectId, UpdateWriteOpResult } from 'mongodb';
import Container, {Service} from 'typedi';
import TicketModel, {ITicket, ITicketDocument} from "../models/TicketModel"
import {IUserSubset} from '../models/SubsetSchemas'

@Service()
export default class TicketService{
    createTicket: (ticket:ITicket)=> Promise<ITicketDocument> = async function(ticket:ITicket){
        try{
            return await TicketModel.create(ticket)
        }catch(e){
            throw e
        }
    }

    findTickets:(ticketPartial:Partial<ITicket>)=>Promise<ITicketDocument[]> = async function(ticketPartial:Partial<ITicket>){
        try{
            return await TicketModel.find(ticketPartial).exec()
        }catch(e){
            throw e
        }
    }

    findTicketById:(id:ObjectId)=>Promise<ITicketDocument> = async function(id:ObjectId){
        try{
            return await TicketModel.findById(id).exec()
        }catch(e){
            throw e
        }
    }
    findTicketsByUser:(userId)=>Promise<ITicketDocument[]> = async function(userId:IUserSubset['id']){
        try{
            //return await CommentModel.find({author.id}).exec()
           return await TicketModel.find({"assignedTo.id":userId}).exec()
        }catch(e){
            throw e
        }
    }
    findTicketsByProject:(projectId:ObjectId)=>Promise<ITicketDocument[]> = async function(projectId:ObjectId){
        try{
            //return await CommentModel.find({author.id}).exec()
           return await TicketModel.find({projectId: projectId}).exec()
        }catch(e){
            throw e
        }
    }

    updateTicket:(id:ObjectId, changes:Partial<ITicket>) =>Promise<UpdateWriteOpResult['result']> = async function (id:ObjectId, changes:Partial<ITicket>){
        try{
            return await TicketModel.findByIdAndUpdate(id,changes,{useFindAndModify:false}).exec()
        }catch(e){
            throw e
        }
    }

    deleteTicket:(id:ObjectId)=>Promise<DeleteWriteOpResultObject['result']> = async function(id:ObjectId){
        try{
            if (id !=undefined){
                let res:DeleteWriteOpResultObject['result'] = await TicketModel.deleteMany({_id:id}).exec()
                return res
            }
        }catch(e){
            throw e
        }
    }

}
