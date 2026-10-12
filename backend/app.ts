import express from "express";
import cors from "cors";
import route from "./controllers/controller";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI as string).then(() =>{
    console.log("connected to MongoDB");
    app.listen(PORT, ()=>{
        console.log(`server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("MongoDB connnection error:", error);
});

app.use("/auth", route);
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});