import supertest from 'supertest'
import app from '../../app'
import fs from 'fs'
import { connectDB } from '../../database'
import UserModel, {IUser, IUserDocument} from '../../models/UserModel'
import {ILogin} from '../../services/AuthService'
import { ObjectId} from 'mongodb'
import { IProjectDocument} from '../../models/ProjectModel'
import ProjectModel from '../../models/ProjectModel'
describe('ProjectController tests',()=>{
    let testData = JSON.parse(fs.readFileSync('testData.json').toString())
    const request = supertest(app)
    let testProject:IProjectDocument
    let token:String
    let testName = 'test project created in testinga;odjgoqrehgahergkjns'
    let userDocument:IUserDocument
    let user:IUser
    beforeAll(async ()=>{
        await connectDB(process.env.MONGO_STRING_TEST)
        user = testData.users[0];
        userDocument = await UserModel.findOne({email:user.email})
        testProject = await  ProjectModel.create({
            projectName:testName,
            owner: userDocument.getSubset(),
            personnel: {
                developers: userDocument.getSubset(),
                managers: userDocument.getSubset()
            }
        })
        let login:ILogin = {
            email: user.email,
            password: user.password
        }
        token = (await request.post('/api/v1/login').send(login).set('Accept', 'application/json')).body.token

    })

    describe('GET /projects/:id',()=>{
        test('Should get project successfully', async()=>{
            let response = await (request.get(`/api/v1/projects/${testProject.id}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(200)
        })
        test('Should ignore extra body params', async()=>{
            let response = await (request.get(`/api/v1/projects/${testProject.id}`).send({extraParam:'test'}).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(200)
        })
        test('Should return 400 if ID is malformed', async()=>{
            let response = await(request.get(`/api/v1/projects/notvalidlMongoID`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('Should return 404 if id is not a valid ref', async()=>{
            let response = await(request.get(`/api/v1/projects/${new ObjectId()}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
    })
    describe('GET /project',()=>{
        test('Should get projects successfully', async()=>{
            let response = await (request.get(`/api/v1/projects/`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(200)
        })
        test('Should ignore extra body params', async()=>{
            let response = await (request.get(`/api/v1/projects/`).send({testParam:'Test'}).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(200)
        })
    })
    describe('POST /projects',()=>{
        test('Should create project successfully', async()=>{
            let project ={
                projectName:testName,
                owner: userDocument.id
            }
            let response = await (request.post(`/api/v1/projects`).send(project).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(201)
        })
        test('Should return 400 if input is missing ProjectName', async()=>{
            let project ={
                owner: userDocument.id
            }
            let response = await (request.post(`/api/v1/projects`).send(project).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('Should return 404 if owner is nonexistent', async()=>{
            let project ={
                projectName:testName,
                owner: new ObjectId()
            }
            let response = await (request.post(`/api/v1/projects`).send(project).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
        test('Should return 400 if owner is invalid mongo ObjectId', async()=>{
            let project ={
                projectName:testName,
                owner: 'notamongoID'
            }
            let response = await (request.post(`/api/v1/projects`).send(project).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
    })
    describe('PUT /projects',()=>{
        test('Should update project successfully', async()=>{
            let update = {projectName:testProject.projectName}
            let response = await (request.put(`/api/v1/projects/${testProject._id}`).send(update).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(204)
        })
        test('Should ignore extra params', async()=>{
            let update = {projectName:testProject.projectName}
            let response = await (request.put(`/api/v1/projects/${testProject._id}`).send({...update, anotherrandmotestparam:'test'}).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(204)
        })
        test('Should return 404 if ID is invalid reference', async()=>{
            let update = {projectName:testProject.projectName}
            let response = await (request.put(`/api/v1/projects/${new ObjectId()}`).send(update).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
        test('Should return 400 if ID is malformed', async()=>{
            let update = {projectName:testProject.projectName}
            let response = await (request.put(`/api/v1/projects/malformedOID`).send(update).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
    })

    describe('POST /projects/:projectId/developers', ()=>{
        test('should add developer to project',async ()=>{
            let dev:IUserDocument = await UserModel.findOne({_id:{'$ne':testProject.owner.id}})
            let data = {id:dev.id}
            let response = await (request.post(`/api/v1/projects/${testProject.id}/developers`).send(data).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(201)
        })
        test('should return 400 if project id is malformed', async()=>{
            let dev:IUserDocument = await UserModel.findOne({_id:{'$ne':testProject.owner.id}})
            let data = {id:dev.id}
            let response = await (request.post(`/api/v1/projects/notaMongoId/developers`).send(data).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('should return 400 if user ID is malformed', async()=>{
            let data = {id:'notAMongoId'}
            let response = await (request.post(`/api/v1/projects/${testProject.id}/developers`).send(data).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('should return 404 if project id is invalid ref', async()=>{
            let dev:IUserDocument = await UserModel.findOne({_id:{'$ne':testProject.owner.id}})
            let data = {id:dev.id}
            let response = await (request.post(`/api/v1/projects/${new ObjectId()}/developers`).send(data).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
        test('should return 404 if user ID is invalid ref', async()=>{
            let data = {id:new ObjectId()}
            let response = await (request.post(`/api/v1/projects/${testProject.id}/developers`).send(data).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
    })
    describe('DELETE /projects/:projectId/developers/:userId', ()=>{
        test("should remove developer from project", async ()=>{
            let response = await (request.delete(`/api/v1/projects/${testProject.id}/developers/${testProject.personnel.developers[0].id}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(204)
        })
        test('should return 400 if project id is malformed', async()=>{
            let response = await (request.delete(`/api/v1/projects/notAMongoId/developers/${testProject.personnel.developers[0].id}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('should return 400 if user ID is malformed', async()=>{
            let response = await (request.delete(`/api/v1/projects/${testProject.id}/developers/notAMongoID`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('should return 404 if project id is invalid ref', async()=>{
            let response = await (request.delete(`/api/v1/projects/${new ObjectId()}/developers/${testProject.personnel.developers[0].id}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
        test('should return 404 if user ID is invalid ref', async()=>{
            let response = await (request.delete(`/api/v1/projects/${testProject.id}/developers/${new ObjectId()}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
    })
    describe('POST /projects/:projectId/managers', ()=>{
        test('should add manager to project', async()=>{
            let dev:IUserDocument = await UserModel.findOne({_id:{'$ne':testProject.owner.id}})
            let data = {id:dev.id}
            let response = await (request.post(`/api/v1/projects/${testProject.id}/managers`).send(data).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(201)
        })
        test('should return 400 if project id is malformed', async()=>{
            let dev:IUserDocument = await UserModel.findOne({_id:{'$ne':testProject.owner.id}})
            let data = {id:dev.id}
            let response = await (request.post(`/api/v1/projects/notaMongoId/managers`).send(data).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('should return 400 if user ID is malformed', async()=>{
            let data = {id:'notAMongoId'}
            let response = await (request.post(`/api/v1/projects/${testProject.id}/managers`).send(data).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('should return 404 if project id is invalid ref', async()=>{
            let dev:IUserDocument = await UserModel.findOne({_id:{'$ne':testProject.owner.id}})
            let data = {id:dev.id}
            let response = await (request.post(`/api/v1/projects/${new ObjectId()}/managers`).send(data).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
        test('should return 404 if user ID is invalid ref', async()=>{
            let data = {id:new ObjectId()}
            let response = await (request.post(`/api/v1/projects/${testProject.id}/managers`).send(data).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
    })
    describe('DELETE /projects/:projectId/managers/:userId', ()=>{
        test("should remove manager from project", async ()=>{
            let response = await (request.delete(`/api/v1/projects/${testProject.id}/managers/${testProject.personnel.developers[0].id}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(204)
        })
        test('should return 400 if project id is malformed', async()=>{
            let response = await (request.delete(`/api/v1/projects/notAMongoId/managers/${testProject.personnel.developers[0].id}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('should return 400 if user ID is malformed', async()=>{
            let response = await (request.delete(`/api/v1/projects/${testProject.id}/managers/notAMongoID`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('should return 404 if project id is invalid ref', async()=>{
            let response = await (request.delete(`/api/v1/projects/${new ObjectId()}/managers/${testProject.personnel.developers[0].id}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
        test('should return 404 if user ID is invalid ref', async()=>{
            let response = await (request.delete(`/api/v1/projects/${testProject.id}/managers/${new ObjectId()}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
    })
    describe('DELETE /projects',()=>{
        test('Should return 404 for invalid reference', async()=>{
            let response = await (request.delete(`/api/v1/projects/${new ObjectId()}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(404)
        })
        test('Should return 400 for invalid Id format', async()=>{
            let response = await (request.delete(`/api/v1/projects/notAMongoId`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(400)
        })
        test('Should delete project successfully', async()=>{
            let response = await (request.delete(`/api/v1/projects/${testProject.id}`).set('Accept', 'application/json').set('Authorization',`Bearer ${token}`))
            expect(response.status).toBe(204)
        })
    })
    afterAll(async ()=>{
        ProjectModel.deleteMany({title:testName})
    })
})