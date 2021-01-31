import { Request,Response } from 'express';
import {Container} from 'typedi'
import {body, check,CustomValidator,param,ValidationChain} from 'express-validator'
import UserService from '../services/UserService';
import { IUser, IUserDocument } from '../models/UserModel';
import { ObjectId } from 'mongodb';
import { Schema, ValidatorsSchema } from 'express-validator/src/middlewares/schema';
/**
 * the structure of this controller is such that any function that depends on validation of parameters should define BOTH 
 *      a handler function 
 *      and array of express-validator.ValidationChain functions
 */

const createUserHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const user:IUser = req.body
    const userService:UserService = Container.get(UserService)
    const userDoc:IUserDocument = await userService.createUser(user)
    res.json(userDoc)
}
const createUserValidator:Array<ValidationChain>=[
    check('email').exists().isEmail().normalizeEmail().trim(),
    check('name').exists().isAlphanumeric().trim(),
    check('password').exists().isLength({max:256,min:8}).trim().escape()
]
const getUserHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    try{
        const userId:ObjectId = new ObjectId(req.params.id)
        const userService:UserService = Container.get(UserService)
        const user = await userService.findUserById(userId)
        res.status(200).json(user)
    }catch(e){
        console.error(e)
        res.status(404).send()
    }
}
const getUserValidator:Array<ValidationChain> = [
    param('id').exists().isMongoId()
]

const updateUserHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const userId:ObjectId = req.body.userId

    const updates:Partial<IUser> = {
    }
    req.body.name ? updates.name = req.body.name: null ;
    req.body.email ? updates.email = req.body.email: null ;
    req.body.password ? updates.password = req.body.password: null ;
    
    const userService:UserService = Container.get(UserService)
    try{
        await userService.updateUser(userId,updates)
        res.status(204).send()
    }catch(e){
        console.log(e)
        res.status(404).send('Resource was not found')
    }
}

const updateUserValidator:Array<ValidationChain>=[
    body('email').optional().isEmail().normalizeEmail().trim().optional(),
    body('name').optional().isAlphanumeric().trim(),
    body('password').optional().isLength({max:256,min:8}).trim().escape(),
    param('userId').exists().isMongoId(),
]

const deleteUserHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const userId:ObjectId = new ObjectId(req.params.id)
    const userService:UserService = Container.get(UserService)
    try{
        await userService.deleteUser(userId)
        res.status(200).send()
    }catch(e){
        console.error(e)
        res.status(404).send()
    }
}
const deleteUserValidator:Array<ValidationChain>=[
    param('userId').exists().isMongoId()
]




export default {
    createUser:{ handler:createUserHandler , validator: createUserValidator},
    updateUser:{ handler:updateUserHandler , validator: updateUserValidator},
    deleteUser: { handler:deleteUserHandler, validator: deleteUserValidator},
    getUser: { handler: getUserHandler, validator: getUserValidator }
}
