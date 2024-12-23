import { schedule } from 'node-cron';
import Submission from '../models/submission.model.js';
import User from '../models/user.model.js';
import Question from '../models/question.model.js';
import {transporterFromEmailAuth, sendMail} from '../Services/mail.service.js'
import { Test } from '../models/test.model.js';
// Cron job that runs every hour
schedule('*/30 * * * *', async () => {
  console.log('Running cron job to evaluate tests...');

  try {
    // Retrieve all ungraded submissions
    const ungradedSubmissions = await Submission.find({ isDeleted: false});
    const transporter=transporterFromEmailAuth()       ///create the transport for sending emails
    
    if(ungradedSubmissions.length==0){
     console.log("no new submissions")
     return;
    } 
    for (const submission of ungradedSubmissions) {
      const { testId, userId, selections } = submission;

      // Logic to evaluate the test based on selections
      const test=await Test.findById(testId); ///Get the testNameWith TestID
      const testName=test.title
      const score =await evaluateTest(selections); //get the score
     
      // Mark the submission as graded and store the score
       submission.isDeleted = true;
       await submission.save();

      // Send email to the user with the score
      const user = await User.findById(userId);
       
////////////////////// user Mail Server here to send mail ///////////////////////////////////
        await sendMail(transporter,testName,score,user.email)
    }
    console.log("Cron job Completed")
  } catch (error) {
    console.error('Error:: jobs/cronJob.jobs.js ::', error.message);
    res.status(500).json({Error:"Internal Server Error"})
  }
});

// Function to evaluate test (sample)
const evaluateTest = async (selections) => {
  let score = 0;

  // Use map to create an array of promises
  const results = await Promise.all(selections.map(async (selection) => {
    const question = await Question.findOne({ _id: selection.questionId });
    if (selection.option === question.correctOption) {
      return question.marks; // Return marks if correct
    }
    return 0; // Return 0 if incorrect
  }));

  // Sum up all the results to get the final score
  score = results.reduce((total, marks) => total + marks, 0);

  console.log(score); // Log the final score
  return score;
};
