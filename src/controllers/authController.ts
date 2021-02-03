import { Request,Response } from 'express';
import {Container} from 'typedi'
import {check,ValidationChain} from 'express-validator'
import AuthService, {ILogin} from '../services/AuthService';
import jwt from 'jsonwebtoken'
/**
 * the structure of this controller is such that any function that depends on validation of parameters should define BOTH 
 *      a handler function 
 *      and array of express-validator.ValidationChain functions
 */

const loginHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const authService:AuthService = Container.get(AuthService)
    const creds:ILogin = {email:req.body.email,password: req.body.password}
    let userDoc =(await authService.login(creds))
    if(!userDoc) {res.status(404).send()}
    let user = userDoc.toJSON()
    let userFiltered =(({name,email})=>({name,email}))(user)
    let token = jwt.sign({
        ...userFiltered,
        permissions:['admin']
    },process.env.JWT_SECRET,{expiresIn:'1000d'})
    res.json({token:token})
    //need to set token or cookie
}
const loginValidator:Array<ValidationChain>=[
    check('email').exists().isEmail(),
    check('password').exists().isLength({min:8,max:256})
]

export default {
    login:{ handler:loginHandler , validator: loginValidator},
}
