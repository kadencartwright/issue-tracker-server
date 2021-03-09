import CommentModel, { IComment} from '../models/CommentModel';

import faker from 'faker'
import TicketModel, { ITicketDocument } from '../models/TicketModel';

    const initComments:()=>void = async function(){
        console.log('creating fake Comments')

        let tickets:Array<ITicketDocument> = await TicketModel.find({}).exec()
        console.log('found tickets!')
        let comments: Array<Partial<IComment>> = [];
        let fakeComment:(ticket:ITicketDocument)=>Partial<IComment> = (ticket:ITicketDocument)=>{
            const comment:Partial<IComment> =  {
                    ticketId: ticket.id,
                    content: faker.random.words(20),
                    author: ticket.assignedTo
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
        return comments
    }



export default initComments