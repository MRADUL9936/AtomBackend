import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie=(userId,res)=>{

  const token= jwt.sign({userId}, process.env.JWTSECRET
    ,{expiresIn:'30d'});
    
    res.cookie("ETest", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: false, // Prevent JavaScript access to cookies
      secure: process.env.NODE_ENV === 'production', // Use 'secure' in production only
      sameSite: 'None', // Allows cross-origin cookies (important for CORS)
    });
        console.log("cookies set successfully")
}

export default generateTokenAndSetCookie;