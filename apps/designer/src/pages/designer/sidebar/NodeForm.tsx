import React from 'react';
import { Form, Input, Button } from 'antd';
import { NodeData } from '../types';

interface NodeFormProps {
  data: NodeData;
  onChange: (data: Partial<NodeData>) => void;
}

export const NodeForm: React.FC<NodeFormProps> = ({ data, onChange }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(data);
  }, [data, form]);

  const handleFinish = (values: any) => {
    onChange(values);
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item name="label" label="Label">
        <Input onChange={(e) => onChange({ label: e.target.value })} />
      </Form.Item>
      <Form.Item name="x" label="X">
        <Input type="number" onChange={(e) => onChange({ x: Number(e.target.value) })} />
      </Form.Item>
      <Form.Item name="y" label="Y">
        <Input type="number" onChange={(e) => onChange({ y: Number(e.target.value) })} />
      </Form.Item>
    </Form>
  );
};
