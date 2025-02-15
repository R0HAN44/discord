import { ChannelType, MemberRole } from "@/lib/utils";
import axiosInstance from "./axiosConfig";

export const login = async (userData: object) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (userData: object) => {
  try {
    const response = await axiosInstance.post("/api/auth/signup", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//servers api

export const getUserServer = async (id : string) => {
  try {
    const response = await axiosInstance.get(`/api/server?userid=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createServer = async (servername: string,userid : string | undefined) => {
  try {
    const response = await axiosInstance.post(`/api/server/createserver`,{servername,userid});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserServers = async (id : string) => {
  try {
    const response = await axiosInstance.get(`/api/server/userservers?userid=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServerChannelAndMembers = async (id : string) => {
  try {
    const response = await axiosInstance.get(`/api/server/serverwithcm?serverid=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserDetails = async () => {
  try {
    const response = await axiosInstance.get("/api/user");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateInviteCode = async (serverid : string) => {
  try {
    const response = await axiosInstance.patch(`/api/server/generatecode?serverid=${serverid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkUserExixtsInServerAndUpdate = async (userid : string, invitecode : string) => {
  try {
    const response = await axiosInstance.get(`/api/user/checkexists?userid=${userid}&invitecode=${invitecode}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateServerDetails = async (servername:string, serverid : string) => {
  try {
    const response = await axiosInstance.patch(`/api/server/updateserver?servername=${servername}&serverid=${serverid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMemberRole = async (memberid:string, role : MemberRole, serverid : string) => {
  try {
    const response = await axiosInstance.patch(`/api/member/updatemember?memberid=${memberid}&role=${role}&serverid=${serverid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMember = async (memberid:string, serverid : string) => {
  try {
    const response = await axiosInstance.delete(`/api/member/deletemember?memberid=${memberid}&serverid=${serverid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createChannel = async (channelname:string,channeltype :ChannelType, serverid : string) => {
  try {
    const response = await axiosInstance.post(`/api/channel/createchannel?channelname=${channelname}&channeltype=${channeltype}&serverid=${serverid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const leaveServer = async (serverid : string) => {
  try {
    const response = await axiosInstance.patch(`/api/server/leaveserver?serverid=${serverid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteServer = async (serverid : string) => {
  try {
    const response = await axiosInstance.delete(`/api/server/deleteserver?serverid=${serverid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteChannel = async (channelid : string, serverid : string) => {
  try {
    const response = await axiosInstance.delete(`/api/channel/deletechannel?channelid=${channelid}&serverid=${serverid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editChannel = async (channelid:string,channelname:string,channeltype :ChannelType, serverid : string) => {
  try {
    const response = await axiosInstance.patch(`/api/channel/editchannel?channelid=${channelid}&channelname=${channelname}&channeltype=${channeltype}&serverid=${serverid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchGeneralChannels = async (serverid : string) => {
  try {
    const response = await axiosInstance.get(`/api/channel/generalchannels?serverid=${serverid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const fetchChannel = async (channelid : string) => { 
  try {
    const response = await axiosInstance.get(`/api/channel/getchannel?channelid=${channelid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const fetchMember = async (serverid : string) => {
  try {
    const response = await axiosInstance.get(`/api/member/getmember?serverid=${serverid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const findConversationByMembers = async (memberOneId: string, memberTwoId: string) => {
  try {
    const response = await axiosInstance.get(`/api/conversation/getconversation?memberoneid=${memberOneId}&membertwoid=${memberTwoId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const response = await axiosInstance.post(`/api/conversation/createconversation?memberoneid=${memberOneId}&membertwoid=${memberTwoId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const sendMessage = async (apiUrl: string, channelid: string, serverid : string, value: string) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}?channelid=${channelid}&serverid=${serverid}&content=${value}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const sendConvMessage = async (apiUrl: string, conversationId : string, value: string) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}?conversationId=${conversationId}&content=${value}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getMessages = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const patchMessage = async (url: string, value : string) => {
  try {
    const response = await axiosInstance.patch(`${url}&content=${value}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteMessage = async (url: string) => {
  try {
    const response = await axiosInstance.delete(`${url}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getLiveKitToken = async (room: string, username: string) => {
  try {
    const response = await axiosInstance.get(`/api/livekit/getToken?room=${room}&username=${username}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}