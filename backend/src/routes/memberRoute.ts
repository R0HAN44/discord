import { Request, Response, Router } from 'express';
import { db } from '../lib/db';
import authenticateToken from '../middlewares/authenticateToken';
import {v4 as uuidv4} from 'uuid';
import { MemberRole } from '@prisma/client';

export const memberRouter = Router();

export interface ExtendedRequest extends Request {
  user?: any
}

memberRouter.patch('/updatemember', authenticateToken, async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {
    const { memberid, role, serverid } = req.query;
    const user = req.user;
    
    if (!memberid || !role || !serverid || 
        typeof memberid !== 'string' || 
        typeof serverid !== 'string' ||
        typeof role !== 'string' ||
        !Object.values(MemberRole).includes(role as MemberRole)) {
      return res.status(400).json({
        success: false,
        message: 'Server Id, Member Id and valid role required'
      });
    }

    const server = await db.server.update({
      where: {
        id: serverid,
        profileId: user.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberid,
              profileId: {
                not: user.id
              }
            },
            data: {
              role: role as MemberRole
            }
          }
        }
      },
      include: {
        channels: {
            orderBy: {
              createdAt: 'asc', 
            },
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
    console.error('Error members id patch', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while patching members'
    });
  }
});

memberRouter.delete('/deletemember', authenticateToken, async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {
    const { memberid, serverid } = req.query;
    const user = req.user;
    
    if (!memberid || !serverid || 
        typeof memberid !== 'string' || 
        typeof serverid !== 'string'){
      return res.status(400).json({
        success: false,
        message: 'Server Id, Member Id required'
      });
    }

    const server = await db.server.update({
      where: {
        id: serverid,
        profileId: user.id,
      },
      data: {
        members: {
         deleteMany:{
          id: memberid,
          profileId:{
            not: user.id
          }
         }
        }
      },
      include: {
        channels: {
            orderBy: {
              createdAt: 'asc', 
            },
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
    console.error('Error members id delete', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting members'
    });
  }
});