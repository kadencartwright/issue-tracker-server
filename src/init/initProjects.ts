import ProjectModel, { IProject, IProjectDocument } from '../models/ProjectModel';
import faker from 'faker'
import UserModel, { IUserDocument, IUserSubset } from '../models/UserModel'

    const initProjects:()=>void = async function(){
        console.log('creating fake Projects')
        let users:Array<IUserDocument> = await UserModel.find({}).exec()
        let projects: Array<IProject> = [];
        let fakeProject:(subset:IUserSubset)=>IProject = (subset:IUserSubset)=>{
            
            const project:IProject = {
                    projectName: faker.random.words(2),
                    owner: subset,
                    personnel:{
                        managers:[subset],
                        developers:[subset]
                    }
    
            }
            return project
        } 
        for (let user of users){
            projects.push(fakeProject({userId:user.id,name:user.name}))
        }
        await ProjectModel.create(projects)
        await ProjectModel.find({}).exec()
        
    }



export default initProjects