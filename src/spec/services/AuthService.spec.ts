import AuthService, { ILogin } from '../../services/AuthService'
import fs from 'fs'
import {connectDB, disconnectDB} from '../../database'
import Container from 'typedi'
import dotenv from 'dotenv'
import UserModel, { IUserDocument } from '../../models/UserModel'

describe('AuthController Tests',()=>{
    let db
    let authService = Container.get(AuthService)
    dotenv.config()
    let testData = JSON.parse(fs.readFileSync('testData.json').toString())
    let users = testData.users
    describe('Login Function tests',()=>{
        test('should have an initialized DB', async ()=>{
            let err
            try{
                db = await connectDB(process.env.MONGO_STRING_TEST)
            }catch(e){
                err = e
            }  
            expect(err).toBeFalsy()

        })
        test('should return a user with valid login passed', ()=>{
            let login:ILogin = {
                email: users[1].email,
                password: users[1].password
            }
            expect(authService.login(login)).toBeTruthy()
        })
        test('should return null with invalid pass',async ()=>{
            let login:ILogin = {
                email: users[1].email,
                password: "incorrect password123@"
            }
            expect(await authService.login(login)).toBeFalsy()
        })
        test('should return null with invalid email',async ()=>{
            let login:ILogin = {
                email: "incorrect@email.com",
                password: users[1].password
            }
            expect(await authService.login(login)).toBeFalsy()
        })
    })

    describe('generateToken Function Tests',()=>{
        test('should return a token',async ()=>{
            let user = await UserModel.findOne()
            let token = authService.generateToken(user,true)
            expect(token).toBeTruthy()
        })
        test('should reurn null if user is undefined/null',()=>{
            let user:IUserDocument = null;
            let token = authService.generateToken(user,true)
            expect(token).toBeFalsy()
        })
        
    })

    afterAll(()=>{
        disconnectDB()
    })


})

