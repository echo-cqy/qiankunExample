import { create } from 'zustand';

export type Task = { id: string; title: string; status: 'pending' | 'approved' };

type TaskState = {
  tasks: Task[];
  setTasks: (t: Task[]) => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [
    { id: 'T-1001', title: '请假申请', status: 'pending' },
    { id: 'T-1002', title: '报销审批', status: 'approved' },
  ],
  setTasks: (tasks) => set({ tasks }),
}));