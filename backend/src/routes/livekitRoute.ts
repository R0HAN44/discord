import express, { Request, Response, Router } from 'express';
import { AccessToken } from 'livekit-server-sdk';

export const livekitRouter = Router();
//@ts-ignore
livekitRouter.get('/getToken', async (req: Request, res: Response) => {
  try {
    const { room, username } = req.query;

    if (!room || !username) {
      return res.status(400).json({ success: false, message: 'Room and username are required' });
    }

    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
      identity: username as string,
      ttl: 600, // 10 minutes in seconds
    });

    at.addGrant({ roomJoin: true, room: room as string });

    const token = await at.toJwt();

    return res.json({ success: true, token });
  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default livekitRouter;
