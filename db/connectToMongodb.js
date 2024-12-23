import mongoose from 'mongoose'

export const connectToMongoDb=async ()=>{
    try{
       await mongoose.connect(process.env.MONGODBURI)
        console.log("Mongodb connected")
    }catch(err){
      throw err
    }
}