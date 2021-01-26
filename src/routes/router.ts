import {Router, Request, Response} from 'express'
import AuthController from '../controllers/AuthController'
import CommentController from '../controllers/CommentController'
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
apiRouter.delete('/comments', CommentController.deleteComment.validator, CommentController.deleteComment.handler)

//user crud routes
apiRouter.get('/users/:id',)


export default router