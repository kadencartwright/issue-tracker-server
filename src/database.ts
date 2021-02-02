import mongoose from 'mongoose'
let database:mongoose.Connection

export const connectDB:(uri:string)=>Promise<mongoose.Connection> =  async (uri?:string) =>{    
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
