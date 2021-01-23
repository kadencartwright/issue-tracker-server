import bcrypt from 'bcrypt'
import UserModel,{IUser, IUserDocument} from '../models/UserModel'
import {Service} from 'typedi';

@Service()
export default class AuthService{
    constructor(){}
    
    login: (creds:ILogin)=>Promise<IUserDocument|null> = async function(creds:ILogin){
        let user:IUserDocument =  await UserModel.findOne({email: creds.email.toLowerCase()}).exec()
        let validPass:boolean = await bcrypt.compare(creds.password,user.password.toString())
        if (validPass){
            return user
        }else{
            return null
        }
    }

}
//auth helper interface
export interface ILogin{
    email:IUser['email'],
    password:IUser['password']
}
