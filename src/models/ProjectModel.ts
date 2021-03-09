import { Document, Model, model, Schema, SchemaOptions,Types} from "mongoose"
import UserModel, { IUserDocument} from "./UserModel"
import {IProjectSubset, IUserSubset, UserSubsetSchema} from './SubsetSchemas'
//interface for the Project itself.
export interface IProject {
    projectName:String,
    owner?: IUserSubset,
    personnel?:{
        managers?: Array<IUserSubset>,
        developers?: Array<IUserSubset>
    }

}
export interface IProjectDocument extends IProject, Document{
    addDeveloper: (this:IProjectDocument, user:IUserSubset) => Promise<IProjectDocument>,
    removeDeveloper: (this:IProjectDocument, user:IUserSubset) => Promise<IProjectDocument>,
    addManager: (this:IProjectDocument, user:IUserSubset) => Promise<IProjectDocument>,
    removeManager: (this:IProjectDocument, user:IUserSubset) => Promise<IProjectDocument>,
    setOwner: (this:IProjectDocument, user:IUserSubset) => Promise<IProjectDocument>,
    getSubset: ()=> IProjectSubset
}


//interface for the model itself to give us type checking on the model
export interface IProjectModel extends Model<IProjectDocument> {
    
}


/**
 * SCHEMA DECLARATIONS
 */
const options:SchemaOptions = {
    timestamps:true
}
const ProjectSchema = new Schema<IProjectDocument, IProjectModel>({
    projectName: {type:String, required:true},
    owner: {type: UserSubsetSchema },
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
        if (dev.id.equals(userSubset.id)){
            //user already is in list of devs, so we will return the document unchanged
            throw new Error('User is already Developer on the project')
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
        if (dev.id.equals(userSubset.id)){
            found = true;
        }
    }
    if(!found){
        //user already is not in the list so we will throw an error 
        throw new Error("No Developer matching that id was found on this project")
    }else{
        this.personnel.developers = this.personnel.developers.filter(x=>{!x.id.equals(userSubset.id)})
        try{
            this.save()
            let  user:IUserDocument = await UserModel.findById(userSubset.id)
            user.projects.develops = user.projects.develops.filter(x=>{!x.id.equals(this.id)})
            user.save()
        }catch(e){
            throw e
        }
    }
    return this
}
const addManager: (this:IProjectDocument, userSubset:IUserSubset) => Promise<IProjectDocument>  = async function(this:IProjectDocument, userSubset:IUserSubset){
    let currentManagers = this.personnel.managers

    for (let manager of currentManagers){
        if (manager.id.equals(userSubset.id)){
            //user already is in list of managers, so we will return the document unchanged
            throw new Error('User is already a Manager on the project')
        }
    }
    //add as manager and update user doc to contain this project
    this.personnel.managers = [
        ...this.personnel.managers,
        userSubset
    ]
    
    try{
    await this.save()
        //get user so we can update through the model instead of sending a query
    let  user:IUserDocument = await UserModel.findById(userSubset.id)
    user.projects.manages.push(this.getSubset())
    await user.save();
    return this
    }catch(e){
        throw e
    }
}
const removeManager: (this:IProjectDocument, userSubset:IUserSubset) => Promise<IProject>  = async function(this:IProjectDocument, userSubset:IUserSubset){
    let found: boolean = false
    let currentManagers = this.personnel.managers
    for (let manager of currentManagers){
        if (manager.id.equals(userSubset.id)){
            found = true;
        }
    }
    if(!found){
        //user already is not in the list so we will throw an error 
        throw new Error("No Manager matching that id was found on this project")
    }else{
        this.personnel.managers = this.personnel.managers.filter(x=>{!x.id.equals(userSubset.id)})
        try{
            this.save()
            let  user:IUserDocument = await UserModel.findById(userSubset.id)
            user.projects.manages = user.projects.manages.filter(x=>{!x.id.equals(this.id)})
            user.save()
        }catch(e){
            console.error(e)
            throw new Error('Issue occurred while Saving. pleas try again')
            
        }
    }
    return this
}

const setOwner: (this:IProjectDocument, user:IUserSubset) => Promise<IProject>  = async function(this:IProjectDocument, user:IUserSubset){
    if (this.owner.id.equals(user.id)){
        throw new Error("User is already Project owner")
    }
    this.owner = user
    await this.save()
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