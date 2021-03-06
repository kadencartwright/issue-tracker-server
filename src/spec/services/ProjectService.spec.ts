import dotenv from 'dotenv'
import {Container} from 'typedi'
import ProjectService from '../../services/ProjectService'
import fs from 'fs'

import  ProjectModel, { IProject, IProjectDocument, IProjectModel} from '../../models/ProjectModel'
import { connectDB } from '../../database'
import { ObjectId } from 'mongodb'
import UserModel, { IUserDocument } from '../../models/UserModel'
describe('ProjectService tests', ()=>{

    let testProject:IProject
    let testProjectDoc:IProjectDocument
    let projectService = Container.get(ProjectService)
    dotenv.config()
    let data = JSON.parse(fs.readFileSync('testData.json').toString())
    let testDev:IUserDocument 

    
    beforeAll(async()=>{
        testProject = data.projects[0]
        await connectDB(process.env.MONGO_STRING_TEST)
        testDev= await UserModel.findOne({_id:{'$ne':testProject.owner.id}})
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
    describe('addDeveloper function tests',()=>{
        test('should add the developer', async()=>{
            let result:IProjectDocument
            let added:Boolean
            try{
                result = await projectService.addDeveloper(testProjectDoc.id,testDev.id)
                for (let dev of result.personnel.developers){
                    if (dev.id.equals(testDev.id)){
                        added = true
                    }
                }
            }catch(e){
                console.error(e)
            }

            expect(added).toBeTruthy()
        })
        test('Should throw error if dev exists already', async()=>{
            let error

            try{
                await projectService.addDeveloper(testProjectDoc.id,testProject.owner.id)

            }catch(e){
                error = e
            }
            expect(error).toBeTruthy()
        })
    })

    describe('removeDeveloper function tests',()=>{
        test('should remove the developer', async()=>{
            let result:IProjectDocument
            let added:Boolean = false
            try{
                result = await projectService.removeDeveloper(testProjectDoc.id,testDev.id)
                for (let dev of result.personnel.developers){
                    if (dev.id.equals(testDev.id)){
                        added = true
                    }
                }
            }catch(e){
                console.error(e)
            }

            expect(added).toBeFalsy()
        })
        test('Should throw error if dev does not exist', async()=>{
            let error

            try{
                await projectService.removeDeveloper(testProjectDoc.id,testProject.owner.id)

            }catch(e){
                error = e
            }
            expect(error).toBeTruthy()
        })
    })
    describe('addManager function tests',()=>{
        test('should add the manager', async()=>{
            let result:IProjectDocument
            let added:Boolean
            try{
                result = await projectService.addManager(testProjectDoc.id,testDev.id)
                for (let manager of result.personnel.managers){
                    if (manager.id.equals(testDev.id)){
                        added = true
                    }
                }
            }catch(e){
                console.error(e)
            }

            expect(added).toBeTruthy()
        })
        test('Should throw error if manager exists already', async()=>{
            let error

            try{
                await projectService.addManager(testProjectDoc.id,testProject.owner.id)

            }catch(e){
                error = e
            }
            expect(error).toBeTruthy()
        })
    })

    describe('removeManager function tests',()=>{
        test('should remove the manager', async()=>{
            let result:IProjectDocument
            let exists:Boolean = false
            try{
                result = await projectService.removeManager(testProjectDoc.id,testProject.personnel.managers[0].id)
                for (let manager of result.personnel.managers){
                    if (manager.id.equals(testDev.id)){
                        exists = true
                    }
                }
            }catch(e){
                console.error(e)
            }

            expect(exists).toBeFalsy()
        })
        test('Should throw error if manager does not exist', async()=>{
            let error

            try{
                await projectService.removeManager(testProjectDoc.id,testProject.owner.id)

            }catch(e){
                error = e
            }
            expect(error).toBeTruthy()
        })
    })
    describe("changeOwner function tests",()=>{
        test('Should change owner',async()=>{
            let result:IProjectDocument
            try{
                result = await projectService.changeOwner(testProjectDoc.id,testDev.id)
            }catch(e){
                console.error(e)
            }
            expect(result.owner.id.equals(testDev.id)).toBeTruthy()
        })
        test('Should throw error if user is already owner',async()=>{
            let error = {}
            try{
                await projectService.changeOwner(testProjectDoc.id,testDev.id)
            }catch(e){
                error = e
            }
            expect(error).toBeTruthy()
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