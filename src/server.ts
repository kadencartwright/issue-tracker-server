import app from './app'
import {connectDB,disconnectDB} from "./database"



const PORT = process.env.PORT


app.listen(PORT,async ()=>{
    await connectDB(process.env.MONGO_STRING_DEV)
    console.log(`Server is running on http://localhost:${PORT}`)
})

//close connection on process interrupt
process.on('SIGINT',async ()=>{
    await disconnectDB()
    process.exit(0)
})