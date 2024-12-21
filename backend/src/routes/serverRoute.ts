import { Request, Response, Router } from 'express';
import { db } from '../lib/db';
import authenticateToken from '../middlewares/authenticateToken';
import {v4 as uuidv4} from 'uuid';
import { MemberRole } from '@prisma/client';

export const serverRouter = Router();


// Get the first server where a member matches the given userid
serverRouter.get('/',authenticateToken, async (req: Request, res: Response): Promise<any> => {
  try {
    // Get userid from query params
    const { userid } = req.query;

    if (!userid) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const server = await db.server.findFirst({
      where: {
        members: {
          some: {
            profileId: userid as string
          }
        }
      }
    });

    if (!server) {
      return res.json({
      success: true,
      server: null
    });
    }

    return res.json({
      success: true,
      server: {
        id: server.id,
        name: server.name,
        imageUrl:server.imageUrl,
        inviteCode:server.inviteCode,
        createdAt: server.createdAt,
        updatedAt:server.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching server:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the server'
    });
  }
});

// Get all servers where a member matches the given userid
serverRouter.get('/userservers',authenticateToken, async (req: Request, res: Response): Promise<any> => {
  try {
    // Get userid from query params
    const { userid } = req.query;

    if (!userid) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const servers = await db.server.findMany({
      where: {
        members: {
          some: {
            profileId: userid as string
          }
        }
      }
    });

    if (!servers) {
      return res.json({
      success: true,
      servers: []
    });
    }

    return res.json({
      success: true,
      servers
    });
  } catch (error) {
    console.error('Error fetching server:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the server'
    });
  }
});

serverRouter.post('/createserver',authenticateToken, async (req: Request, res: Response):Promise<any> => {
  try {
    const { servername,userid } = req.body;
  
      if(!userid) {
        return res.status(400).json({
          success: false,
          message: 'User Id is required'
        });
      }
  
      if (!servername) {
        return res.status(400).json({
          success: false,
          message: 'Server name is required'
        });
      }
  
      const server = await db.server.create({
        data:{
          profileId:userid,
          name: servername,
          imageUrl:"",
          inviteCode: uuidv4(),
          channels:{
            create:[
              {name:"general", profileId: userid}
            ]
          },
          members:{
            create:[
              {profileId:userid, role:MemberRole.ADMIN}
            ]
          }

        }
      });

      res.json({
        success: true,
        server
      });
      return;
  } catch (error) {
    console.error('Error posting server:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while posting the server'
    });
  }
});


serverRouter.get('/serverwithcm',authenticateToken, async (req: Request, res: Response): Promise<any> => {
  try {
    // Get userid from query params
    const { serverid } = req.query;

    if (!serverid) {
      return res.status(400).json({
        success: false,
        message: 'Server ID is required'
      });
    }

    const server = await db.server.findUnique({
      where: {
        id:String(serverid),
      },
      include:{
        channels:{
          orderBy:{
            createdAt:"asc"
          }
        },
        members:{
          include:{
            profile: true
          },
          orderBy:{
            role:"asc"
          }
        }
      }
    });

    if (!server) {
      return res.json({
      success: true,
      server: null
    });
    }

    return res.json({
      success: true,
      server
    });
  } catch (error) {
    console.error('Error fetching server:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the server'
    });
  }
});