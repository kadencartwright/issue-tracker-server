
import { Request,Response } from 'express';
import {Container} from 'typedi'
import {body, check,param,ValidationChain, validationResult} from 'express-validator'
import ProjectService from '../services/ProjectService';
import UserService from '../services/UserService';
import { IProject, IProjectDocument } from '../models/ProjectModel';
import { ObjectId } from 'mongodb';
import UserModel from '../models/UserModel';
/**
 * the structure of this controller is such that any function that depends on validation of parameters should define BOTH 
 *      a handler function 
 *      and array of express-validator.ValidationChain functions
 */
const createProjectHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    let err = validationResult(req)
    if (err.isEmpty()){
        try{
            const project:IProject = { projectName:req.body.projectName}
            const projectService:ProjectService = Container.get(ProjectService)
            const userService:UserService = Container.get(UserService)
            if('owner' in req.body){
                project.owner = (await userService.findUserById(req.body.owner)).getSubset()
            }
            const projectDoc:IProjectDocument = await projectService.createProject(project)
            res.status(201).json({
                message:`Creaded project successfully`,
                id : projectDoc.id
            })
        }catch(e){
            res.status(404).json({message:'the referenced object id for "owner" could not be found'})
        }

    }else{
        res.status(400).json(err.mapped())
    }
}
const createProjectValidator:Array<ValidationChain>=[
    check('projectName').exists().isString().escape().trim(),
    check('owner').optional().isMongoId(),
    check('personnel').optional()
]
const getProjectHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    let err = validationResult(req)
    if (err.isEmpty()){
        try{
            const projectId:ObjectId = new ObjectId(req.params.id)
            const projectService:ProjectService = Container.get(ProjectService)
            const project = await projectService.findProjectById(projectId)
            if(!project){
                throw new Error('Project does not exist')
            }
            res.status(200).json(project)
        }catch(e){
            //console.error(e)
            res.status(404).send()
        }
    }else{
        res.status(400).json(err.mapped())
    }

}
const getProjectValidator:Array<ValidationChain> = [
    param('id').exists().isMongoId()
]

const getProjectsHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    let err = validationResult(req)
    if(err.isEmpty()){
        try{
            const project:Partial<IProject> = req.body
            const projectService:ProjectService = Container.get(ProjectService)
            const projects = await projectService.findProjects({...project})
            res.status(200).json(projects)
        }catch(e){
            //console.error(e)
            res.status(404).send()
        }
    }else{
        res.status(400).json(err.mapped())
    }
}
const getProjectsValidator:Array<ValidationChain> = [
    //TODO need to create custom validators for objects nested
]


const updateProjectHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    let err = validationResult(req)
    if(err.isEmpty()){
        const projectId:ObjectId = new ObjectId(req.params.id)
        const projectService:ProjectService = Container.get(ProjectService)
    
        const updates:any = {
        }
    
        try{
            if ('owner' in req.body){
                //TODO refactor this so that these DB changes can be made atomically
                projectService.changeOwner(new ObjectId(projectId),new ObjectId(req.body.owner))
            }
            if ('projectName' in req.body){
                updates.projectName = req.body.projectName
            }
            await projectService.updateProject(projectId,updates)
            res.status(204).json({message: `Project ${projectId} updated successfully`})
        }catch(e){
            //console.log(e)
            res.status(404).send('Resource was not found')
        }
    }else{
        res.status(400).json(err.mapped())
    }

}


const updateProjectValidator:Array<ValidationChain>=[
    param('id').exists().isMongoId(),
    body('projectName').optional().isString().trim().escape(),
    body('owner').optional().isMongoId()
]

const deleteProjectHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    let err = validationResult(req)
    if(err.isEmpty()){
        const projectId:ObjectId = new ObjectId(req.params.id)
        const projectService:ProjectService = Container.get(ProjectService)
        try{
            await projectService.deleteProject(projectId)
            res.status(204).send()
        }catch(e){
            res.status(404).send()
        }
    }else{
        res.status(400).json(err.mapped())
    }

}
const deleteProjectValidator:Array<ValidationChain>=[
    param('id').exists().isMongoId()
]

const addDeveloperHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    let err = validationResult(req)
    if (err.isEmpty()){
        const projectId:ObjectId = new ObjectId(req.params.projectId)
        const userId:ObjectId = new ObjectId(req.body.id)

        const projectService:ProjectService = Container.get(ProjectService)
        try{
            await projectService.addDeveloper(projectId,userId)
            res.status(201).send()
        }catch(e){
            //console.error(e)
            res.status(404).json({'error':e.message})
        }
    }else{
        res.status(400).json(err.mapped())
    }
}
const addDeveloperValidator:Array<ValidationChain>=[
    param('projectId').exists().isMongoId(),
    body('id').exists().isMongoId(),

]
const deleteDeveloperHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    let err = validationResult(req)
    if(err.isEmpty()){
        const projectId:ObjectId = new ObjectId(req.params.projectId)
        const userId:ObjectId = new ObjectId(req.params.userId)
    
        const projectService:ProjectService = Container.get(ProjectService)
        try{
            await projectService.removeDeveloper(projectId,userId)
            res.status(204).send()
        }catch(e){
            //console.error(e)
            res.status(404).json({'error':e.message})
        }
    }else{
        res.status(400).json(err.mapped())
    }
}
const deleteDeveloperValidator:Array<ValidationChain>=[
    param('projectId').exists().isMongoId(),
    param('userId').exists().isMongoId()
]

const addManagerHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    let err = validationResult(req)
    if(err.isEmpty()){
        const projectId:ObjectId = new ObjectId(req.params.projectId)
        const userId:ObjectId = new ObjectId(req.body.id)
    
        const projectService:ProjectService = Container.get(ProjectService)
        try{
            await projectService.addManager(projectId,userId)
            res.status(201).send()
        }catch(e){
            //console.error(e)
            res.status(404).json({'error':e.message})
        }
    }else{
        res.status(400).json(err.mapped())
    }
}
const addManagerValidator:Array<ValidationChain>=[
    param('projectId').exists().isMongoId(),
    body('id').exists().isMongoId(),

]
const deleteManagerHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    let err = validationResult(req)
    if(err.isEmpty()){
        const projectId:ObjectId = new ObjectId(req.params.projectId)
        const userId:ObjectId = new ObjectId(req.params.userId)
    
        const projectService:ProjectService = Container.get(ProjectService)
        try{
            await projectService.removeManager(projectId,userId)
            res.status(204).json({message:'Removed'})
        }catch(e){
            //console.error(e)
            res.status(404).json({'error':e.message})
        }
    }else{
        res.status(400).json(err.mapped())
    }
}
const deleteManagerValidator:Array<ValidationChain>=[
    param('projectId').exists().isMongoId(),
    param('userId').exists().isMongoId()
]



export default {
    createProject:{ handler:createProjectHandler , validator: createProjectValidator},
    updateProject:{ handler:updateProjectHandler , validator: updateProjectValidator},
    deleteProject: { handler:deleteProjectHandler, validator: deleteProjectValidator},
    getProject: { handler: getProjectHandler, validator: getProjectValidator },
    getProjects:{ handler: getProjectsHandler, validator: getProjectsValidator },
    addDeveloper:{handler:addDeveloperHandler,validator:addDeveloperValidator},
    deleteDeveloper :{handler:deleteDeveloperHandler,validator:deleteDeveloperValidator},
    addManager:{ handler:addManagerHandler, validator:addManagerValidator},
    deleteManager :{ handler:deleteManagerHandler, validator:deleteManagerValidator}

}
