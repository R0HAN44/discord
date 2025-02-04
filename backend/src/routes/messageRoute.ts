import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../lib/db';
import authenticateToken from '../middlewares/authenticateToken';
import { Server } from 'socket.io';
import { MemberRole, Message } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || "rohan";

const MESSAGES_BATCH = 10;

export const messageRouter = Router();

export interface ExtendedRequest extends Request {
  user?: any
}

// Initialize socket handlers
// export const initializeMessageHandlers = (io: Server) => {
//   // Socket middleware for authentication
//   io.use(async (socket, next) => {
//     const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
//     console.log(token)
//     if (!token) {
//       return next(new Error('Authentication error'));
//     }

//     try {
//       const decoded = jwt.verify(token, JWT_SECRET) as {
//         id: string;
//         email: string;
//         name: string;
//       };
//       socket.data.userId = decoded.id;
//       next();
//     } catch (err) {
//       next(new Error('Authentication error'));
//     }
//   });
// };
export const initializeMessageHandlers = (io: Server) => {
  // Socket middleware (removed authentication)
  io.use((socket, next) => {
    // No authentication logic
    next();
  });

  // You can add other event handlers here
};

// Send message route
messageRouter.post('/messages', authenticateToken, async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {
    const { content, channelid, serverid } = req.query;
    const userId = req.user.id; // From authenticateToken middleware

    // Validate input
    if (!content || !channelid) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverid as string,
        members: {
          some: {
            profileId: userId
          }
        }
      },
      include: {
        members: true
      }
    });

    if(!server) {
      return res.status(404).json({
        success: false,
        message: 'Server not found'
      });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelid as string,
        serverId: serverid as string
      }
    });

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found'
      });
    }

    const member = server.members.find((member) => member.profileId === userId);

    if (!member) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Create message in database
    const message = await db.message.create({
      data: {
        content: content as string,
        channelId: channelid as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    });

    const channelKey = `chat:${channelid}:messages`;

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.to(channelid).emit(channelKey,message);

    return res.status(201).json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get channel messages
messageRouter.get('/messages', authenticateToken, async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {

    const userId = req.user.id;

    if (!userId) return res.status(404).json( { success: false, message: 'User not found' });


    const profile = await db.profile.findUnique({
      where: { id : userId }
    });
    console.log(userId)
    console.log(profile)
    if (!profile) return res.status(404).json( { success: false, message: 'Profile not found' });
    const { channelId } = req.query;
    const { cursor } = req.query;
    const limit = 50;

    if(!channelId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

     let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor as string
        },
        where: {
          channelId : channelId as string
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: { channelId: channelId as string },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return res.json(
      {
        success: true,
        messages, 
        nextCursor 
      }
    );

  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

messageRouter.patch('/messages/:id', authenticateToken, async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {

    const userId = req.user.id;
    const messageId = req.params.id;

    if (!userId) return res.status(404).json( { success: false, message: 'User not found' });


    const profile = await db.profile.findUnique({
      where: { id : userId }
    });
    if (!profile) return res.status(404).json( { success: false, message: 'Profile not found' });
    const { serverid, channelid,content } = req.query;
    const limit = 50;

    if(!channelid) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    if(!messageId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    if(!content) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverid as string,
        members: {
          some: {
            profileId: profile.id
          }
        }
      },
      include: {
        members: true
      }
    });

    if (!server)
      return res.status(404).json({ error: "Server not found" });

    const channel = await db.channel.findFirst({
      where: {
        id: channelid as string,
        serverId: serverid as string
      }
    });

    if (!channel)
      return res.status(404).json({ error: "Channel not found" });

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member)
      return res.status(404).json({ error: "Member not found" });

    let message : any = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelid as string
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    });

    if (!message || message.deleted)
      return res.status(404).json({ error: "Message not found" });

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) return res.status(401).json({ error: "Unauthorized" });

    if (!isMessageOwner)
        return res.status(401).json({ error: "Unauthorized" });

      message = await db.message.update({
        where: {
          id: messageId as string
        },
        data: {
          content : content as string
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        }
      });

    const updateKey = `chat:${channelid}:messages:update`;

    const io = req.app.get('io');
    io.emit(updateKey, message);

    return res.status(200).json({success:true,message});

  } catch (error) {
    console.error("[MESSAGES_ID]", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete message
messageRouter.delete('/messages/:id', authenticateToken, async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {

    const userId = req.user.id;
    const messageId = req.params.id;

    if (!userId) return res.status(404).json( { success: false, message: 'User not found' });

    if(!messageId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    const profile = await db.profile.findUnique({
      where: { id : userId }
    });
    if (!profile) return res.status(404).json( { success: false, message: 'Profile not found' });
    const { serverid, channelid } = req.query;
    const limit = 50;

    if(!channelid) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverid as string,
        members: {
          some: {
            profileId: profile.id
          }
        }
      },
      include: {
        members: true
      }
    });

    if (!server)
      return res.status(404).json({ error: "Server not found" });

    const channel = await db.channel.findFirst({
      where: {
        id: channelid as string,
        serverId: serverid as string
      }
    });

    if (!channel)
      return res.status(404).json({ error: "Channel not found" });

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member)
      return res.status(404).json({ error: "Member not found" });

    let message : any = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelid as string
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    });

    if (!message || message.deleted)
      return res.status(404).json({ error: "Message not found" });

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) return res.status(401).json({ error: "Unauthorized" });

    message = await db.message.update({
        where: {
          id: messageId as string
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        }
      });


    const updateKey = `chat:${channelid}:messages:update`;

    const io = req.app.get('io');
    io.emit(updateKey, message);

    return res.status(200).json(message);

  } catch (error) {
    console.error("[MESSAGES_ID]", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// // Update message
// messageRouter.patch('/messages/:messageId', authenticateToken, async (req: ExtendedRequest, res: Response): Promise<any> => {
//   try {
//     const { messageId } = req.params;
//     const { content } = req.body;
//     const userId = req.user.id;

//     const message = await db.message.findUnique({
//       where: { id: messageId },
//       include: { member: true }
//     });

//     if (!message) {
//       return res.status(404).json({
//         success: false,
//         message: 'Message not found'
//       });
//     }

//     // Check if user owns the message
//     if (message.member.profileId !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Unauthorized'
//       });
//     }

//     const updatedMessage = await db.message.update({
//       where: { id: messageId },
//       data: { content },
//       include: {
//         member: {
//           include: {
//             profile: true
//           }
//         }
//       }
//     });

//     // Emit socket event for real-time updates
//     const io = req.app.get('io');
//     io.to(message.channelId).emit('messageUpdate', {
//       message: updatedMessage
//     });

//     return res.json({
//       success: true,
//       message: updatedMessage
//     });

//   } catch (error) {
//     console.error('Update message error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// });