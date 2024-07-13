import { app } from "./app";
import connectDB from "./db";
import { config } from "dotenv";

config({path: '.env'});

connectDB().then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log("Database connection Error", err);
});


