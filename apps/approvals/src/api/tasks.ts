import { createClient, request } from './client';
import type { Task } from '../store/tasks';

function resolveBaseURL(): string {
  if (import.meta.env.DEV) return 'http://localhost:4000/api';
  return '/api';
}

const client = createClient(() => undefined, resolveBaseURL());

export function getTasks(): Promise<Task[]> {
  return request<Task[]>(client, { method: 'GET', url: '/tasks' });
}