import UserModel,{IUser, IUserDocument} from '../models/UserModel'
import {Service} from 'typedi';

@Service()
export default class AuthService{
    constructor(){}
    createUser: (user:IUser)=>Promise<IUserDocument> = async function(user:IUser){
        try{
            return await UserModel.create(user)
        }catch(e){
            throw e
        }
    }

}
//auth helper interface