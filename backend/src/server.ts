import express, { Request, Response, Router } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from 'http'; 
import { Server } from 'socket.io'; 

import { authRouter } from './routes/authRoute';
import { serverRouter } from './routes/serverRoute';
import { userRouter } from './routes/userRoute';
import { memberRouter } from './routes/memberRoute';
import { channelRouter } from './routes/channelRoute';
import { conversationRouter } from './routes/conversationRoute';
import { messageRouter, initializeMessageHandlers } from './routes/messageRoute';
import { directMessageRouter } from './routes/directMessageRoute';
import livekitRouter from './routes/livekitRoute';

dotenv.config();

const app = express();
const PORT = 8000;

// Create an HTTP server and pass the Express app
const httpServer = createServer(app);

app.use(express.json());

// Single CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['set-cookie'],
}));

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/api/socket/io",
  transports: ["polling", "websocket"],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Make io available to routes
app.set('io', io);

// Basic CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/server", serverRouter);
app.use("/api/channel", channelRouter);
app.use("/api/member", memberRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);
app.use("/api/direct-messages", directMessageRouter);
app.use("/api/livekit", livekitRouter);


const router = Router();
app.use(router);

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Got request success" });
});

// Initialize socket handlers
initializeMessageHandlers(io);

// Socket.io connection handling with rooms
io.on("connection", async (socket) => {
  console.log("Client connected:", socket.id);
  console.log("Transport used:", socket.conn.transport.name);

  // Handle joining server/channel rooms
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  // Handle leaving rooms
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room: ${room}`);
  });

  // Handle direct messages
  socket.on("joinDirectMessage", (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`Socket ${socket.id} joined DM: ${conversationId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected:", socket.id, "Reason:", reason);
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start the HTTP server
httpServer.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { io, app, httpServer };