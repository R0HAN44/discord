import { createConversation, findConversationByMembers } from "@/api/apiController";

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
  let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);

  if(!conversation){
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }
  return conversation;
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {  
  try {
    const conversationResponse = await findConversationByMembers(memberOneId, memberTwoId);
    if(conversationResponse.found){
      return conversationResponse.conversation;
    }
    return null;
  } catch (error) {
    return null; 
  }
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversationResponse = await createConversation(memberOneId, memberTwoId);
    return conversationResponse.conversation;
  } catch (error) {
    return null;
  }
}