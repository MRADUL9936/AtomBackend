import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import generateTokenAndSetCookie from "../utils/generateToken.js"

const loginUser=async(req,res)=>{
    
 try{
               
          const {email,password}=req.body;
          const user=await User.findOne({email});
        
          if(!user){
            return  res.status(400).json({Error: "user doesn't exist"})
         }

          const isPasswordCorrect=await bcrypt.compare(password,user.password || "")
          
          if(!isPasswordCorrect){
              
             return res.status(400).json({Error: "Invalid User and password"})
          }
           
          generateTokenAndSetCookie(user._id,res);
          console.log("login successfully")
          res.status(200).json("Success")

    }catch(err){
        console.log("error in login user")
        res.status(500).json({error:"Internal Server Error"})
    }

}

const signOutUser=(req,res)=>{

    try{
        res.cookie("ETest","",{maxAge:0});
        res.status(200).json({message:"logged out succcessfully"})
    }catch(err){
        console.log("error while loggingout",err.message);
        res.status(500).json({Error:"Internal server error"})
    }

}


const signUpUser=async (req,res)=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try{
        const {name,email,password,confirmPassword}=req.body;

        if(!emailRegex.test(email)){
            return res.status(400).json("Invalid Email format")
        }

        if(password!==confirmPassword){
            
            return res.status(400).json("Password doesn't match")
        }

        const user=await User.findOne({email})

        if(user){
            return res.status(400).json({error:"user already Exists"})
        }
       
        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,salt)
        
        const newuser=new User({
            name,
            email,
            password:hashPassword
        })

        if(newuser){
            await newuser.save()
            res.status(201).json({Success:"User created Successfully"});
           
        }else{
            res.status(400).json({error:"Invalid user data"})
        }
         

    }catch(err){
        console.log("Error SignUp user",err.message)
        res.status(500).json({Error:"Internal Server Error"})
    }


}

export {loginUser,signOutUser,signUpUser}