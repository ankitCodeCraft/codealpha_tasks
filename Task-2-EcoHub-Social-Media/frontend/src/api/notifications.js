import axiosInstance from "./axiosInstance";

export const getNotifications = async (page = 1, limit = 10) => {
  const response = await axiosInstance.get(`/notifications?page=${page}&limit=${limit}`);
  return response.data;
};
