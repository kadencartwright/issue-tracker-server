import mongoose from 'mongoose'
let database:mongoose.Connection

export const connectDB:()=>Promise<mongoose.Connection> =  async () =>{
    const uri = "mongodb://localhost:27017/IssueTracker?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false"
    if (database){
        return
    }
    try{
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
    }catch(e){
        console.log(e)
    }
    
    database = mongoose.connection
    database.on('open',async ()=>{
        console.log('Mongo Connected!')
    })
    database.on('error',(err)=>{
        console.log('mongo error')
        console.log(err)
    })
    return database
}
export const disconnectDB:()=>void = async() => {
    if (!database) {
      return
    }
    await mongoose.disconnect()
}
