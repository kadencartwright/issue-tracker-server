import CommentModel, { IComment} from '../models/CommentModel';

import faker from 'faker'
import TicketModel, { ITicket } from '../models/TicketModel';

    const initComments:()=>void = async function(){
        console.log('creating fake Comments')

        let tickets:Array<ITicket> = await TicketModel.find({}).exec()
        console.log('ffound tickets!')
        let comments: Array<Partial<IComment>> = [];
        let fakeComment:(ticket:ITicket)=>Partial<IComment> = (ticket:ITicket)=>{
            const comment:Partial<IComment> =  {
                    ticketId: ticket.id,
                    content: faker.random.words(20),
                    author: ticket.assignedTo,

            }
            return comment
        }

        for (let ticket of tickets){
            let numComments = Math.floor(Math.random() * 10)+1;
            for (let i = 0; i< numComments; i++){
                comments.push(fakeComment(ticket))
            }
        }
        
        await CommentModel.create(comments)
        await CommentModel.find({}).exec()

    }



export default initComments