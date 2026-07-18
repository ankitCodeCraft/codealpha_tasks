import axiosInstance from "./axiosInstance";

export const getFeed = async (page = 1, limit = 10, userId = null) => {
  const url = userId 
    ? `/posts?page=${page}&limit=${limit}&user=${userId}` 
    : `/posts?page=${page}&limit=${limit}`;
  const response = await axiosInstance.get(url);
  return response.data;
};

export const searchPosts = async (query, page = 1, limit = 10) => {
  const response = await axiosInstance.get(`/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  return response.data;
};

export const getSinglePost = async (id) => {
  const response = await axiosInstance.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  // postData should be a FormData instance containing 'image' and optionally 'caption'
  const response = await axiosInstance.post("/posts", postData);
  return response.data;
};

export const updatePost = async (id, postData) => {
  // postData should be a FormData or object. If we can upload new image, use FormData
  const response = await axiosInstance.put(`/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await axiosInstance.delete(`/posts/${id}`);
  return response.data;
};

export const likePost = async (id) => {
  const response = await axiosInstance.put(`/posts/${id}/like`);
  return response.data;
};

export const unlikePost = async (id) => {
  const response = await axiosInstance.put(`/posts/${id}/unlike`);
  return response.data;
};
