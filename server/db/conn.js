
const mongoose = require('mongoose');


const DB="mongodb+srv://utb4578:yQ9MIAjX9DLgBJA4@cluster0.luhybny.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=> console.log('Database connected')
).catch((err)=>{
    console.log(err);
    
    console.log('An error ocurred');
    
}) 