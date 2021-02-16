import dotenv from 'dotenv'
import {Container} from 'typedi'
import CommentService from '../../services/CommentService'
import fs from 'fs'

import TicketModel, { ITicketDocument } from '../../models/TicketModel'
import  CommentModel, { IComment, ICommentDocument, ICommentModel} from '../../models/CommentModel'
import { connectDB } from '../../database'
import { ObjectId } from 'mongodb'
import UserModel from '../../models/UserModel'
describe('CommentService tests', ()=>{

    let testComment:IComment
    let testCommentDoc:ICommentDocument
    let commentService = Container.get(CommentService)
    dotenv.config()
    let data = JSON.parse(fs.readFileSync('testData.json').toString())
    
    beforeAll(async()=>{
        testComment = data.comments[0]
        await connectDB(process.env.MONGO_STRING_TEST)
    })
    describe('createComment() tests', ()=>{

        test('should create the comment',async ()=>{
            testCommentDoc = await commentService.createComment(testComment)
            expect(testCommentDoc).toBeTruthy()
        })
        test('should throw error if input is undefined',async ()=>{
            let error
            try{
                await commentService.createComment(null)
            }catch(e){
                error = e
            }
            expect(error).toBeTruthy();
        })
    })
    describe('findCommentsByUser() tests', ()=>{
        test('should find a users comments with valid ID',async()=>{
            let  comments: ICommentDocument[]
            let user = await UserModel.findOne({})
            try{
                user = await UserModel.findOne({});
                comments = await commentService.findCommentsByUser(user.id)
            }catch(e){console.log(e)}
            expect(comments).toBeTruthy()
        })
    })

    describe('FindCommentsByTicket() tests',()=>{
        test("should find a comment by ticket with valid ID",async()=>{
            let  comments: ICommentDocument[]
            let ticket:ITicketDocument
            try{
                ticket = await TicketModel.findOne({});

                comments = await commentService.findCommentsByTicket(ticket.id)
            }catch(e){
                console.log(e)
            }
            expect(comments).toBeTruthy()
        })
    })
    describe('findCommentById() tests',()=>{
        test('should find comment by valid ID', async()=>{
            let comment:ICommentDocument
            let commentToFind:ICommentDocument
            try{   
                commentToFind = await CommentModel.findOne({})
                comment = await commentService.findCommentById(commentToFind.id)
            }catch(e){
                console.log(e)
            }
            expect(comment).toBeTruthy();
        })
    })

    describe('updateComment() tests',()=>{
        test('should update ticket by valid ID',async()=>{
            let comment: ICommentDocument
            let testString:String = 'test string'
            try{
                await commentService.updateComment(testCommentDoc.id,{content:testString})
                comment = await commentService.findCommentById(testCommentDoc.id)
            }catch(e){
                console.log(e)
            }
            expect(comment.content).toEqual(testString)
        })
    })
    describe('deleteComment function Tests', ()=>{
        let result
        test('should delete the comment',async ()=>{
            result = await commentService.deleteComment(testCommentDoc.id)
            expect(result).toBeTruthy()
        })
    
        test('should return error if the comment does not exist',async ()=>{
            let err = {}
            try{
                result = await commentService.deleteComment(new ObjectId('1234567890'))
            }catch(e){
                err = e
            }
            expect(err).toBeTruthy()
        })
        test('should return error if the comment id is null',async ()=>{
            let err = {}
            try{
                result = await commentService.deleteComment(null)
            }catch(e){
                err = e
            }
            expect(err).toBeTruthy()
        })
    })
})