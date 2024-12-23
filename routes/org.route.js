import express from 'express';
import {getAlltests,getTestsData,deleteTests,createTest,addDatatoTest} from '../controllers/org.controller.js'
import {protectOrgRoute} from '../middleware/protectRoot.js';
const router=express.Router()

router.route('/getAlltests').get(protectOrgRoute,getAlltests)
router.route('/getTestData/:testId').get(protectOrgRoute,getTestsData)
router.route('/deleteTest/:testId').delete(protectOrgRoute,deleteTests)
router.route('/createTest').post(protectOrgRoute,createTest)
router.route('/addDataToTest/:testId').post(protectOrgRoute,addDatatoTest)

// router.route('/getAlltests').get(getAlltests)
// router.route('/getTest/:testId').get(getTestsData)
// router.route('/deleteTest/:testId').delete(deleteTests)
// router.route('/createTest').post(createTests)
// router.route('/addDataToTest/:testId').post(addDatatoTest)


export default router;
