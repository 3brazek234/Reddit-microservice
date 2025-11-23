const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
import axios from "axios";
// Types matching your ERD
export interface User {
  id: number;
  email: string;
  username: string;
  password?: string; // Never send to frontend in real implementation
}

export interface Post {
  id: number;
  title: string;
  description: string;
  author: number; // user id
  likes: number;
  created_at?: string;
}

export interface Comment {
  id: number;
  post_id: number;
  comment: string;
  author?: number; // Add if needed
  created_at?: string;
}

export interface Subreddit {
  id: number;
  name: string;
  description: string;
}

export interface SubredditUser {
  subreddit_id: number;
  user_id: number;
}
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// User API
export const userApi = {
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  async register(userData: Partial<User>): Promise<User> {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  async getProfile(userId: number): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};

// Post API
export const postApi = {
  async getPosts(limit = 20, offset = 0): Promise<Post[]> {
    const response = await api.get(`/posts?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  async getPost(postId: number): Promise<Post> {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  async createPost(postData: Partial<Post>): Promise<Post> {
    const response = await api.post(`/posts`, postData);
    return response.data;
  },

  async updateLikes(postId: number, increment: boolean): Promise<Post> {
    const response = await api.patch(`/posts/${postId}/like`, {
      increment,
    });
    return response.data;
  },

  async deletePost(postId: number): Promise<void> {
    await api.delete(`/posts/${postId}`);
  },
};

  // Comment API
export const commentApi = {
  async getComments(postId: number): Promise<Comment[]> {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },
};



