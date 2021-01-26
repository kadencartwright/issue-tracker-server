import { ObjectId } from 'mongodb';
import Container, {Service} from 'typedi';
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

    findProjects:(projectPartial:Partial<IProject>)=>Promise<Array<IProjectDocument>> = async function(projectPartial:Partial<IProject>){
        try{
            return await ProjectModel.find({...projectPartial}).exec()
        }catch(e){
            throw e
        }
    }

    findProjectById:(id:ObjectId)=>Promise<Array<IProjectDocument>> = async function(id:ObjectId){
        try{
            return await ProjectModel.findById(id).exec()
        }catch(e){
            throw e
        }
    }

    updateProject:(id:ObjectId, changes:Partial<IProject>) =>Promise<IProjectDocument> = async function (id:ObjectId, changes:Partial<IProject>){
        try{
            return await ProjectModel.findByIdAndUpdate(id,changes).exec()
        }catch(e){
            throw e
        }
    }

    deleteProject:(id:ObjectId)=>void = async function(id:ObjectId){
        try{
            if (id !=undefined){
                return await ProjectModel.deleteOne({_Id:id}).exec()
            }
        }catch(e){
            throw e
        }
    }

}