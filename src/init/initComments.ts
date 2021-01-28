import CommentModel, { IComment, ICommentDocument } from '../models/CommentModel';

import faker from 'faker'
import TicketModel, { ITicketDocument } from '../models/TicketModel';

    const initComments:()=>void = async function(){
        console.log('creating fake Comments')

        let tickets:Array<ITicketDocument> = await TicketModel.find({}).exec()
        console.log('ffound tickets!')
        let comments: Array<IComment> = [];
        let fakeComment:(ticket:ITicketDocument)=>IComment = (ticket:ITicketDocument)=>{
            /**
             * 
    ticketId: {type: Types.ObjectId, ref:"Ticket", required:true },
    content:{type:String, required:true},
    author: UserSubsetSchema,
    parent: {type: Types.ObjectId, ref:"User" },
    children: [{type: Types.ObjectId, ref:"User" }]
             */
            const comment:IComment = {
                    ticketId: ticket.id,
                    content: faker.random.words(20),
                    author: ticket.assignedTo,

            }
            return comment
        }

        for (let ticket of tickets){
            console.log(ticket)
            comments.push(fakeComment(ticket))
        }
        
        await CommentModel.create(comments)
        await CommentModel.find({}).exec()

    }



export default initComments