import axiosInstance from "./axiosConfig";

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/users");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (userData: object) => {
  try {
    const response = await axiosInstance.post("/api/login", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const singup = async (userData: object) => {
  try {
    const response = await axiosInstance.post("/api/signup", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
