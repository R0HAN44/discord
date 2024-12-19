import express, { Request, Response, Router } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from './routes/userRoute';
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
const PORT = 8000;

app.use(express.json())
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Added OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Added Cookie
    credentials: true,
    exposedHeaders: ['set-cookie'] // Allow the browser to expose the set-cookie header
  })
);


const router = Router()
app.use("/api",userRouter);

router.get("/",(req:Request,res:Response) => {
  res.json({
    message:"got request succes"
  })
})

app.listen(PORT,()=>{
  console.log("server running on port: ",PORT)
})