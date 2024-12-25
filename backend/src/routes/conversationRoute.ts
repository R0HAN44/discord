import { Request, Response, Router } from 'express';
import { db } from '../lib/db';
import authenticateToken from '../middlewares/authenticateToken';

export const conversationRouter = Router();

export interface ExtendedRequest extends Request {
  user?: any
}

conversationRouter.get('/getconversation', authenticateToken, async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {
    const { memberoneid, membertwoid } = req.query;
    const user = req.user;
    
    if (!memberoneid || !membertwoid || 
        typeof memberoneid !== 'string' || 
        typeof membertwoid !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Member Ids required'
      });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        AND: [
            {memberOneId: memberoneid},
            {memberTwoId: membertwoid}
        ],
      },
          include:{
            memberOne:{
              include:{
                profile:true
              }
            },
            memberTwo:{
              include:{
                profile:true
              }
            }
          }
      
    });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        found:false,
        message: 'Conversation not found'
      });
    }

    return res.status(200).json({
      success: true,
      found:true,
      conversation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error
    });
  }
})

conversationRouter.post('/createconversation', authenticateToken, async (req: ExtendedRequest, res: Response): Promise<any> => {
  try {
    const { memberoneid, membertwoid } = req.query;
    const user = req.user;
    console.log("memberoneid:",memberoneid)
    console.log("membertwoid:",membertwoid)
    if (!memberoneid || !membertwoid || 
        typeof memberoneid !== 'string' || 
        typeof membertwoid !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Member Ids required'
      });
    }
    const memberOne = await db.member.findUnique({
  where: { id: memberoneid },
});
const memberTwo = await db.member.findUnique({
  where: { id: membertwoid },
});
console.log("memberOne",memberOne)
console.log("memberTwo",memberTwo)

    const conversation = await db.conversation.create({
      data: {
        memberOneId: memberoneid,
        memberTwoId: membertwoid,
      },
      include:{
        memberOne:{
          include:{
            profile:true
          }
        },
        memberTwo:{
          include:{
            profile:true
          }
        }
      }
    }); 
      console.log(conversation)

    return res.status(200).json({
      success: true,
      conversation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error
    });
  }
})

