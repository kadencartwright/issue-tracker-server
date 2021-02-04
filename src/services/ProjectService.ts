import { ObjectId } from 'mongodb';
import Container, {Service} from 'typedi';
import ProjectModel, {IProject} from "../models/ProjectModel"

@Service()
export default class ProjectService{
    createProject: (project:IProject)=> Promise<IProject> = async function(project:IProject){
        try{
            return await ProjectModel.create(project)
        }catch(e){
            throw e
        }
    }

    findProjects:(projectPartial:Partial<IProject>)=>Promise<Array<IProject>> = async function(projectPartial:Partial<IProject>){
        try{
            //TODO fix this
            return await ProjectModel.find({}).exec()
        }catch(e){
            throw e
        }
    }

    findProjectById:(id:ObjectId)=>Promise<Array<IProject>> = async function(id:ObjectId){
        try{
            return await ProjectModel.findById(id).exec()
        }catch(e){
            throw e
        }
    }    
    //TODO add find project by user id or user obj


    updateProject:(id:ObjectId, changes:Partial<IProject>) =>Promise<IProject> = async function (id:ObjectId, changes:Partial<IProject>){
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
