import UserModel,{IUser, IUserDocument} from '@models/UserModel'
import {Service} from 'typedi';
import { ObjectId } from 'mongodb';

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
    findUserById: (id:ObjectId) => Promise<IUserDocument> = async function(id:ObjectId){
        try{
            return await UserModel.findOne({_id:id}).exec()
        }catch(e){
            throw e
        }
    }
    findUsers: (userPartial:Partial<IUser>) => Promise<Array<IUserDocument>> =  async function(userPartial:Partial<IUser>){
        try{
            return await UserModel.find({...userPartial}).exec()
        }catch(e){
            throw e
        }
    }

    updateUser:(id:ObjectId, changes:Partial<IUser>) =>Promise<IUserDocument> = async function (id:ObjectId, changes:Partial<IUser>){
        try{
            return await UserModel.findByIdAndUpdate(id,{...changes}).exec()
        }catch(e){
            throw e
        }
    }
    deleteUser:(id:ObjectId)=>void = async function(id:ObjectId){
        try{
            if (id !=undefined){
                return await UserModel.deleteOne({_Id:id}).exec()
            }else{
                throw new Error("'id' param is undefined. please pass a valid 'id'")
            }
        }catch(e){
            throw e
        }
    }

}
