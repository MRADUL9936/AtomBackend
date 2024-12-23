import mongoose,{Schema} from 'mongoose'


const OrgSchema=new Schema({
    orgname:{type:String,required:true},
    orgemail:{type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    orgpassword:{type:String,
             required:true},
    orgTests:[{type:Schema.Types.ObjectId, ref:"Test"}]
},{
    timestamps:true
})


export const Orgnization=mongoose.model("Orgnization",OrgSchema)
