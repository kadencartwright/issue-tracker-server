import { Request,Response } from 'express';
import {Container} from 'typedi'
import {body, check,CustomValidator,param,ValidationChain, validationResult} from 'express-validator'
import UserService from '../services/UserService';
import { IUser, IUserDocument } from '../models/UserModel';
import { ObjectId } from 'mongodb';
import { Schema, ValidatorsSchema } from 'express-validator/src/middlewares/schema';
/**
 * the structure of this controller is such that any function that depends on validation of parameters should define BOTH 
 *      a handler function 
 *      and array of express-validator.ValidationChain functions
 */
/**
 * CREATE
 */

const createUserHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const err = validationResult(req)
    if(err.isEmpty()){
        const user:IUser = req.body
        const userService:UserService = Container.get(UserService)
        const userDoc:IUserDocument = await userService.createUser(user)
        res.status(200).json(userDoc.getSubset())
    }else{
        res.status(400).send(err.mapped())
    }
    
}
const createUserValidator:Array<ValidationChain>=[
    check('email').exists().isEmail().normalizeEmail().trim(),
    check('name').exists().isAlphanumeric().trim(),
    check('password').exists().isLength({max:256,min:8}).trim()
]
/**
 * READ
 */
const getUserHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const err = validationResult(req)
    if(err.isEmpty()){
        try{
            const userId:ObjectId = new ObjectId(req.params.id)
            const userService:UserService = Container.get(UserService)
            const user = await userService.findUserById(userId)
            res.status(200).json(user)
        }catch(e){
            //console.error(e)
            res.status(404).json({error:"A User with that ID was not found"})
        }
    }else{
        res.status(400).json(err.mapped())
    }
}
const getUserValidator:Array<ValidationChain> = [
    param('id').exists().isMongoId()
]
/**
 * UPDATE
 */

const updateUserHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const err = validationResult(req)
    if(err.isEmpty()){

        const userId:ObjectId = req.body.userId

        const updates:Partial<IUser> = {
        }
        if ('name' in req.body){updates.name = req.body.name}
        if ('email' in req.body){updates.email = req.body.email}
        if ('password' in req.body){updates.password = req.body.password}
        
        const userService:UserService = Container.get(UserService)
        try{
            await userService.updateUser(userId,updates)
            res.status(204).send()
        }catch(e){
            console.log(e)
            res.status(404).send('Resource was not found')
        }
    }else{
        res.status(400).json(err.mapped())
    }
}

const updateUserValidator:Array<ValidationChain>=[
    body('email').optional().isEmail().normalizeEmail().trim().optional(),
    body('name').optional().isAlphanumeric().trim(),
    body('password').optional().isLength({max:256,min:8}).trim().escape(),
    param('id').exists().isMongoId(),
]
/**
 * DELETE
 */
const deleteUserHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const err = validationResult(req)
    if(err.isEmpty()){
        const userId:ObjectId = new ObjectId(req.params.id)
        const userService:UserService = Container.get(UserService)
        try{
            await userService.deleteUser(userId)
            res.status(204).send()
        }catch(e){
            //console.error(e)
            res.status(404).send()
        }
    }else{
        res.status(400).json(err.mapped())
    }
}
const deleteUserValidator:Array<ValidationChain>=[
    param('id').exists().isMongoId()
]




export default {
    createUser:{ handler:createUserHandler , validator: createUserValidator},
    getUser: { handler: getUserHandler, validator: getUserValidator },
    updateUser:{ handler:updateUserHandler , validator: updateUserValidator},
    deleteUser: { handler:deleteUserHandler, validator: deleteUserValidator}
}
