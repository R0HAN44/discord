import express, { Request, Response, Router } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { authRouter } from './routes/authRoute';
import { serverRouter } from './routes/serverRoute';
import { userRouter } from './routes/userRoute';


dotenv.config();

const app = express();
const PORT = 8000;

app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Added Cookie
    credentials: true,
    exposedHeaders: ['set-cookie']
  })
);


const router = Router()
app.use("/api/auth",authRouter);
app.use("/api/server",serverRouter);
app.use("/api/user",userRouter);

router.get("/",(req:Request,res:Response) => {
  res.json({
    message:"got request succes"
  })
})

app.listen(PORT,()=>{
  console.log("server running on port: ",PORT)
})