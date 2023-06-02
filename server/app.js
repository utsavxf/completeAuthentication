const express = require('express');
require("./db/conn")
const router = require('./routes/router');
const cors = require("cors")
const cookieParser = require('cookie-parser');



const app=express();
const port=8009;


// app.get("/",(req,res)=>{
//     res.status(201).json("server created");
// })


app.use(express.json()) //fontend se jo bhi data hoga vo frontend se uthakar backend me json ki form me pass karaenge
app.use(cookieParser())
app.use(cors());
{
   /*our frontend will run on port 3000 and our backend will run on port 8009 so when we we'll pass data from frontend to backend
   we will get an error of the type cors(CRoss Origin Resource Sharing ) */ 
}
app.use(router);


app.listen(port,()=>{
    console.log(`Server started  port no. ${port}`);
    
})