import ProjectModel, { IProject} from '../models/ProjectModel';
import faker from 'faker'
import UserModel, { IUserDocument } from '../models/UserModel'
import { IUserSubset } from '../models/SubsetSchemas';

    const initProjects:()=>void = async function(){
        console.log('creating fake Projects')
        let users:Array<IUserDocument> = await UserModel.find({}).exec()
        let projects: Array<Partial<IProject>> = [];
        let fakeProject:(subset:IUserSubset)=>Partial<IProject> = (subset:IUserSubset)=>{
            
            const project:Partial<IProject> = {
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
            projects.push(fakeProject({id:user.id,name:user.name}))
        }
        await ProjectModel.create(projects)

        return projects
    }



export default initProjects