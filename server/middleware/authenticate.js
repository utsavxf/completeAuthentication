const jwt=require('jsonwebtoken');
const userdb=require('../models/userSchema');
const keysecret="utsavbhardwajutsavbhardwajutsavu"


//next()
{
   /*if we dont write next then controls will not be forwarded to the next middleware function
    and client will have to wait indefinitely waiting for a response
    
    ->so in functions where you don't want to send a response use the next() parameter*/ 
}

const authenticate=async(req,res,next)=>{
     try {
        
        const token=req.headers.authorization
        console.log(token);


        //now we have recieved the token from the header of an http request( not same as the url)
        
       const verifytoken =jwt.verify(token,keysecret);
    //    console.log(verifytoken);
    //now listen verify karne par ek id mili hai jo humne startng me as a payload bheji thi


    const rootUser=await userdb.findOne({_id:verifytoken._id})


    if(!rootUser){throw new Error("user not found")}

    req.token=token;
    req.rootUser=rootUser;
    req.userId=rootUser._id   //ye jo yaha par set kiya hai ,ye ek aur baar router.js me authenticate karvenge

           next();

     } catch (error) {
        res.status(401).json({status:401,message:"Unauthorized access"})
     } 
} 

module.exports=authenticate;