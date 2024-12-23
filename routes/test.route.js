import express from 'express';
import {getTests,getTestsAndQuestions,submitTest} from '../controllers/test.controller.js'
import {protectRoute} from '../middleware/protectRoot.js'
const router=express.Router()

router.route('/').get(protectRoute,getTests)
router.route('/:testId').get(protectRoute,getTestsAndQuestions)
router.route('/submit').post(protectRoute,submitTest)


export default router;
