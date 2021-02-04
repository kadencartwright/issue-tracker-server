import { Document, Model, model, Schema, SchemaOptions,Types, UpdateQuery} from "mongoose"
import { IpcNetConnectOpts } from "net"
import UserModel, { IUser, IUserModel, IUserSubset, UserSubsetSchema } from "./UserModel"
//interface for the Project itself.
export interface IProject extends Document{
    projectName:String,
    owner: IUserSubset,
    personnel:{
        managers: Array<IUserSubset>,
        developers: Array<IUserSubset>
    }
    addDeveloper: (user:IProject) => Promise<IProject>,
    removeDeveloper: (user:IProject) => Promise<IProject>,
    addManager: (user:IProject) => Promise<IProject>,
    removeManager: (user:IProject) => Promise<IProject>,
    setOwner: (user:IProject) => Promise<IProject>,
    getSubset: ()=> IProjectSubset
}


//interface for the model itself to give us type checking on the model
export interface IProjectModel extends Model<IProject> {
    
}

//helpers for objects that ref this object
export interface IProjectSubset {
    name: IProject['projectName'],
    id: IProject['id']
}
export const ProjectSubsetSchema = new Schema({
    name: { type:"string", required:true },
    id: { type:Types.ObjectId, ref:"Project", required:true }
})
/**
 * SCHEMA DECLARATIONS
 */
const options:SchemaOptions = {
    timestamps:true
}
const ProjectSchema = new Schema<IProject, IProjectModel>({
    projectName: {type:String, required:true},
    owner: UserSubsetSchema,
    personnel: {
        managers:[ UserSubsetSchema ],
        developers: [ UserSubsetSchema ]
    }
},options)

/**
 * INSTANCE METHODS
 * 
 */

//here we use instance methods on the project schema and the user schema to give similar functionality
//to SQL CASCADE's
const addDeveloper: (this:IProject, userSubset:IUserSubset) => Promise<IProject>  = async function(this:IProject, userSubset:IUserSubset){
    let currentDevs = this.personnel.developers
    for (let dev of currentDevs){
        if (dev.id == userSubset.id){
            //user already is in list of devs, so we will return the document unchanged
            return this
        }
    }
    //add as developer and update user doc to contain this project
    this.personnel.developers = [
        ...this.personnel.developers,
        userSubset
    ]
    
    try{
    await this.save()
        //get user so we can update through the model instead of sending a query
    let  user:IUser = await UserModel.findById(userSubset.id)
    user.projects.develops.push(this.getSubset())
    await user.save();
    return this
    }catch(e){
        throw e
    }
}
const removeDeveloper: (this:IProject, userSubset:IUserSubset) => Promise<IProject>  = async function(this:IProject, userSubset:IUserSubset){
    let found: boolean = false
    let currentDevs = this.personnel.developers

    for (let dev of currentDevs){
        if (dev.id == userSubset.id){
            found = true;
        }
    }
    if(!found){
        //user already is not in the list so we will do nothing
        return this
    }else{
        this.personnel.developers = this.personnel.developers.filter(x=>{x.id!=userSubset.id})
        try{
            this.save()
            let  user:IUser = await UserModel.findById(userSubset.id)
            user.projects.develops = user.projects.develops.filter(x=>{x.id!= this.id})
            user.save()
        }catch(e){
            throw e
        }


    }


    return this
}
const addManager: (this:IProject, user:IUserSubset) => Promise<IProject>  = async function(this:IProject, user:IUserSubset){

    return this
}
const removeManager: (this:IProject, user:IUserSubset) => Promise<IProject>  = async function(this:IProject, user:IUserSubset){
    return this
}

const setOwner: (this:IProject, user:IUserSubset) => Promise<IProject>  = async function(this:IProject, user:IUserSubset){
    return this
}

const getSubset: (this:IProject)=> IProjectSubset = function(this:IProject){ 
    return{
        id: this.id,
        name: this.projectName
    }
}



ProjectSchema.method('addDeveloper',addDeveloper)
ProjectSchema.method('removeDeveloper',removeDeveloper)
ProjectSchema.method('addManager',addManager)
ProjectSchema.method('removeManager',removeManager)
ProjectSchema.method('setOwner',setOwner)
ProjectSchema.method('getSubset',getSubset)



export default model<IProject>("Project",ProjectSchema)