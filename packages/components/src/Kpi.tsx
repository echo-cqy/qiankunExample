import React from 'react';

export function Kpi(props: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
      <div style={{ color: '#666' }}>{props.label}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{props.value}</div>
    </div>
  );
}