import userModel, { IUser } from './../models/userModel';
import { connectDB, disconnectDB} from '../database';
import faker from 'faker'

 (async()=>{
    await connectDB()
    console.log('creating fake users')
    let users: Array<IUser> = [];
    let fakeUser:()=>IUser = ()=>{
        const user:IUser = {
            name:{
                first: faker.name.firstName(),
                last: faker.name.lastName()
            },
            email:faker.internet.email(),
            password: faker.internet.password()
        }
        return user
    }
    
    for (let i = 0; i<10;i++){
        users.push(fakeUser())
    }
    console.log(users)
    await userModel.create(users)
    disconnectDB()
    process.exit()
})();





