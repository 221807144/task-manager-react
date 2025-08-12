// src/factories/ObjectFactories.ts

import { User, Task, Comment, Attachment } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

export class UserFactory {
  static create(partial?: Partial<User>): User {
    return {
      id: uuidv4(),
      name: '',
      email: '',
      role: 'STUDENT',
      ...partial
    };
  }
}

export class TaskFactory {
  static create(partial?: Partial<Task>): Task {
    return {
      id: uuidv4(),
      title: '',
      description: '',
      status: 'TO_DO',
      priority: 'MEDIUM',
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: UserFactory.create(),
      ...partial
    };
  }
}

export class CommentFactory {
  static create(partial?: Partial<Comment>): Comment {
    return {
      id: uuidv4(),
      content: '',
      createdAt: new Date().toISOString(),
      author: UserFactory.create(),
      task: TaskFactory.create(),
      ...partial
    };
  }
}

export class AttachmentFactory {
  static create(partial?: Partial<Attachment>): Attachment {
    return {
      id: uuidv4(),
      fileName: '',
      filePath: '',
      fileType: '',
      fileSize: 0,
      uploadedAt: new Date().toISOString(),
      task: TaskFactory.create(),
      ...partial
    };
  }
}