import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Timeline, Button, Input, Space, message } from 'antd';
import type { TimelineProps } from 'antd';
import { getFlow, approveTask, rejectTask, type FlowStep } from '../api/flow';
import { getTasks } from '../api/tasks';
import { useTaskStore } from '../store/tasks';

export default function Flow() {
  const { id } = useParams();
  const [flow, setFlow] = useState<FlowStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const setTasks = useTaskStore(s => s.setTasks);
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getFlow(id).then(setFlow).finally(() => setLoading(false));
  }, [id]);
  const items: TimelineProps['items'] = flow.map(s => ({ children: `${s.title}${s.time ? `（${new Date(s.time).toLocaleString()}）` : ''}`, color: s.status === 'done' ? 'green' : s.status === 'pending' ? 'orange' : 'gray' }));
  const doAction = async (act: 'approve' | 'reject') => {
    if (!id) return;
    try {
      setLoading(true);
      if (act === 'approve') await approveTask(id, comment);
      else await rejectTask(id, comment);
      const f = await getFlow(id);
      setFlow(f);
      const ts = await getTasks();
      setTasks(ts);
      setComment('');
      message.success('已提交');
    } catch (e: unknown) {
      message.error(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h3>流程 {id}</h3>
      <Timeline items={items} pending={loading ? '加载中' : undefined} />
      <Space style={{ marginTop: 12 }}>
        <Input placeholder="备注" value={comment} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setComment(e.target.value)} />
        <Button type="primary" onClick={() => doAction('approve')} disabled={loading}>通过</Button>
        <Button danger onClick={() => doAction('reject')} disabled={loading}>驳回</Button>
      </Space>
    </div>
  );
}