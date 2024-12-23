import { Request, Response, Router } from 'express';
import { db } from '../lib/db';
import authenticateToken from '../middlewares/authenticateToken';
import {v4 as uuidv4} from 'uuid';
import { MemberRole } from '@prisma/client';

export const serverRouter = Router();

export interface ExtendedRequest extends Request {
  user?: any
}


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
      },
      include: {
        channels: {
          orderBy: {
            createdAt: "asc", // Order channels by creation date
          },
        },
        members: {
          include: {
            profile: true, // Include profile details of members
          },
          orderBy: {
            role: "asc", // Order members by role
          },
        },
      },
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

      const createdServer = await db.server.findUnique({
          where: {
            id: server.id, // Use the ID from the created server
          },
          include: {
            channels: {
              orderBy: {
                createdAt: "asc"
              }
            },
            members: {
              include: {
                profile: true // Include profile details
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

serverRouter.patch('/generatecode',authenticateToken, async (req: ExtendedRequest, res: Response):Promise<any> => {
  try {
    const { serverid } = req.query;
    if (!req.user) {
        return res.status(400).json({
          success: false,
          message: 'User Not found'
        });
      }
    const user = req.user;

      if (!serverid) {
        return res.status(400).json({
          success: false,
          message: 'Server ID is required'
        });
      }
  
      const server = await db.server.update({
        where:{
          id: serverid as string,
          profileId : user.id,
        },
        data:{
          inviteCode : uuidv4()
        }
      })

      res.json({
        success: true,
        server
      });
      return;
  } catch (error) {
    console.error('Error server:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while patching invite code to the server'
    });
  }
});

serverRouter.patch('/updateserver',authenticateToken, async (req: ExtendedRequest, res: Response):Promise<any> => {
  const { servername, serverid } = req.query;
    const user = req.user;

    if (!servername || !serverid) {
      return res.status(400).json({
        success: false,
        message: 'Required server details to update',
      });
    }

    try {
      await db.server.update({
        where: {
          id: serverid as string,
          profileId : user.id,
        },
        data: {
          name: servername as string,
        },
      });

      
      const server = await db.server.findUnique({
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

      if (!server) {
        return res.status(404).json({
          success: false,
          message: 'Server not found after update',
        });
      }

      res.json({
        success: true,
        server,
      });
    } catch (error) {
      console.error('Error updating server:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while updating the server',
      });
    }

});

serverRouter.patch('/leaveserver',authenticateToken, async (req: ExtendedRequest, res: Response):Promise<any> => {
  const { serverid } = req.query;
    const user = req.user;

    if (!serverid) {
      return res.status(400).json({
        success: false,
        message: 'Required server details to leave',
      });
    }

    if(!user.id){
      return res.status(400).json({
        success: false,
        message: 'Required user id to leave',
      });
    }

    try {
      const server = await db.server.update({
        where: {
          id: serverid as string,
          profileId : {
            not: user.id
          },
          members:{
            some:{
              profileId : user.id
            }
          }
        },
        data: {
          members: {
            deleteMany:{
              profileId : user.id
            }
          }
        },
      });

      
      const updatedServer = await db.server.findUnique({
          where: {
            id: server.id, // Use the ID from the created server
          },
          include: {
            channels: {
              orderBy: {
                createdAt: "asc"
              }
            },
            members: {
              include: {
                profile: true // Include profile details
              },
              orderBy: {
                role: "asc"
              }
            }
          }
        });

      res.json({
        success: true,
        server: updatedServer,
      });
    } catch (error) {
      console.error('Error leaving server:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while leaving the server',
      });
    }

});

serverRouter.delete('/deleteserver',authenticateToken, async (req: ExtendedRequest, res: Response):Promise<any> => {
  const { serverid } = req.query;
    const user = req.user;

    if (!serverid) {
      return res.status(400).json({
        success: false,
        message: 'Required server details to leave',
      });
    }

    if(!user.id){
      return res.status(400).json({
        success: false,
        message: 'Required user id to leave',
      });
    }

    try {
      const server = await db.server.delete({
        where: {
          id: serverid as string,
          profileId : user.id
        }
      });


      res.json({
        success: true,
        message: "Server Deleted Successfully",
      });
    } catch (error) {
      console.error('Error deleting server:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the server',
      });
    }

});