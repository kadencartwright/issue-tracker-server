import {Router, Request, Response} from 'express'
import AuthController from '../controllers/AuthController'
import CommentController from '../controllers/CommentController'
import UserController from '../controllers/UserController'
import ProjectController from '../controllers/ProjectController'
import TicketController from '../controllers/TicketController'
import * as ejp from 'express-jwt-permissions'
const router:Router = Router();
const apiRouter:Router = Router();
//use apiRouter as an abstraction for the `/api/v1` prefix so we only have to write it once
export const openRoutes = [
    "/api/v1/login",
    "/"
]
router.use('/api/v1',apiRouter)


router.get('/', (req:Request,res:Response)=>{
    res.send('running!')
})
//login route
apiRouter.post('/login', AuthController.login.validator, AuthController.login.handler)
//comment crud routes
apiRouter.get('/comments/:id', CommentController.getComment.handler)
apiRouter.post('/comments',CommentController.createComment.validator, CommentController.createComment.handler)
apiRouter.put('/comments', CommentController.updateComment.validator, CommentController.updateComment.handler)
apiRouter.delete('/comments/:id', CommentController.deleteComment.validator, CommentController.deleteComment.handler)

//user crud routes

apiRouter.get('/users/:id',UserController.getUser.validator,UserController.getUser.handler)
apiRouter.post('/users',UserController.createUser.validator,UserController.createUser.handler)
apiRouter.put('/users',UserController.updateUser.validator,UserController.updateUser.handler)
apiRouter.delete('/users/:id',UserController.deleteUser.validator,UserController.deleteUser.handler)

//project crud routes
apiRouter.get('/projects',ProjectController.getProjects.validator,ProjectController.getProjects.handler)
apiRouter.get('/projects/:id',ProjectController.getProject.validator,ProjectController.getProject.handler)
apiRouter.post('/projects',ProjectController.createProject.validator,ProjectController.createProject.handler)
apiRouter.put('/projects',ProjectController.updateProject.validator,ProjectController.updateProject.handler)
apiRouter.delete('/projects/:id',ProjectController.deleteProject.validator,ProjectController.deleteProject.handler)

//ticket crud routes

apiRouter.get('/tickets/:id',TicketController.getTicket.validator,TicketController.getTicket.handler)
apiRouter.post('/tickets',TicketController.createTicket.validator,TicketController.createTicket.handler)
apiRouter.put('/tickets',TicketController.updateTicket.validator,TicketController.updateTicket.handler)
apiRouter.delete('/tickets/:id',TicketController.deleteTicket.validator,TicketController.deleteTicket.handler)

//self routes
apiRouter.get('/me')
apiRouter.get('/me/tickets')
apiRouter.get('/me/projects')

export default router