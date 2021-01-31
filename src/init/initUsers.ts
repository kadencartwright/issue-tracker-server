import UserModel, { IUser} from '../models/UserModel';
import faker from 'faker'

const initUsers:()=>void = async function(){
    console.log('creating fake users')
    let users: Array<IUser> = [];
    let fakeUser:()=>IUser = ()=>{
        const user:IUser = {
            name:`${faker.name.firstName()} ${faker.name.lastName()}`,
            email:faker.internet.email(),
            password: faker.internet.password()
        }
        return user
    }
    for (let i = 0; i<10;i++){
        users.push(fakeUser())
    }
    await UserModel.create(users)
}

export default initUsers
