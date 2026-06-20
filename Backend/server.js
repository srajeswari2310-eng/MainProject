const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const dbConnection = require('./config/dbconnection.config');
const authRouter = require("./routes/authentication.routes");
const parkingRouter = require("./routes/parking.routes");
const userRouter = require('./routes/user.routes');

const errorHandler = require("./middleware/error.middleware");
dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

dbConnection();

//handel errorHandler
app.use(errorHandler);


//call register and login
app.use("/", authRouter);

//call user
app.use("/user", userRouter);

//call parking
app.use("/parking", parkingRouter);


app.listen(process.env.PORT, ()=>{
    console.log("Server is running");
})
