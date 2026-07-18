import axiosInstance from "./axiosInstance";

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/admin/dashboard");
  return response.data;
};
