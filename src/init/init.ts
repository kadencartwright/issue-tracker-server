import initUsers from './initUsers'
import initTickets from './initTickets'
import initProjects from './initProjects'
import initComments from './initComments'
import dotenv from 'dotenv'
import { connectDB, disconnectDB} from '../database';


dotenv.config();


export default async function initDb(){
    console.log('initializing users!')
    let users = await initUsers()
    console.log('initializing projects!')
    await initProjects()
    console.log('initializing tickets!')
    await initTickets()
    console.log('initializing comments!')
    await initComments()

    return users

};

(async ()=>{
        await connectDB(process.env.MONGO_STRING)
        await initDb()
        disconnectDB()
        process.exit()
    }
)()