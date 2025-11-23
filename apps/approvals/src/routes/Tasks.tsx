import React, { useEffect, useState } from 'react';
import { Table, Tag, message } from 'antd';
import type { TableProps } from 'antd';
import type { Task } from '../store/tasks';
import { Link } from 'react-router-dom';
import { useTaskStore } from '../store/tasks';
import { getTasks } from '../api/tasks';

export default function Tasks() {
  const tasks = useTaskStore(s => s.tasks);
  const setTasks = useTaskStore(s => s.setTasks);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getTasks().then(setTasks).catch((e) => message.error(String(e?.message || e))).finally(() => setLoading(false));
  }, [setTasks]);
  const columns: TableProps<Task>['columns'] = [
    { title: '任务ID', dataIndex: 'id' },
    { title: '标题', dataIndex: 'title' },
    { title: '状态', dataIndex: 'status', render: (v: string) => <Tag color={v === 'pending' ? 'orange' : 'green'}>{v}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Link to={`/flow/${r.id}`}>查看流转</Link> },
  ];
  return <Table rowKey="id" dataSource={tasks} columns={columns} pagination={false} loading={loading} />;
}