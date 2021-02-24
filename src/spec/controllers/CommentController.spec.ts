import supertest from 'supertest'
import app from '../../app'
import fs from 'fs'
import { connectDB } from '../../database'
import TicketModel, { ITicketDocument } from '../../models/TicketModel'
import {IUser} from '../../models/UserModel'
import {ILogin} from '../../services/AuthService'
import CommentModel from '../../models/CommentModel'
import { ObjectID } from 'mongodb'
describe('CommentController tests',()=>{
    let testData = JSON.parse(fs.readFileSync('testData.json').toString())
    const request = supertest(app)
    let testTicket:ITicketDocument 
    let token:String
    let content:String = 'this is a test comment to rest the post comments route someRanDomUniQueTexT1203848ljhsjflji34sljlsja0394uaj'
    beforeAll(async ()=>{
        await connectDB(process.env.MONGO_STRING_TEST)
        let user: IUser = testData.users[0];
        testTicket = await TicketModel.findOne({}).exec()
        let login:ILogin = {
            email: user.email,
            password: user.password
        }
        token = (await request.post('/api/v1/login').send(login).set('Accept', 'application/json')).body.token

    })
    
    describe('POST /comments tests',()=>{

        test('Should post a root comment successfully',async ()=>{
            let comment = {
                content: content,
                ticketId: testTicket.id,
                authorId: testTicket.assignedTo.id
            }
            let response:supertest.Response = (await request.post('/api/v1/comments').send(comment).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(200)
        })

        test('Should post a child comment successfully',async ()=>{
            let comment = {
                content: content,
                ticketId: testTicket.id,
                authorId: testTicket.assignedTo.id
            } 

            let parent = await CommentModel.create(comment)
            let childComment = {...comment,
                parent: parent.id
            }
            let response = (await request.post('/api/v1/comments').send(childComment).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(200)
        })

        //TODO test invalid user
        test('Should return 400 upon invalid user ID', async()=>{
            let comment = {
                content: content,
                ticketId:testTicket.id,
                authorId: new ObjectID().toHexString()
            } 

            let response:supertest.Response = await request.post('/api/v1/comments').send(comment).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`)
            expect(response.status).toBe(400)
        })
        test('Should return status == 400 upon invalid ticket ID', async()=>{
            let comment = {
                content: content,
                ticketId: '54651022bffebc03098b4567',
                authorId: testTicket.assignedTo.id
            } 
            let response:supertest.Response = (await request.post('/api/v1/comments').send(comment).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })

        // TODO test missing user 
        test('Should return status == 400 if user missing', async ()=>{
            let comment = {
                content: 'this is a test comment to rest the post comments route',
                ticketId: testTicket.id
            } 
            let response:supertest.Response = (await request.post('/api/v1/comments').send(comment).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)

        })
        //TODO test empty content param
        test('Should return 400 if comment content empty', async ()=>{
            let comment = {
                content: ' ',
                ticketId: testTicket.id,
                authorId: testTicket.assignedTo.id
            }
            let response:supertest.Response = (await request.post('/api/v1/comments').send(comment).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })


        //TODO test missing content param
        test('Should return 400 if content missing', async ()=>{
            let comment = {
                ticketId: testTicket.id,
                authorId: testTicket.assignedTo.id
            }
            let response:supertest.Response = (await request.post('/api/v1/comments').send(comment).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('Should ignore extra params', async ()=>{
            let comment = {
                content: content,
                ticketId: testTicket.id,
                authorId: testTicket.assignedTo.id,
                extraParam: 'testtesttest'
            }
            let response:supertest.Response = (await request.post('/api/v1/comments').send(comment).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(200)

        })

    })

    describe('GET /comments/:id tests',()=>{
        test('Should get comment successfully',()=>{

        })
        test('Should return ... upon invalid request',()=>{

        })
    })

    describe('PUT /comments tests',()=>{
        test('Should update comment successfully',()=>{

        })
        test('Should return ... upon invalid request',()=>{
            
        })
    })

    describe('DELETE /comments/:id tests',()=>{
        test('Should delete comment successfully',()=>{

        })
        test('Should return ... upon invalid request',()=>{
            
        })
    })
    afterAll(async ()=>{
        await CommentModel.deleteMany({content:content})
    })
})