import dotenv from 'dotenv'
import {Container} from 'typedi'
import TicketService from '../../services/TicketService'
import fs from 'fs'
import  TicketModel, { ITicket, ITicketDocument, ITicketModel} from '../../models/TicketModel'
import { connectDB } from '../../database'
import { ObjectId } from 'mongodb'
import UserModel from '../../models/UserModel'
describe('TicketService tests', ()=>{

    let testTicket:ITicket
    let testTicketDoc:ITicketDocument
    let ticketService = Container.get(TicketService)
    dotenv.config()
    let data = JSON.parse(fs.readFileSync('testData.json').toString())
    
    beforeAll(async()=>{
        testTicket = data.tickets[0]
        await connectDB(process.env.MONGO_STRING_TEST)
    })
    describe('createTicket() tests', ()=>{

        test('should create the ticket',async ()=>{
            testTicketDoc = await ticketService.createTicket(testTicket)
            expect(testTicketDoc).toBeTruthy()
        })
        test('should throw error if input is undefined',async ()=>{
            let error
            try{
                await ticketService.createTicket(null)
            }catch(e){
                error = e
            }
            expect(error).toBeTruthy();
        })
    })
    describe('findTicketsByUser() tests', ()=>{
        test('should find a users tickets with valid ID',async()=>{
            let  tickets: ITicketDocument[]
            let user = await UserModel.findOne({})
            try{
                user = await UserModel.findOne({});
                tickets = await ticketService.findTicketsByUser(user.id)
            }catch(e){console.log(e)}
            expect(tickets).toBeTruthy()
        })
    })
    describe('findTicketById() tests',()=>{
        test('should find ticket by valid ID', async()=>{
            let ticket:ITicketDocument
            let ticketToFind:ITicketDocument
            try{   
                ticketToFind = await TicketModel.findOne({})
                ticket = await ticketService.findTicketById(ticketToFind.id)
            }catch(e){
                console.log(e)
            }
            expect(ticket).toBeTruthy();
        })
    })

    describe('updateTicket() tests',()=>{
        test('should update ticket by valid ID',async()=>{
            let ticket: ITicketDocument
            let testString:String = 'test string'
            try{
                await ticketService.updateTicket(testTicketDoc.id,{title:testString})
                ticket = await ticketService.findTicketById(testTicketDoc.id)
            }catch(e){
                console.log(e)
            }
            expect(ticket.title).toEqual(testString)
        })
    })
    describe('deleteTicket function Tests', ()=>{
        let result
        test('should delete the ticket',async ()=>{
            result = await ticketService.deleteTicket(testTicketDoc.id)
            expect(result).toBeTruthy()
        })
    
        test('should return error if the ticket does not exist',async ()=>{
            let err = {}
            try{
                result = await ticketService.deleteTicket(new ObjectId('1234567890'))
            }catch(e){
                err = e
            }
            expect(err).toBeTruthy()
        })
        test('should return error if the ticket id is null',async ()=>{
            let err = {}
            try{
                result = await ticketService.deleteTicket(null)
            }catch(e){
                err = e
            }
            expect(err).toBeTruthy()
        })
    })
})