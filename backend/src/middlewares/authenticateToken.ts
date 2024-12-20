// middleware/authenticate.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface ExtendedRequest extends Request {
  user?: any; 
}

const authenticateToken = (req: ExtendedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).json({ noToken : true,message: "Access Denied: No token provided" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      res.status(403).json({ noToken : true,message: "Access Denied: Invalid token" });
      return;
    }

    req.user = user;

    next();
  });
};

export default authenticateToken;
