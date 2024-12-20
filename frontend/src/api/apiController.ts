import axiosInstance from "./axiosConfig";

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/users");
    return response.data;
  } catch (error) {
    throw error;
  }
};

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
