import { request } from './client';
import type { Task } from '../store/tasks';

export function getTasks(): Promise<Task[]> {
  return request<Task[]>({ method: 'GET', url: '/tasks' });
}
