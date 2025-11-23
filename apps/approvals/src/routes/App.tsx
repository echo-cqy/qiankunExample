import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { Kpi } from 'components';
import { useTaskStore } from '../store/tasks';

export default function App() {
  const total = useTaskStore(s => s.tasks.length);
  return (
    <Layout>
      <Layout.Header>
        <div style={{ color: '#fff', fontWeight: 600 }}>审批中心</div>
      </Layout.Header>
      <Layout.Content style={{ padding: 16 }}>
        <Menu mode="horizontal" style={{ marginBottom: 16 }}>
          <Menu.Item key="tasks"><Link to="/tasks">任务列表</Link></Menu.Item>
        </Menu>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <Kpi label="任务总数" value={total} />
          <Kpi label="待处理" value={useTaskStore(s => s.tasks.filter(t => t.status === 'pending').length)} />
          <Kpi label="已通过" value={useTaskStore(s => s.tasks.filter(t => t.status === 'approved').length)} />
        </div>
      </Layout.Content>
    </Layout>
  );
}