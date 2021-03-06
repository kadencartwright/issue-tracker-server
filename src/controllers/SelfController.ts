import { Request,Response } from 'express';
import {Container} from 'typedi'
import {body, check,header,param,ValidationChain} from 'express-validator'
import ProjectService from '../services/ProjectService';
import { IProject} from '../models/ProjectModel';
import { ObjectId } from 'mongodb';
/**
 * the structure of this controller is such that any function that depends on validation of parameters should define BOTH 
 *      a handler function 
 *      and array of express-validator.ValidationChain functions
 */
const getSelfProjectsHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    try{
        const userId:ObjectId = new ObjectId(req["user"].id)
        const projectService:ProjectService = Container.get(ProjectService)
        const project = await projectService.findProjects({})
        res.status(200).json(project)
    }catch(e){
        //console.error(e)
        res.status(404).send()
    }
}
const getSelfProjectsValidator:Array<ValidationChain>=[
//no validation needed
]

const getSelfTicketsHandler:(req:Request,res:Response)=>void = async(req:Request,res:Response)=>{
    try{
        const projectId:ObjectId = new ObjectId(req.params.id)
        const projectService:ProjectService = Container.get(ProjectService)
        const project = await projectService.findProjectById(projectId)
        res.status(200).json(project)
    }catch(e){
        //console.error(e)
        res.status(404).send()
    }
}
const getSelfTicketsValidator:Array<ValidationChain>=[
    //no validation needed
]



export default {
    getSelfProjects:{ handler:getSelfProjectsHandler , validator: getSelfProjectsValidator},
    getSelfTickets:{ handler:getSelfTicketsHandler , validator: getSelfTicketsValidator},

}