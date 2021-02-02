import AuthService, { ILogin } from '../../services/AuthService'
import initDb from '../../init/init'
import {MongoMemoryServer} from 'mongodb-memory-server'
import {connectDB, disconnectDB} from '../../database'
import Container from 'typedi'

describe('AuthController Tests',()=>{
    let mms, uri, db, users
    let authService = Container.get(AuthService)

    beforeAll(async ()=>{
        try{
            mms = new MongoMemoryServer()
            await mms._startUpInstance()
            uri = await mms.getUri()
            db = connectDB(uri)
            users = await initDb()

        }catch(e){
        }

    },10000)


    test('should have an initialized DB',()=>{
        expect(db).toBeTruthy()
    })
    test('login should return a user with valid login passed', ()=>{
        let login:ILogin = {
            email: users[1].email,
            password: users[1].password
        }
        expect(authService.login(login)).toBeTruthy()
    })
    test('login should return null with invalid pass',async ()=>{
        let login:ILogin = {
            email: users[1].email,
            password: "incorrect password123@"
        }
        expect(await authService.login(login)).toBeFalsy()
    })
    test('login should return null with invalid email',async ()=>{
        let login:ILogin = {
            email: "incorrect@email.com",
            password: users[1].password
        }
        expect(await authService.login(login)).toBeFalsy()
    })
    afterAll(()=>{
        disconnectDB()
    })

})

