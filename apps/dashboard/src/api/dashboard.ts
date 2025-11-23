import { createClient, request } from './client';

function resolveBaseURL(): string {
  if (import.meta.env.DEV) return 'http://localhost:4000/api';
  return '/api';
}

const client = createClient(() => undefined, resolveBaseURL());

export type Metrics = { totalTasks: number; approvedRate: number; avgHandleHours: number };
export type Point = { x: string; y: number };

export function getMetrics(): Promise<Metrics> {
  return request<Metrics>(client, { method: 'GET', url: '/metrics' });
}

export function getTrends(): Promise<Point[]> {
  return request<Point[]>(client, { method: 'GET', url: '/trends' });
}