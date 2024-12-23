import express from 'express';
import {loginOrg,signUpOrg,signOutOrg} 
             from '../controllers/orgauth.controller.js'

const router=express.Router()

router.route('/login').post(loginOrg)
router.route('/signup').post(signUpOrg)
router.route('/signout').post(signOutOrg)

export default router;
