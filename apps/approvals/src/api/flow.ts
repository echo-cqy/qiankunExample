import { request } from './client';

export type FlowStep = { key: string; title: string; status: 'done' | 'pending' | 'waiting'; time: string | null };

export function getFlow(id: string): Promise<FlowStep[]> {
  return request<FlowStep[]>({ method: 'GET', url: `/flow/${id}` });
}

export function approveTask(id: string, comment?: string): Promise<{ id: string; action: string; comment: string }>{
  return request({ method: 'POST', url: `/tasks/${id}/approve`, data: { comment } });
}

export function rejectTask(id: string, comment?: string): Promise<{ id: string; action: string; comment: string }>{
  return request({ method: 'POST', url: `/tasks/${id}/reject`, data: { comment } });
}
