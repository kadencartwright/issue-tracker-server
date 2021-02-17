import supertest from 'supertest'
import app from '../../app'
import fs from 'fs'
import { ILogin } from '../../services/AuthService'
import { connectDB } from '../../database'


describe('AuthController tests',()=>{
    let testData = JSON.parse(fs.readFileSync('testData.json').toString())
    let users = testData.users
    const request = supertest(app)

    beforeAll(async ()=>{
        await connectDB(process.env.MONGO_STRING_TEST)
    })

    describe('POST /login tests',()=>{
        test('Should login with valid credentials',async ()=>{
            let login:ILogin = {
                email:users[1].email,
                password: users[1].password
            }
            const response = await request.post('/api/v1/login').send(login).set('Accept', 'application/json')
            expect(response.status).toBe(200)
        })
        test('Should fail with invalid password', async()=>{
            let login:ILogin = {
                email:users[1].email,
                password: `invalid${users[1].password}`
            }
            const response = await request.post('/api/v1/login').send(login).set('Accept', 'application/json')
            expect(response.status).toBe(401)
    
        })
        test('Should fail with invalid email', async()=>{
            let login:ILogin = {
                email:`invalid${users[1].email}`,
                password: users[1].password
            }
            const response = await request.post('/api/v1/login').send(login).set('Accept', 'application/json')
            expect(response.status).toBe(401)
        })
    })
})