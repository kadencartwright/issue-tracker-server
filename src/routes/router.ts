import {Router, Request, Response} from 'express'
import authController from '../controllers/authController'
const router:Router = Router();
const apiRouter:Router = Router();
//use apiRouter as an abstraction for the `/api/v1` prefix so we only have to write it once
router.use('/api/v1',apiRouter)


router.get('/', (req:Request,res:Response)=>{
    res.send('running!')
})

apiRouter.post('/login', authController.login.validator, authController.login.handler)


export default router