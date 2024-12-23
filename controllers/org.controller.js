
import {Orgnization} from "../models/org.model.js"
import { Test } from "../models/test.model.js";
import User from "../models/user.model.js";
import Question from "../models/question.model.js";

const getAlltests = async (req, res) => {
  try {
    const orgnization = await Orgnization.findById(req.org._id).populate({
      path: "orgTests",
      select: "-questions -testUser", // Exclude "questions" and "testUser"
    });

    if (!orgnization || !orgnization.orgTests.length) {
      return res.status(404).json({ Error: "No Test Present" });
    }
    res.status(200).json(orgnization.orgTests);
  } catch (err) {
    console.log("Error getTests::org.controller.js ", err.message);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

const getTestsData = async (req, res) => {
    try {
      const testId = req.params.testId; // Get the testId from frontend
  
      // Fetch test data with populated questions and testUser
      const testData = await Test.findById(testId)
        .populate({
          path: "questions",
        })
        .populate({
          path: "testUser",
          select: "name email", // Include only required fields from User model
        });
  
      if (!testData) {
        return res.status(404).json({ Error: "No Such Test Present" });
      }
  
      // Return both questions and user data
      res.status(200).json({
        Questions: testData.questions,
        TestUsers: testData.testUser,
      });
    } catch (err) {
      console.log("Error getTestsData::org.controller.js ", err.message);
      res.status(500).json({ Error: "Internal Server Error" });
    }
  };
///delete testData
  const deleteTests = async (req, res) => {
    try {
      const testId = req.params.testId; // Get the testId from params
  
      // Find the test and mark it as deleted
      const test = await Test.findById(testId);
  
      if (!test) {
        return res.status(404).json({ Error: "Test not found" });
      }
  
      if (test.isDeleted) {
        return res.status(400).json({ Error: "Test is already deleted" });
      }
  
      test.isDeleted = true; // Mark test as deleted
      await test.save(); // Save the updated test
  
      res.status(200).json({ Message: "Test deleted successfully" });
    } catch (err) {
      console.log("Error deleteTests::org.controller.js ", err.message);
      res.status(500).json({ Error: "Internal Server Error" });
    }
  };

  const createTest = async (req, res) => {
    try {
      const { title, description,duration } = req.body;
      const orgId = req.org._id; // Assuming orgId is passed in the request, e.g., from middleware or token
  
      // Validate required fields
      if (!title || !description || !duration) {
        return res.status(400).json({ Error: "Title and Description are required" });
      }
  
      // Fetch the organization
      const organization = await Orgnization.findById(orgId);
      if (!organization) {
        return res.status(404).json({ Error: "Organization not found" });
      }
  
      // Create a new test
      const newTest = new Test({
        title,
        description,
        isDeleted: false, // Default value for new tests
        duration,
        questions: [],
        testUser: [],
      });
  
      // Save the test to the database
      const savedTest = await newTest.save();
  
      // Add the test ID to the organization's orgTests array
      organization.orgTests.push(savedTest._id);
      await organization.save();
  
      // Construct the response with the required fields
      const responseTest = {
        _id: savedTest._id,
        title: savedTest.title,
        description: savedTest.description,
        duration: savedTest.duration,
        isDeleted: savedTest.isDeleted,
        createdAt: savedTest.createdAt,
        updatedAt: savedTest.updatedAt,
        __v: savedTest.__v,
      };
  
      res.status(201).json(responseTest);
    } catch (err) {
      console.log("Error createTests::org.controller.js ", err.message);
      res.status(500).json({ Error: "Internal Server Error" });
    }
  };
  

  //addDatatoTest
  const addDatatoTest = async (req, res) => {
    try {
      const testId = req.params.testId;
      const { questions, users } = req.body; // Questions and Users data from the request body
  
      // Validate input
      if ((!questions || !Array.isArray(questions) || questions.length === 0) &&
      (!users || !Array.isArray(users) || users.length === 0)) {
        return res.status(400).json({ Error: "Questions are required" });
      }
      
  
      // Fetch the test
      const test = await Test.findById(testId);
      if (!test || test.isDeleted) {
        return res.status(404).json({ Error: "Test not found or is deleted" });
      }
  
      // Add questions to the database and associate them with the test
      const questionIds = [];
      for (const question of questions) {
        const newQuestion = new Question({
          ...question,
          testId: testId, // Associate question with the test
        });
        const savedQuestion = await newQuestion.save();
        questionIds.push(savedQuestion._id); // Collect question IDs
      }
  
      // Update test with new questions
      test.questions = [...test.questions, ...questionIds];
  
      // Add users who can access the test
      const validUserIds = [];
      for (const email of users) {
        const user = await User.findOne({ email });
        console.log(user)
        if (user && !user.isDeleted) {
          // Add testId to user's accessibleTests array if not already present
          if (!user.accessibleTests.includes(testId)) {
            user.accessibleTests.push(testId);
            await user.save(); // Save updated user
          }
          // Add userId to test's testUser array if not already present
          if (!test.testUser.includes(user._id)) {
            validUserIds.push(user._id);
          }
        }
      }
  
      test.testUser = [...test.testUser, ...validUserIds];
  
      // Save updated test
      await test.save();
  
      res.status(200).json({
        Message: "Test data updated successfully",
        UpdatedTest: test,
      });
    } catch (err) {
      console.log("Error addDatatoTest::test.controller.js ", err.message);
      res.status(500).json({ Error: "Internal Server Error" });
    }
  };
  
  



export {getAlltests,getTestsData,deleteTests,createTest,addDatatoTest};
