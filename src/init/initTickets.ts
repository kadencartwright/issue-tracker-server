import TicketModel, { ITicket} from '../models/TicketModel';
import faker from 'faker'
import UserModel from '../models/UserModel'
import ProjectModel, { IProjectDocument } from '../models/ProjectModel';
import { Types } from 'mongoose';
import { IUserSubset } from '../models/SubsetSchemas';

    const initTickets:()=>void = async function(){
        console.log('creating fake Tickets')
        let users = await UserModel.find({}).exec()
        let projects:Array<IProjectDocument> = await ProjectModel.find({}).exec()
        let tickets: Array<ITicket> = [];

        let fakeTicket:(subset:IUserSubset, projectId:Types.ObjectId)=>ITicket = (subset:IUserSubset,projectId:Types.ObjectId)=>{
            const ticket:ITicket = {
                    title: faker.random.words(2),
                    assignedTo: subset,
                    projectId: projectId,
                    description: faker.random.words(25)
            }
            return ticket
        }
        
        for (let i = 0; i<10;i++){
            for (let project of projects){
                tickets.push(fakeTicket(project.owner,project.id))
            }
        }
        await TicketModel.create(tickets)
        return tickets
        
    }



export default initTickets