import Express from "express";
import dotenv from 'dotenv';
dotenv.config()
const PORT = process.env.PORT
const app = Express()

app.get('/',(req,res)=>{
    res.send('<h1>server is running!</h1>')
})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})
