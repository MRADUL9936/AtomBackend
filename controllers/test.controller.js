import { Test } from "../models/test.model.js";
import Submission from "../models/submission.model.js";
import User from "../models/user.model.js";
import {setTestData,getTestData} from "../cache/cacheWithRedis.js"

const getTests = async (req, res) => {
  try {
    const user = req.user; // Assuming `req.user` contains the logged-in user data from authentication middleware

    if (!user || !user.accessibleTests || !Array.isArray(user.accessibleTests)) {
      return res.status(403).json({ Error: "No accessible tests found for the user" });
    }

    // Fetch the tests assigned to the user
    const tests = await Test.find({ _id: { $in: user.accessibleTests } }).select("-questions");

    if (!tests || tests.length === 0) {
      return res.status(404).json({ Error: "No Tests Present" });
    }

    res.status(200).json(tests);
  } catch (err) {
    console.log("Error getTests::test.controller.js ", err.message);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

const getTestsAndQuestions = async (req, res) => {
  try {
   
    const testId = req.params.testId; //get the testId from frontend
    let testData = ""; // Use let for variable that will be reassigned

// Check if testData is already cached
const cachedData = await getTestData(testId); // Fetch cached data

if (!cachedData) { // If there is no cached data
    // Fetch from the database
    testData = await Test.findById(testId).populate({
        path: "questions",
        select: "-correctOption", // Exclude correctOption field
    });

    // Cache the fetched data, ensure testId is a string
    await setTestData(testId, JSON.stringify(testData));
} else {
    // Use the cached data
    testData = JSON.parse(cachedData);
}

    if (!testData) {
      res.status(404).json({ Error: "No Such test Present" });
    }
    res.status(200).json({ Questions: testData.questions });
  } catch (err) {
    console.log("Error getTestsAndQuestions::test.controller.js ", err.message);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

const submitTest = async (req, res) => {
  try {
    const { email, testId } = req.query;
    // const {selections,endedAt}=req.body
    const user = await User.findOne({ email });
    const userId = user._id;

    const answers = req.body.answers;
    //format the answers to the required answers format
    const selections = answers.map(({ questionId, answer }) => ({
      questionId, // Assuming this is already in the correct format
      option: answer, // Rename 'answer' to 'option'
      savedAt: new Date() // Add current date/time
    }));


    const newsubmission = new Submission({
      testId,
      userId,
      selections,
      endedAt: null,
      isDeleted: false,
    });
    await newsubmission.save();

    res
      .status(200)
      .json({ Success: true, message: "Test Submitted Successfully" });
  } catch (err) {
    console.log("Error :test.controller.js::submitTest", err.message);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

export { getTests, getTestsAndQuestions, submitTest };
