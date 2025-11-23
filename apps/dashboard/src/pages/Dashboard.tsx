import React, { useEffect, useState } from 'react';
import { getMetrics, getTrends, type Metrics, type Point } from '../api/dashboard';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [trends, setTrends] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getMetrics(), getTrends()])
      .then(([m, t]) => { setMetrics(m); setTrends(t); })
      .catch((e) => setError(String(e?.message || e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>数据看板</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
          <div style={{ color: '#666' }}>任务总数</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{metrics?.totalTasks ?? (loading ? '...' : 0)}</div>
        </div>
        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
          <div style={{ color: '#666' }}>通过率</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{metrics ? `${(metrics.approvedRate * 100).toFixed(1)}%` : (loading ? '...' : '0%')}</div>
        </div>
        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
          <div style={{ color: '#666' }}>平均处理时长</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{metrics ? `${metrics.avgHandleHours}h` : (loading ? '...' : '0h')}</div>
        </div>
      </div>

      <h3>近7日审批趋势</h3>
      <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {trends.map(p => (
            <li key={p.x}>
              <span style={{ display: 'inline-block', width: 100 }}>{p.x}</span>
              <span style={{ fontWeight: 600 }}>{p.y}</span>
            </li>
          ))}
          {trends.length === 0 && (loading ? <li>加载中...</li> : <li>暂无数据</li>)}
        </ul>
      </div>
    </div>
  );
}