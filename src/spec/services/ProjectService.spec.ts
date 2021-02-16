import dotenv from 'dotenv'
import {Container} from 'typedi'
import ProjectService from '../../services/ProjectService'
import fs from 'fs'

import  ProjectModel, { IProject, IProjectDocument, IProjectModel} from '../../models/ProjectModel'
import { connectDB } from '../../database'
import { ObjectId } from 'mongodb'
import UserModel from '../../models/UserModel'
describe('ProjectService tests', ()=>{

    let testProject:IProject
    let testProjectDoc:IProjectDocument
    let projectService = Container.get(ProjectService)
    dotenv.config()
    let data = JSON.parse(fs.readFileSync('testData.json').toString())
    
    beforeAll(async()=>{
        testProject = data.projects[0]
        await connectDB(process.env.MONGO_STRING_TEST)
    })
    describe('createProject() tests', ()=>{

        test('should create the project',async ()=>{
            testProjectDoc = await projectService.createProject(testProject)
            expect(testProjectDoc).toBeTruthy()
        })
        test('should throw error if input is undefined',async ()=>{
            let error
            try{
                await projectService.createProject(null)
            }catch(e){
                error = e
            }
            expect(error).toBeTruthy();
        })
    })

    describe('findProjectById() tests',()=>{
        test('should find project by valid ID', async()=>{
            let project:IProjectDocument
            let projectToFind:IProjectDocument
            try{   
                projectToFind = await ProjectModel.findOne({})
                project = await projectService.findProjectById(projectToFind.id)
            }catch(e){
                console.log(e)
            }
            expect(project).toBeTruthy();
        })
    })
    describe('findProjects() tests',()=>{
        test('should find project by valid ID', async()=>{
            let projects:IProjectDocument[]
            let projectToFind:IProjectDocument
            try{   
                projectToFind = await ProjectModel.findOne({})
                projects = await projectService.findProjects({projectName:projectToFind.projectName})
            }catch(e){
                console.log(e)
            }
            expect(projects).toBeTruthy();
        })
    })



    describe('updateProject() tests',()=>{
        test('should update ticket by valid ID',async()=>{
            let project: IProjectDocument
            let testString:String = 'test string'
            try{
                await projectService.updateProject(testProjectDoc.id,{projectName:testString})
                project = await projectService.findProjectById(testProjectDoc.id)
            }catch(e){
                console.log(e)
            }
            expect(project.projectName).toEqual(testString)
        })
    })
    describe('deleteProject function Tests', ()=>{
        let result
        test('should delete the project',async ()=>{
            result = await projectService.deleteProject(testProjectDoc.id)
            expect(result).toBeTruthy()
        })
    
        test('should return error if the project does not exist',async ()=>{
            let err = {}
            try{
                result = await projectService.deleteProject(new ObjectId('1234567890'))
            }catch(e){
                err = e
            }
            expect(err).toBeTruthy()
        })
        test('should return error if the project id is null',async ()=>{
            let err = {}
            try{
                result = await projectService.deleteProject(null)
            }catch(e){
                err = e
            }
            expect(err).toBeTruthy()
        })
    })
})