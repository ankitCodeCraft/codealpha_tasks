import axiosInstance from "./axiosInstance";

export const getComments = async (postId, page = 1, limit = 10) => {
  const response = await axiosInstance.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
  return response.data;
};

export const addComment = async (postId, comment) => {
  const response = await axiosInstance.post(`/posts/${postId}/comments`, { comment });
  return response.data;
};

export const deleteComment = async (postId, commentId) => {
  const response = await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
  return response.data;
};
