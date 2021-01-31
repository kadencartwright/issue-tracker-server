import {Router, Request, Response} from 'express'
import AuthController from '../controllers/AuthController'
import CommentController from '../controllers/CommentController'
import UserController from '../controllers/UserController'
const router:Router = Router();
const apiRouter:Router = Router();
//use apiRouter as an abstraction for the `/api/v1` prefix so we only have to write it once
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


export default router