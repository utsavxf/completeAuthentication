const express = require('express');
const router=new express.Router();
const userdb=require("../models/userSchema")
const bcrypt = require('bcryptjs');
const authenticate =require("../middleware/authenticate")

//for user registration

router.post("/register",async(req,res)=>{
    // console.log(req.body);
    
    //AB HUMNE FRONTEND SE TO DATA LELIYA AB USKI VALIDATION KARVAYENGE AUR USKO DATABASE ME STORE KARVAENGE
    
    const {fname,email,password,cpassword}=req.body //object destructuring taaki sabke liye har baar req.body.fname wagera na likhna pade
    
    if(!fname || !email || !password || !cpassword){
        res.status(422).json({error:"fill all the details"})
    }

    
   
     try {
       const preuser= await userdb.findOne({email:email})  //white waala key hai jo userschema ki field thi and red waala vo email hai jo user enter karega

        if(preuser){
            
            res.status(422).json({error:"This email already exists"}) 
            
        }else if(password !==cpassword){
            
            res.status(422).json({error:"Password and Confirm Password do not match"})
        }else{

            
            //sab sahi hai ek document banao then password hash karo and then store karao database me
            const finalUser=new userdb(req.body);

           //password hashing

           const storeData=await finalUser.save();
           
        //    console.log(storeData);

        res.status(201).json({status:201,storeData});
           

        }


     } catch (error) {
        res.status(422).json(error)
        console.log(error);
        
        console.log("catch block error");
        

     }

 

});


//for user login

router.post("/",async(req,res)=>{
    // console.log(req.body);

    
    const {email,password}=req.body //object destructuring taaki sabke liye har baar req.body.fname wagera na likhna pade
    
    if( !email || !password){
        res.status(422).json({error:"fill all the details"})
    }

    try {
        
     const userValid=await userdb.findOne({email:email})


     if(userValid){
        const isMatch=await bcrypt.compare(password,userValid.password) 
         
        if(!isMatch){
            res.status(422).json({error:"invalid details"})
        }else{
            
            //AB AAGAYA HUMARA TOKEN GENERATE KARNE WAALA PART
            const token=await userValid.generateAuthtoken();  //defined in userSchema
             
            // console.log(token);


            //now we want to generate a cookie and then uske baad is cookie ko vaapis bhejenge apne front-end me

            res.cookie("usercookie",token,{
                expires:new Date(Date.now()+9000000), //matlab expiry date jo current date hai usse excatly 15 minutes baad
                httpOnly:true
            })

 
           //now we'll send a response back to the frontend containing token and the user which is validated 
           const result={
            userValid,
            token
           } 

           res.status(201).json({status:201,result})

        }

     }


    } catch (error) {
        
    }

    


})


//for validation of user
//protected route

router.get("/validuser",authenticate,async(req,res)=>{

// use of middleware function (authenticate)
   try {
    
      const ValidUserOne=await userdb.findOne({_id:req.userId})
      res.status(201).json({status:201,ValidUserOne})

   } catch (error) {
    res.status(401).json({status:401,error})
   }
})


//for logging out the user

router.get("/logout",authenticate,async(req,res)=>{  //dovara authenticate hoga
   try {
    //user ke database me multiple token honge
    
     //matlab jo user hume mila hai authentication waale page se 
     //user ke multiple tokens honge ,vo expire hogaye honge par uske databse par to honge hi(userSchema mai) ,lekin jo valid tha use hume remove karna hoga
    req.rootUser.tokens =req.rootUser.tokens.filter((curelem)=>{
         return curelem.token!=req.token //jo jo tokens match nahi ho rahe hai unhe hi return karao bas
    })

    res.clearCookie("usercookie",{path:"/"}) //clear the cookie

    req.rootUser.save();

    res.status(201).json({status:201})



    
   } catch (error) {
      res.status(201).json({status:401,error}) 
   }


})



module.exports=router;

