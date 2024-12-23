import express from 'express';
import {loginUser,signOutUser,signUpUser} from '../controllers/auth.controller.js'

const router=express.Router()

router.route('/login').post(loginUser)
router.route('/signup').post(signUpUser)
router.route('/signout').post(signOutUser)


export default router;

