import Express from "express";
import dotenv from 'dotenv';
import {connectDB,disconnectDB} from "./database"
import router,{openRoutes} from './routes/router'
import jwt from 'express-jwt'
dotenv.config()
const PORT = process.env.PORT
const app = Express()
app.use([Express.json(),Express.urlencoded({extended:true})])//parse url and json data
app.use(jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
}).unless({path:[...openRoutes]}))
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

