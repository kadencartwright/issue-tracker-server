import { ObjectId, UpdateWriteOpResult } from 'mongodb';
import {Service} from 'typedi';
import ProjectModel, {IProject, IProjectDocument} from "../models/ProjectModel"
import UserModel, { IUserDocument } from '../models/UserModel';

@Service()
export default class ProjectService{
    createProject: (project:IProject)=> Promise<IProjectDocument> = async function(project:IProject){
        try{
            return await ProjectModel.create(project)
        }catch(e){
            throw e
        }
    }

    findProjects:(projectPartial:Partial<IProject>)=>Promise<IProjectDocument[]> = async function(projectPartial:Partial<IProject>){
        try{
            return await ProjectModel.find(projectPartial).exec()
        }catch(e){
            throw e
        }
    }

    findProjectById:(id:ObjectId)=>Promise<IProjectDocument> = async function(id:ObjectId){
        try{
            return await ProjectModel.findById(id).exec()
        }catch(e){
            throw e
        }
    }    


    updateProject:(id:ObjectId, changes:Partial<IProject>) =>Promise<UpdateWriteOpResult['result']> = async function (id:ObjectId, changes:Partial<IProject>){
        try{

            let writeOpResult:UpdateWriteOpResult['result'] = (await ProjectModel.updateOne({_id:id},changes).exec())
            if (writeOpResult.nModified == 0){
                throw new Error("Could not modify Document")
            }
            return writeOpResult

        }catch(e){
            throw e
        }
    }
    

    deleteProject:(id:ObjectId)=>void = async function(id:ObjectId){
        try{
            if (id !=undefined){
                return await ProjectModel.deleteOne({_id:id}).exec()
            }
        }catch(e){
            throw e
        }
    }

    addDeveloper:(projectId: ObjectId, userId:ObjectId)=>Promise<IProjectDocument> = async function(projectId: ObjectId, userId:ObjectId){
        try{
            let [project, user]:[IProjectDocument,IUserDocument] = await Promise.all([ProjectModel.findById(projectId).exec(),await UserModel.findById(userId).exec()])
            return await project.addDeveloper(user.getSubset())
        }catch(e){
            throw e
        }


    }
    removeDeveloper:(projectId: ObjectId, userId:ObjectId)=>Promise<IProjectDocument>= async function(projectId: ObjectId, userId:ObjectId){
        try{
            let [project, user]:[IProjectDocument,IUserDocument] = await Promise.all([ProjectModel.findById(projectId).exec(),await UserModel.findById(userId).exec()])
            return await project.removeDeveloper(user.getSubset())
        }catch(e){
            throw e
        }
    }
    addManager:(projectId: ObjectId, userId:ObjectId)=>Promise<IProjectDocument> = async function(projectId: ObjectId, userId:ObjectId){
        try{
            let [project, user]:[IProjectDocument,IUserDocument] = await Promise.all([ProjectModel.findById(projectId).exec(),await UserModel.findById(userId).exec()])
            return await project.addManager(user.getSubset())
        }catch(e){
            throw e
        }
    }
    removeManager:(projectId: ObjectId, userId:ObjectId)=>Promise<IProjectDocument> = async function(projectId: ObjectId, userId:ObjectId){
        try{
            let [project, user]:[IProjectDocument,IUserDocument] = await Promise.all([ProjectModel.findById(projectId).exec(),await UserModel.findById(userId).exec()])
            return await project.removeManager(user.getSubset())
        }catch(e){
            throw e
        }
    }
    changeOwner:(projectId: ObjectId, userId:ObjectId)=>Promise<IProjectDocument> = async function(projectId: ObjectId, userId:ObjectId){
        try{
            let [project, user]:[IProjectDocument,IUserDocument] = await Promise.all([ProjectModel.findById(projectId).exec(),await UserModel.findById(userId).exec()])
            return await project.setOwner(user.getSubset())
        }catch(e){
            throw e
        }
    }

}
