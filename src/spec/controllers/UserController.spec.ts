import supertest from 'supertest'
import app from '../../app'
import fs from 'fs'
import { connectDB } from '../../database'
import UserModel, { IUser, IUserDocument } from '../../models/UserModel'
import { ILogin } from '../../services/AuthService'
import { ObjectId } from 'bson'

describe('UserController tests',()=>{
    const request = supertest(app)
    let testUser: IUser = {
        name:'testUserlsajkhgklahssdjfgllshg',
        email:'testUser12345@testdomain.com',
        password:'testpasswordtesttesttest'
    }
    let testUserDoc: IUserDocument
    let token:String


    beforeAll(async()=>{
        await connectDB(process.env.MONGO_STRING_TEST)
        let anotherTestUserData:IUser = {...testUser}
        anotherTestUserData.email = `asdf${anotherTestUserData.email}`
        testUserDoc = await UserModel.create(anotherTestUserData)
        let login:ILogin = {
            email: testUserDoc.email,
            password: testUser.password
        }
        token = (await request.post('/api/v1/login').send(login).set('Accept', 'application/json')).body.token


    })
    describe("POST /users/newuser tests",()=>{
        test('should create a new user', async()=>{
            let response = (await request.post('/api/v1/users/newuser').send(testUser).set('Accept', 'application/json'))
            expect(response.status).toBe(200)
        })
        test('should return 400 if missing param', async()=>{
            let response = (await request.post('/api/v1/users/newuser').send({email:testUser.email,name:testUser.name}).set('Accept', 'application/json'))
            expect(response.status).toBe(400)
        })
        test('should return 400 if email is incorrect format', async()=>{
            let response = (await request.post('/api/v1/users/newuser').send({email:'not an email',name:testUser.name}).set('Accept', 'application/json'))
            expect(response.status).toBe(400)
        })
        test('should ignore extra params', async()=>{
            let withExtraParam = {...testUser,extraParam:'extraparam'}
            withExtraParam.email = `another${testUser.email}`
            let response = (await request.post('/api/v1/users/newuser').send(withExtraParam).set('Accept', 'application/json'))
            expect(response.status).toBe(200)
        })

    })
    describe("GET /users/:id tests",()=>{
        test('should get the user', async()=>{
            let response:supertest.Response = (await request.get(`/api/v1/users/${testUserDoc.id}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(200)
        })
        test('should return 404 id is bad ref', async()=>{
            let response:supertest.Response = (await request.get(`/api/v1/users/${new ObjectId()}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
        test('should return 400 if id is incorrect format', async()=>{
            let response:supertest.Response = (await request.get(`/api/v1/users/notAMongoId`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('should ignore body', async()=>{
            let response:supertest.Response = (await request.get(`/api/v1/users/${testUserDoc.id}`).send({testParam:'test'}).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(200)
        })
    })
    describe("PUT /users/:id tests",()=>{
        test('should update the user', async()=>{
            let updates = {
                email:testUserDoc.email
            }
            let response:supertest.Response = (await request.put(`/api/v1/users/${testUserDoc.id}`).send(updates).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(204)
        })
        test('should return 400 if id is incorrect format', async()=>{
            let updates = {
                email:testUserDoc.email
            }
            let response:supertest.Response = (await request.put(`/api/v1/users/notAMongoID`).send(updates).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })

        test('should ignore extra params', async()=>{
            let updates = {
                email:testUserDoc.email,
                extraParam:"extra"
            }
            let response:supertest.Response = (await request.put(`/api/v1/users/${testUserDoc.id}`).send(updates).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(204)
        })
    })
    describe("DELETE /users/:id tests",()=>{
        test('should delete the user', async()=>{
            let response:supertest.Response = (await request.delete(`/api/v1/users/${testUserDoc.id}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(204)
        })
        test('should return 404 if ID is invalid ref ', async()=>{
            let response:supertest.Response = (await request.delete(`/api/v1/users/${new ObjectId()}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
        test('should return 400 if id is incorrect format', async()=>{
            let response:supertest.Response = (await request.delete(`/api/v1/users/notAMongoId`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
            
        })
    })
    afterAll(async ()=>{
        try{
            await UserModel.deleteMany({name:testUser.name})
        }catch(e){
            console.error(e)
        }

    })
})