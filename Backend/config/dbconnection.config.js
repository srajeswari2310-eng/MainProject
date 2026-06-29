const mongoose = require('mongoose');

const dbConnection = async()=> {
    try{
        await mongoose.connect(process.env.MONOGO_ATLAS);
        console.log("Database connected");

    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = dbConnection;