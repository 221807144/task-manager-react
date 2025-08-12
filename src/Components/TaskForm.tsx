// src/components/TaskForm.tsx

import React, { useState } from 'react';
import { TaskService } from '../services/ApiService';
import { TaskFactory } from '../factories/ObjectFactories';
import { User } from '../types/models';

interface TaskFormProps {
  currentUser: User;
  onSuccess: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ currentUser, onSuccess }) => {
  const [task, setTask] = useState(TaskFactory.create({ createdBy: currentUser }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await TaskService.createTask(task);
      onSuccess();
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default TaskForm;
