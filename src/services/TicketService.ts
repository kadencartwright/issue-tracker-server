import { ObjectId } from 'mongodb';
import Container, {Service} from 'typedi';
import TicketModel, {ITicket, ITicketDocument} from "../models/TicketModel"

@Service()
export default class TicketService{
    createTicket: (ticket:ITicket)=> Promise<ITicketDocument> = async function(ticket:ITicket){
        try{
            return await TicketModel.create(ticket)
        }catch(e){
            throw e
        }
    }

    findTickets:(ticketPartial:Partial<ITicket>)=>Promise<Array<ITicketDocument>> = async function(ticketPartial:Partial<ITicket>){
        try{
            return await TicketModel.find({...ticketPartial}).exec()
        }catch(e){
            throw e
        }
    }

    findTicketById:(id:ObjectId)=>Promise<Array<ITicketDocument>> = async function(id:ObjectId){
        try{
            return await TicketModel.findById(id).exec()
        }catch(e){
            throw e
        }
    }

    updateTicket:(id:ObjectId, changes:Partial<ITicket>) =>Promise<ITicketDocument> = async function (id:ObjectId, changes:Partial<ITicket>){
        try{
            return await TicketModel.findByIdAndUpdate(id,changes).exec()
        }catch(e){
            throw e
        }
    }

    deleteTicket:(id:ObjectId)=>void = async function(id:ObjectId){
        try{
            if (id !=undefined){
                return await TicketModel.deleteOne({_Id:id}).exec()
            }
        }catch(e){
            throw e
        }
    }

}
