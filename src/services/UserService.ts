import UserModel,{IUser,IUserDocument } from '../models/UserModel'
import {Service} from 'typedi';
import { DeleteWriteOpResultObject, ObjectId, UpdateWriteOpResult } from 'mongodb';

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
            let user:IUserDocument = await UserModel.findOne({_id:id}).exec()
            if(!user){throw new Error('No user found with that ID')}
            return user
        }catch(e){
            throw e
        }
    }
    findUsers: (userPartial:Partial<IUser>) => Promise<IUserDocument[]> =  async function(userPartial:Partial<IUser>){
        try{
            //TODO fix this
            return await UserModel.find({}).exec()
        }catch(e){
            throw e
        }
    }

    updateUser:(id:ObjectId, changes:Partial<IUser>) =>Promise<IUserDocument> = async function (id:ObjectId, changes:Partial<IUser>){
        try{
            return await UserModel.findByIdAndUpdate(id,{...changes},{useFindAndModify:false}).exec()
        }catch(e){
            throw e
        }
    }
    deleteUser:(id:ObjectId)=>Promise<DeleteWriteOpResultObject['result']> = async function(id:ObjectId){
        try{
            let result:DeleteWriteOpResultObject['result']
            if (id !=undefined){
                result = await UserModel.deleteOne({_id:id}).exec()
            }
            if(!result.n){
                throw new Error('Could not find the referenced Object')
            }
            return result
        }catch(e){
            throw e
        }
    }

}
