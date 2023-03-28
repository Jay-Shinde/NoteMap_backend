const mongoose = require('mongoose');
//const  mongoURI = "mongodb://localhost:27017"; 
const  mongoURI = "mongodb://127.0.0.1:27017/webapp"; //use this instead of localhost
const connectToMongo = async ()=>{
    try {
        await mongoose.connect(mongoURI);
        console.log("connected to mongodb successfuly");

    }catch(err){
        console.log("failed to connect !",err);
    }
    
}
module.exports = connectToMongo;
