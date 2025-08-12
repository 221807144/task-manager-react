// src/services/ApiService.ts

import axios from 'axios';
import { User, Task, Comment, Attachment } from '../types/models';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export class UserService {
  static async register(userData: Omit<User, 'id'>) {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  }

  static async login(credentials: { email: string; password: string }) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  }

  static async getCurrentUser() {
    const response = await axios.get(`${API_BASE_URL}/users/me`);
    return response.data;
  }
}

export class TaskService {
  static async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
    return response.data;
  }

  static async getTasks() {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  }

  static async getTaskById(id: string) {
    const response = await axios.get(`${API_BASE_URL}/tasks/${id}`);
    return response.data;
  }
}
export class CommentService {
  static async addComment(taskId: string, content: string) {
    const response = await axios.post(`${API_BASE_URL}/tasks/${taskId}/comments`, { content });
    return response.data;
  }

  static async getTaskComments(taskId: string) {
    const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}/comments`);
    return response.data;
  }
}