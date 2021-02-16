import { Document, Model, model, Schema, SchemaOptions,Types} from "mongoose"
import UserModel, { IUserDocument, IUserSubset} from "./UserModel"
import {UserSubsetSchema} from './SubsetSchemas'
//interface for the Project itself.
export interface IProject {
    projectName:String,
    owner: IUserSubset,
    personnel:{
        managers: Array<IUserSubset>,
        developers: Array<IUserSubset>
    }

}
export interface IProjectDocument extends IProject, Document{
    addDeveloper: (user:IProject) => Promise<IProject>,
    removeDeveloper: (user:IProject) => Promise<IProject>,
    addManager: (user:IProject) => Promise<IProject>,
    removeManager: (user:IProject) => Promise<IProject>,
    setOwner: (user:IProject) => Promise<IProject>,
    getSubset: ()=> IProjectSubset
}


//interface for the model itself to give us type checking on the model
export interface IProjectModel extends Model<IProjectDocument> {
    
}

//helpers for objects that ref this object
export interface IProjectSubset {
    name: IProjectDocument['projectName'],
    id: IProjectDocument['id']
}

/**
 * SCHEMA DECLARATIONS
 */
const options:SchemaOptions = {
    timestamps:true
}
const ProjectSchema = new Schema<IProjectDocument, IProjectModel>({
    projectName: {type:String, required:true},
    owner: {type: UserSubsetSchema, required:true },
    personnel: {
        managers:[ {type: UserSubsetSchema} ],
        developers: [ {type: UserSubsetSchema} ]
    }
},options)

/**
 * INSTANCE METHODS
 * 
 */

//here we use instance methods on the project schema and the user schema to give similar functionality
//to SQL CASCADE's
const addDeveloper: (this:IProjectDocument, userSubset:IUserSubset) => Promise<IProjectDocument>  = async function(this:IProjectDocument, userSubset:IUserSubset){
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
    let  user:IUserDocument = await UserModel.findById(userSubset.id)
    user.projects.develops.push(this.getSubset())
    await user.save();
    return this
    }catch(e){
        throw e
    }
}
const removeDeveloper: (this:IProjectDocument, userSubset:IUserSubset) => Promise<IProject>  = async function(this:IProjectDocument, userSubset:IUserSubset){
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
            let  user:IUserDocument = await UserModel.findById(userSubset.id)
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

const getSubset: (this:IProjectDocument)=> IProjectSubset = function(this:IProjectDocument){ 
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



export default model<IProjectDocument>("Project",ProjectSchema)