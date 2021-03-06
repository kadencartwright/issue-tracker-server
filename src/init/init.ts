import initUsers from './initUsers'
import initTickets from './initTickets'
import initProjects from './initProjects'
import initComments from './initComments'
import dotenv from 'dotenv'
import { connectDB, disconnectDB} from '../database';
import fs from 'fs'

dotenv.config();


export default async function initDb(){
    console.log('initializing users!')
    let users = await initUsers()
    console.log('initializing projects!')
    let projects = await initProjects()
    console.log('initializing tickets!')
    let tickets = await initTickets()
    console.log('initializing comments!')
    let comments = await initComments()

    return {
        users:users,
        projects:projects,
        tickets:tickets,
        comments:comments
    }

};

(async ()=>{
        await connectDB(process.env.MONGO_STRING_TEST)
        let data = JSON.stringify(await initDb())
        fs.writeFileSync('testData.json',data)
        disconnectDB()
        process.exit()
    }
)()