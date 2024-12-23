import mongoose,{Schema} from 'mongoose'


const TestSchema=new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    questions:[{
             type:Schema.Types.ObjectId,
             ref:"Question"
              }],
    duration:{type:Number,required:true},
    isDeleted:{type:Boolean,required:true},
    testUser:[{type:Schema.Types.ObjectId, ref:"User"}]
    
},{
    timestamps:true
})


export const Test=mongoose.model("Test",TestSchema)