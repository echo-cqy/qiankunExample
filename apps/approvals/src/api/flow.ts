import { createClient, request } from './client';

function resolveBaseURL(): string {
  if (import.meta.env.DEV) return 'http://localhost:4000/api';
  return '/api';
}

const client = createClient(() => undefined, resolveBaseURL());

export type FlowStep = { key: string; title: string; status: 'done' | 'pending' | 'waiting'; time: string | null };

export function getFlow(id: string): Promise<FlowStep[]> {
  return request<FlowStep[]>(client, { method: 'GET', url: `/flow/${id}` });
}

export function approveTask(id: string, comment?: string): Promise<{ id: string; action: string; comment: string }>{
  return request(client, { method: 'POST', url: `/tasks/${id}/approve`, data: { comment } });
}

export function rejectTask(id: string, comment?: string): Promise<{ id: string; action: string; comment: string }>{
  return request(client, { method: 'POST', url: `/tasks/${id}/reject`, data: { comment } });
}