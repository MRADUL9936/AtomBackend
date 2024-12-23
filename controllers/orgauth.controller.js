// loginOrg,signUpOrg,signOutOrg

import {Orgnization} from "../models/org.model.js"
import bcrypt from 'bcrypt'
import generateTokenAndSetCookie from "../utils/generateToken.js"

const loginOrg=async(req,res)=>{
    
 try{
               
          const {orgemail,orgpassword}=req.body;
          const org=await Orgnization.findOne({orgemail});
        
          if(!org){
            return  res.status(400).json({Error: "org doesn't exist"})
         }

          const isPasswordCorrect=await bcrypt.compare(orgpassword,org.orgpassword || "")
          
          if(!isPasswordCorrect){
              
             return res.status(400).json({Error: "Invalid Organization and password"})
          }
           
          generateTokenAndSetCookie(org._id,res);
          console.log("login successfully")
          res.status(200).json({orgname:org.orgname,orgemail:org.orgemail})

    }catch(err){
        console.log("error in login Organization")
        res.status(500).json({error:"Internal Server Error"})
    }

}

const signOutOrg=(req,res)=>{

    try{
        res.cookie("ETest","",{maxAge:0});
        res.status(200).json({message:"logged out succcessfully"})
    }catch(err){
        console.log("error while loggingout",err.message);
        res.status(500).json({Error:"Internal server error"})
    }

}


const signUpOrg=async (req,res)=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try{
        const {orgname,orgemail,orgpassword,orgconfirmPassword}=req.body;

        if(!emailRegex.test(orgemail)){
            return res.status(400).json("Invalid Email format")
        }

        if(orgpassword!==orgconfirmPassword){
            
            return res.status(400).json("Password doesn't match")
        }

        const org=await Orgnization.findOne({orgemail})

        if(org){
            return res.status(400).json({error:"Organization already Exists"})
        }
       
        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(orgpassword,salt)
        
        const neworg=new Orgnization({
            orgname,
            orgemail,
            orgpassword:hashPassword,
            orgTests:[]
        })

        if(neworg){
            await neworg.save()
            res.status(201).json({Success:"Organization created Successfully"});
           
        }else{
            res.status(400).json({error:"Invalid Organization data"})
        }
         

    }catch(err){
        console.log("Error SignUp Organization",err.message)
        res.status(500).json({Error:"Internal Server Error"})
    }


}

export {loginOrg,signUpOrg,signOutOrg}