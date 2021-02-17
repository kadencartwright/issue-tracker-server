import Express from "express";
import dotenv from 'dotenv';

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



export default app