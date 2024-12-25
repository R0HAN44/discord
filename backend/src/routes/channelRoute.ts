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

channelRouter.patch('/editchannel', authenticateToken, async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {
    const { channelid, channelname, channeltype, serverid } = req.query; 
    const userid = req.user.id;

    
    if (!userid) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    if (!serverid || !channelid || !channelname || !channeltype) {
      return res.status(400).json({
        success: false,
        message: 'Server ID, Channel ID, Channel Name, and Channel Type are required',
      });
    }

    if (channelname === 'general') {
      return res.status(400).json({
        success: false,
        message: 'Channel name cannot be "general"',
      });
    }

    const server = await db.server.findUnique({
      where: {
        id: serverid as string,
      },
      include: {
        members: {
          where: {
            profileId: userid,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
    });

    if (!server || server.members.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You do not have the necessary permissions to edit channels in this server',
      });
    }

    const updatedChannel = await db.channel.update({
      where: {
        id: channelid as string,
      },
      data: {
        name: channelname as string,
        type: channeltype as ChannelType,
      },
    });

    const updatedServer = await db.server.findUnique({
      where: {
        id: serverid as string,
      },
      include: {
        channels: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return res.json({
      success: true,
      server: updatedServer,
    });
  } catch (error) {
    console.error('Error editing channel:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while editing the channel',
    });
  }
});


channelRouter.delete('/deletechannel', authenticateToken, async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {
    const { serverid, channelid } = req.query; 
    const userid = req.user.id; 

    // Validate inputs
    if (!userid) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    if (!serverid || !channelid) {
      return res.status(400).json({
        success: false,
        message: 'Server ID and Channel ID are required',
      });
    }

    // Ensure user is authorized to delete the channel
    const server = await db.server.findUnique({
      where: {
        id: serverid as string,
      },
      include: {
        members: {
          where: {
            profileId: userid,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
    });

    if (!server || server.members.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You do not have the necessary permissions to delete channels in this server',
      });
    }

    // Delete the channel
    const deletedChannel = await db.channel.delete({
      where: {
        id: channelid as string,
      },
    });

    // Fetch the updated server details
    const updatedServer = await db.server.findUnique({
      where: {
        id: serverid as string,
      },
      include: {
        channels: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    // Respond with the updated server
    return res.json({
      success: true,
      server: updatedServer,
    });
  } catch (error) {
    console.error('Error deleting channel:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the channel',
    });
  }
});
