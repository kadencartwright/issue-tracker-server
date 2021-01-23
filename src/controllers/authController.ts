import { Request,Response } from 'express';
import {Container} from 'typedi'
import {check,ValidationChain} from 'express-validator'
import AuthService, {ILogin} from '../services/AuthService';
/**
 * the structure of this controller is such that any function that depends on validation of parameters should define BOTH 
 *      a handler function 
 *      and array of express-validator.ValidationChain functions
 */

const loginHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const authService:AuthService = Container.get(AuthService)
    const creds:ILogin = {email:req.body.email,password: req.body.password}
    let user =(await authService.login(creds)).toJSON()
        let userFiltered =(({name,email})=>({name,email}))(user)
    res.json({userFiltered})
}
const loginValidator:Array<ValidationChain>=[
    check('email').exists(),
    check('password').exists(),
    check('email').isEmail(),
    check('password').isAlphanumeric()
]

export default {
    login:{ handler:loginHandler , validator: loginValidator},
}
