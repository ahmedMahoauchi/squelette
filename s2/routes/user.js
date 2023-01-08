import express from 'express'

import {
    signUp,
    signin,
    getAllUsers,
    putOnce
    
    
} from '../controllers/user.js'

const router = express.Router();


router.route('/user/signUp').post(signUp)
router.route('/user/login').post(signin)
router.route('/user/users').get(getAllUsers)
router.route('/user/update/:id').put(putOnce)


export default router