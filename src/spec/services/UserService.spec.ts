import dotenv from 'dotenv'
import {Container} from 'typedi'
import UserService from '../../services/UserService'
import fs from 'fs'

import  UserModel, { IUser, IUserDocument} from '../../models/UserModel'
import { connectDB } from '../../database'
import { ObjectId } from 'mongodb'
describe('UserService tests', ()=>{

    let testUser:IUser
    let testUserDoc:IUserDocument
    let userService = Container.get(UserService)
    dotenv.config()
    let data = JSON.parse(fs.readFileSync('testData.json').toString())
    
    beforeAll(async()=>{
        testUser = data.users[0]
        await connectDB(process.env.MONGO_STRING_TEST)
    })
    describe('createUser() tests', ()=>{

        test('should create the user',async ()=>{

            testUser.email = `${testUser.email}test`
            testUserDoc = await userService.createUser(testUser)
            expect(testUserDoc).toBeTruthy()
        })
        test('should throw error if input is undefined',async ()=>{
            let error
            try{
                await userService.createUser(null)
            }catch(e){
                error = e
            }
            expect(error).toBeTruthy();
        })
    })

    describe('findUserById() tests',()=>{
        test('should find user by valid ID', async()=>{
            let user:IUserDocument
            let userToFind:IUserDocument
            try{   
                userToFind = await UserModel.findOne({})
                user = await userService.findUserById(userToFind.id)
            }catch(e){
                console.log(e)
            }
            expect(user).toBeTruthy();
        })
    })
    describe('findUsers() tests',()=>{
        test('should find user by subset', async()=>{
            let users:IUserDocument[]
            let userToFind:IUserDocument
            try{   
                userToFind = await UserModel.findOne({})
                users = await userService.findUsers({name:userToFind.name})
            }catch(e){
                console.log(e)
            }
            expect(users).toBeTruthy();
        })
    })



    describe('updateUser() tests',()=>{
        test('should update ticket by valid ID',async()=>{
            let user: IUserDocument
            let testString:String = 'test string'
            try{
                await userService.updateUser(testUserDoc.id,{name:testString})
                user = await userService.findUserById(testUserDoc.id)
            }catch(e){
                console.log(e)
            }
            expect(user.name).toEqual(testString)
        })
    })
    describe('deleteUser function Tests', ()=>{
        let result
        test('should delete the user',async ()=>{
            result = await userService.deleteUser(testUserDoc.id)
            expect(result).toBeTruthy()
        })
    
        test('should return error if the user does not exist',async ()=>{
            let err = {}
            try{
                result = await userService.deleteUser(new ObjectId('1234567890'))
            }catch(e){
                err = e
            }
            expect(err).toBeTruthy()
        })
        test('should return error if the user id is null',async ()=>{
            let err = {}
            try{
                result = await userService.deleteUser(null)
            }catch(e){
                err = e
            }
            expect(err).toBeTruthy()
        })
    })
})