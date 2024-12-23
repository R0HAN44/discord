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