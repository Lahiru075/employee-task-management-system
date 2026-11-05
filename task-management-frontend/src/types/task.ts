export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';


export interface TaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; 
  assignedUserEmail: string;
}

export interface TaskResponse {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedUserName?: string;
  assignedUserEmail: string;
  createdAt: string;
}

export interface DashboardContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}