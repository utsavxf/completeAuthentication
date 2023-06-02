const mongoose = require('mongoose');
const validator = require('validator'); //ye package install kiya hai email ki verification ke liye
const bcrypt = require('bcryptjs');
const jwt=require("jsonwebtoken");
const { response } = require('express');

const keysecret="utsavbhardwajutsavbhardwajutsavu"


const userSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true                //extra spacing remove kardega
    },

    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("not valid email")
            }
        }
    },

   password:{
       type:String,
       required:true,
       minlength:6    
   },
   
   cpassword:{
     type:String,
     required:true,
     minlength:6
   },

   tokens:[
     {
        token:{
            type:String,
            required:true,
        }
     }
   ]
   
})



//hash password

userSchema.pre("save",async function(next){  //pre ka matlab mongodb ke save function se pehle ye hoga

  if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,12)  //this 12 represents the no.of rounds ,more rounds means more iterations the hash function performs and more strong your password is protected
    this.cpassword=await bcrypt.hash(this.cpassword,12)
  }

 

   next();

})



//token generate

userSchema.methods.generateAuthtoken =async function(){
    
    //now go to theory we know to generate a token we need 2 things first is payload and then a secret key
    
    try {
        let token23=jwt.sign({_id:this._id},keysecret,{  //kyuki router ke page par userValid me jo data milega usme ek id bhi hogi  ,we are using id as a payload
             expiresIn:60 //nice,means 60 seconds
        })  

        // maybe see that after expiration the token has not been deleted from local storage



        //after this jo humne userSchema me token ki field banayi thi usme save karana hai
       this.tokens=this.tokens.concat({token:token23})

       await this.save();
       return token23;


    } catch (error) {
        response.status(422).json(error)
    }
}



//creating model
const userdb=new mongoose.model("users",userSchema);
//like a collection named users which will follow a certain set of rules defined in the userSchema




module.exports=userdb;