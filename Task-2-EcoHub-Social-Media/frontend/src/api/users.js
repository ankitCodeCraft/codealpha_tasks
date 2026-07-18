import axiosInstance from "./axiosInstance";

export const searchUsers = async (query, page = 1, limit = 10) => {
  const response = await axiosInstance.get(`/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await axiosInstance.get("/users/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  // profileData can be FormData for updates including profilePhoto
  const response = await axiosInstance.put("/users/profile", profileData);
  return response.data;
};

export const getUserProfile = async (id) => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};

export const followUser = async (id) => {
  const response = await axiosInstance.put(`/users/${id}/follow`);
  return response.data;
};

export const unfollowUser = async (id) => {
  const response = await axiosInstance.put(`/users/${id}/unfollow`);
  return response.data;
};
