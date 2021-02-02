import Express from "express";
import dotenv from 'dotenv';
import {connectDB,disconnectDB} from "./database"
import router from './routes/router'
dotenv.config()
const PORT = process.env.PORT
const app = Express()
app.use([Express.json(),Express.urlencoded({extended:true})])//parse url and json data

app.use('/',router)

app.listen(PORT,async ()=>{
    await connectDB(process.env.MONGO_STRING)

    console.log(`Server is running on http://localhost:${PORT}`)
})

//close connection on process interrupt
process.on('SIGINT',async ()=>{
    await disconnectDB()
    process.exit(0)
})

