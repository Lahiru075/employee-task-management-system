import api from './api';
import { TaskRequest, TaskResponse, TaskStatus } from '../types/task';

export const getAllTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTask = async (taskData: TaskRequest): Promise<TaskResponse> => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (id: number, taskData: TaskRequest): Promise<TaskResponse> => {
  try {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTaskStatus = async (id: number, status: TaskStatus): Promise<TaskResponse> => {
  try {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    await api.delete(`/tasks/${id}`);
  } catch (error) {
    throw error;
  }
};

export const getTaskByEmail = async (email: string): Promise<TaskResponse[]> => {
  try {
    const response = await api.get(`/tasks/my-tasks?email=${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};