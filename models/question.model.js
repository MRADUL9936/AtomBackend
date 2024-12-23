import mongoose,{Schema} from 'mongoose';

const QuestionSchema=new mongoose.Schema({
   question:{type:String,
            required:true},
   options:[{type:String}],
   testId:{
         type:Schema.Types.ObjectId,
         ref:"Test"
         },
   marks:{type:Number},
   correctOption:{type:String,
               required:true},
},{
    timestamps:true
})

const Question=mongoose.model("Question",QuestionSchema)
export default Question