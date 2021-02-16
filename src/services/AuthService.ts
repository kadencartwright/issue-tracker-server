import bcrypt from 'bcrypt'
import UserModel,{IUser, IUserDocument} from '../models/UserModel'
import {Service} from 'typedi';
import jwt from 'jsonwebtoken'
@Service()
export default class AuthService{
    constructor(){}
    
    login: (creds:ILogin)=>Promise<String|null> = async function(creds:ILogin){
        if (!creds.email){return null}
        let user:IUser =  await UserModel.findOne({email: creds.email.toLowerCase()}).exec()
        if (!user) return null; 
        let validPass:boolean = await bcrypt.compare(creds.password,user.password.toString())
        if (validPass){
            let token = this.generateToken(user,true)
            return token
        }else{
            return null
        }
    }
    generateToken: (user:IUserDocument,admin:Boolean) =>String = function(user:IUserDocument,admin:Boolean){
        if (!user) return null
        let payload:any = {
            name: user.name,
            email: user.email,
            id: user.id
        }
        if (admin){payload.admin = admin}
        return jwt.sign(payload,process.env.JWT_SECRET)
    }
}
//auth helper interface
export interface ILogin{
    email:IUser['email'],
    password:IUser['password']
}
