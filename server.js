import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { connectToMongoDb } from './db/connectToMongodb.js';
import authrouter from './routes/auth.route.js'
import testroute from './routes/test.route.js'
import orgroute from './routes/org.route.js'
import orgauthroute from './routes/orgauth.route.js'

import './jobs/cronJob.jobs.js'

dotenv.config()
const app=express()
const whitelist = ['http://localhost:5173','https://etest.mradulvishwakarma.com'];

// Configure the CORS middleware
app.use(cors({
  origin: whitelist,
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  credentials: true, // Allow sending cookies from the browser
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

// Enable preflight response for all routes
app.options('*', cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/user",authrouter)
app.use("/test",testroute)
app.use("/org/auth",orgauthroute)
app.use("/org",orgroute)



connectToMongoDb().then(()=>{
    app.listen(process.env.PORT||3000,()=>{
    console.log(`server is listening on port ${process.env.PORT}`);
})
}).catch((err)=>{
    console.log("error connecting to database",err.message)
})