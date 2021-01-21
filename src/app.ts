import Express from "express";
import dotenv from 'dotenv';
import { connectDB } from "./database";
import UserModel from './models/user/user.model';
import {IUser} from './models/user/user.types'
dotenv.config()
const PORT = process.env.PORT
const app = Express()
//init our mongo connection here
connectDB();
app.get('/',(req,res)=>{
    res.send('<h1>server is running!</h1>')
})



app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})
