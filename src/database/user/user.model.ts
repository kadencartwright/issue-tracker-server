import { IUserDocument } from './user.types';
import mongoose, { Schema, Document, Model} from 'mongoose';
import UserSchema from './user.schema'



//keep in sync with UserSchema
export interface IUser extends Document {
    email:string,
    firstName:string,
    lastName:string
}
export interface ICreateUserInput{
    email: IUser['email']
    firstName: IUser['firstName']
    lastName: IUser['lastName']
}






export default mongoose.model<IUser>('User',UserSchema);


