import { ObjectId } from 'mongodb';
import {Service} from 'typedi';
import ProjectModel, {IProject, IProjectDocument} from "../models/ProjectModel"

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


    updateProject:(id:ObjectId, changes:Partial<IProject>) =>Promise<IProjectDocument> = async function (id:ObjectId, changes:Partial<IProject>){
        try{
            return await ProjectModel.findByIdAndUpdate(id,changes,{useFindAndModify:false}).exec()
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

}
