import { Request, Response, Router } from 'express';
import { db } from '../lib/db';
import authenticateToken from '../middlewares/authenticateToken';
import { ChannelType, MemberRole } from '@prisma/client';

export const channelRouter = Router();

export interface ExtendedRequest extends Request {
  user?: any
}

channelRouter.post('/createchannel',authenticateToken, async (req: ExtendedRequest, res: Response):Promise<any> => {
  try {
    const {  channelname, channeltype,serverid } = req.query;
    const userid = req.user.id;
      if(!userid) {
        return res.status(400).json({
          success: false,
          message: 'User Id is required'
        });
      }
  
      if (!serverid || !channelname || !channeltype) {
        return res.status(400).json({
          success: false,
          message: 'Server id, channelname, channeltype is required'
        });
      }
      if (channelname === "general") {
        return res.status(400).json({
          success: false,
          message: 'channel name cannot be "general"'
        });
      }
      const server = await db.server.update({
        where:{
          id : serverid as string,
          members:{
            some:{
              profileId : userid,
              role: {
                in:[MemberRole.ADMIN, MemberRole.MODERATOR]
              }
            }
          }
        },
        data:{
          channels:{
            create:{
              profileId: userid,
              name: channelname as string,
              type: channeltype as ChannelType
            }
          }
        }
      });

      const createdServer = await db.server.findUnique({
          where: {
            id: server.id,
          },
          include: {
            channels: {
              orderBy: {
                createdAt: "asc"
              }
            },
            members: {
              include: {
                profile: true
              },
              orderBy: {
                role: "asc"
              }
            }
          }
        });

      res.json({
        success: true,
        server : createdServer
      });
      return;
  } catch (error) {
    console.error('Error creating channel:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the channel'
    });
  }
});