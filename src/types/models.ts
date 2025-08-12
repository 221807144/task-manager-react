// src/types/models.ts

// User model
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  department?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Task model
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: User;
  createdBy: User;
}

// Comment model
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: User;
  task: Task;
}

// Attachment model
export interface Attachment {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  task: Task;
}