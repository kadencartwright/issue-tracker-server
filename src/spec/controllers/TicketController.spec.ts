import supertest from 'supertest'
import app from '../../app'
import fs from 'fs'
import { connectDB } from '../../database'
import TicketModel, { ITicket, ITicketDocument } from '../../models/TicketModel'
import UserModel, {IUser, IUserDocument} from '../../models/UserModel'
import {ILogin} from '../../services/AuthService'
import  ProjectModel, {IProjectDocument } from '../../models/ProjectModel'
import { ObjectId } from 'mongodb'
describe('TicketController tests',()=>{
    let testData = JSON.parse(fs.readFileSync('testData.json').toString())
    const request = supertest(app)
    let testTicket:ITicketDocument 
    let token:String
    let title:String = 'this is a test ticket to rest the post tickets route someRanDomUniQueTexT1203848ljhsjflji34sljlsja0394uaj'
    let testProject:IProjectDocument
    let userDoc:IUserDocument

    beforeAll(async ()=>{
        await connectDB(process.env.MONGO_STRING_TEST)
        let user: IUser = testData.users[0];
        userDoc= await UserModel.findOne({email:user.email})
        testTicket = await TicketModel.findOne({}).exec()
        let login:ILogin = {
            email: user.email,
            password: user.password
        }
        token = (await request.post('/api/v1/login').send(login).set('Accept', 'application/json')).body.token
        testProject = await ProjectModel.findOne({}).exec()
    })

    describe('POST /tickets tests',()=>{

        test('Should post a ticket successfully',async ()=>{
            let ticket = {
                assignedTo: userDoc.id,
                title: title,
                projectId: testProject.id,
                description: title
            }
            let response:supertest.Response = (await request.post('/api/v1/tickets').send(ticket).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(200)
        })

    })
    

    describe('GET /tickets/:id tests', ()=>{
        
        test('Should get ticket successfully', async ()=>{
            let response:supertest.Response = (await request.get(`/api/v1/tickets/${testTicket.id}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(200)
        })
        
        test('Should return 404 upon invalid id', async ()=>{
            let response:supertest.Response = (await request.get(`/api/v1/tickets/${new ObjectId().toHexString()}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
        
        test('should fail upon invalid id format', async()=>{

            let response:supertest.Response = (await request.get(`/api/v1/tickets/de7c2e89e26d3d1834a`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })



    })

    describe('PUT /tickets tests',()=>{
        test('Should update ticket successfully', async ()=>{
            let update:Partial<ITicket> = {
                title: testTicket.title
            }
            let response:supertest.Response = (await request.put(`/api/v1/tickets/${testTicket.id}`).send(update).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(204)

        })

        test('Should return 404 upon invalid ticket ID', async()=>{
            let update:Partial<ITicket> = {
                title: testTicket.title
            }
            let response:supertest.Response = (await request.put(`/api/v1/tickets/${new ObjectId().toHexString()}`).send(update).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
        
        test('Should return 400 if ticket Title empty', async ()=>{
            let update:Partial<ITicket> = {
                title: "   "
            }
            let response:supertest.Response = (await request.put(`/api/v1/tickets/${testTicket.id}`).send(update).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('Should ignore extra params', async ()=>{
            let update:Partial<ITicket>  & any = {
                title: testTicket.title,
                extraParam: 'testTestTEst'
            }
            let response:supertest.Response = (await request.put(`/api/v1/tickets/${testTicket.id}`).send(update).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(204)

        })

    })
    describe('DELETE /tickets/:id tests',()=>{
        test('Should delete ticket successfully', async ()=>{
            let ticketToDeleteContent = 'this is a test ticket to be deleted immediately 12345678ASDEMCNDFASGDFDSGASDG'
            let ticket = {
                title: testTicket.title,
                projectId: testTicket.projectId,
                description: ticketToDeleteContent,
                authorId: testTicket.assignedTo.id
            }
            let ticketToDelete:supertest.Response = (await request.post('/api/v1/tickets').send(ticket).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            let response:supertest.Response = (await request.delete(`/api/v1/tickets/${ticketToDelete.body._id}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            console.log(ticketToDelete.body._id)
            console.log(response.body)
            expect(response.status).toBe(204)

        })
        test('Should return 404 upon id that doesnt exist', async ()=>{
            let response:supertest.Response = (await request.delete(`/api/v1/tickets/${new ObjectId().toHexString()}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)

            
        })
        test('Should return 400 upon invalid id format', async()=>{
            let response:supertest.Response = (await request.delete(`/api/v1/tickets/invalidIDformat`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
    })

    afterAll(async ()=>{
        await TicketModel.deleteMany({title:title})
    })
})