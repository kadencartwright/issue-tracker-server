
import { Request,Response } from 'express';
import {Container} from 'typedi'
import {body, check,param,ValidationChain} from 'express-validator'
import ProjectService from '../services/ProjectService';
import { IProject } from '../models/ProjectModel';
import { ObjectId } from 'mongodb';
/**
 * the structure of this controller is such that any function that depends on validation of parameters should define BOTH 
 *      a handler function 
 *      and array of express-validator.ValidationChain functions
 */
const createProjectHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const project:IProject = req.body
    const projectService:ProjectService = Container.get(ProjectService)
    const projectDoc:IProject = await projectService.createProject(project)
    res.json(projectDoc)
}
const createProjectValidator:Array<ValidationChain>=[
    check('email').exists().isEmail().normalizeEmail().trim(),
    check('name').exists().isAlphanumeric().trim(),
    check('password').exists().isLength({max:256,min:8}).trim().escape()
]
const getProjectHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    try{
        const projectId:ObjectId = new ObjectId(req.params.id)
        const projectService:ProjectService = Container.get(ProjectService)
        const project = await projectService.findProjectById(projectId)
        res.status(200).json(project)
    }catch(e){
        console.error(e)
        res.status(404).send()
    }
}
const getProjectValidator:Array<ValidationChain> = [
    param('id').exists().isMongoId()
]

const getProjectsHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    try{
        const project:Partial<IProject> = req.body
        const projectService:ProjectService = Container.get(ProjectService)
        const projects = await projectService.findProjects({...project})
        res.status(200).json(projects)
    }catch(e){
        console.error(e)
        res.status(404).send()
    }
}
const getProjectsValidator:Array<ValidationChain> = [
    //TODO need to create custom validators for objects nested
]


const updateProjectHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const projectId:ObjectId = req.body.projectId

    const updates:Partial<IProject> = {
    }
    req.body.personnel ? updates.personnel = req.body.name: null ;
    req.body.projectName ? updates.projectName = req.body.email: null ;
    req.body.owner ? updates.owner= req.body.password: null ;
    
    const projectService:ProjectService = Container.get(ProjectService)
    try{
        await projectService.updateProject(projectId,updates)
        res.status(204).send()
    }catch(e){
        console.log(e)
        res.status(404).send('Resource was not found')
    }
}

const updateProjectValidator:Array<ValidationChain>=[
    body('email').optional().isEmail().normalizeEmail().trim().optional(),
    body('name').optional().isAlphanumeric().trim(),
    body('password').optional().isLength({max:256,min:8}).trim().escape(),
    param('projectId').exists().isMongoId(),
]

const deleteProjectHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    const projectId:ObjectId = new ObjectId(req.params.id)
    const projectService:ProjectService = Container.get(ProjectService)
    try{
        await projectService.deleteProject(projectId)
        res.status(200).send()
    }catch(e){
        console.error(e)
        res.status(404).send()
    }
}
const deleteProjectValidator:Array<ValidationChain>=[
    param('projectId').exists().isMongoId()
]




export default {
    createProject:{ handler:createProjectHandler , validator: createProjectValidator},
    updateProject:{ handler:updateProjectHandler , validator: updateProjectValidator},
    deleteProject: { handler:deleteProjectHandler, validator: deleteProjectValidator},
    getProject: { handler: getProjectHandler, validator: getProjectValidator },
    getProjects:{ handler: getProjectsHandler, validator: getProjectsValidator },
}
