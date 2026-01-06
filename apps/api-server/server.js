const http = require('http');
const url = require('url');
const Mock = require('mockjs');

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// Generate mock data
const tasksData = Mock.mock({
  'list|10-20': [{
    'id|+1': 1001,
    'title': '@ctitle(4, 8)',
    'status|1': ['pending', 'approved', 'rejected'],
    'createTime': '@datetime'
  }]
});

const tasks = tasksData.list.map(t => ({
  ...t,
  id: `T-${t.id}`
}));

const metrics = {
  totalTasks: Mock.Random.integer(100, 500),
  approvedRate: parseFloat(Mock.Random.float(0.5, 0.9, 1, 2).toFixed(2)),
  avgHandleHours: parseFloat(Mock.Random.float(5, 24, 1, 1).toFixed(1))
};

const trends = Array.from({ length: 7 }).map((_, i) => ({
  x: `Day ${i + 1}`,
  y: Mock.Random.integer(20, 80)
}));

function sendJSON(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(body));
}

function handleCORS(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.statusCode = 204;
  res.end();
}

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  if (req.method === 'OPTIONS') return handleCORS(req, res);

  if (pathname === '/api/tasks' && req.method === 'GET') {
    return sendJSON(res, 200, { code: 0, message: 'ok', data: tasks });
  }

  if (pathname && pathname.startsWith('/api/flow/') && req.method === 'GET') {
    const id = pathname.split('/').pop();
    const now = Date.now();
    const flow = [
      { key: 'submitted', title: '提交申请', status: 'done', time: new Date(now - 48 * 3600 * 1000).toISOString() },
      { key: 'manager_review', title: '主管审批', status: tasks.find(t => t.id === id)?.status === 'approved' ? 'done' : 'pending', time: tasks.find(t => t.id === id)?.status === 'approved' ? new Date(now - 24 * 3600 * 1000).toISOString() : null },
      { key: 'archived', title: '归档', status: tasks.find(t => t.id === id)?.status === 'approved' ? 'pending' : 'waiting', time: null },
    ];
    return sendJSON(res, 200, { code: 0, message: 'ok', data: flow });
  }

  if (pathname && pathname.startsWith('/api/tasks/') && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const id = pathname.split('/')[3];
        const action = pathname.split('/')[4];
        const payload = body ? JSON.parse(body) : {};
        const task = tasks.find(t => t.id === id);
        if (!task) return sendJSON(res, 404, { code: 1, message: 'task not found', data: null });
        if (action === 'approve') task.status = 'approved';
        if (action === 'reject') task.status = 'pending';
        return sendJSON(res, 200, { code: 0, message: 'ok', data: { id, action, comment: payload.comment || '' } });
      } catch (e) {
        return sendJSON(res, 400, { code: 1, message: 'bad request', data: null });
      }
    });
    return;
  }

  if (pathname === '/api/metrics' && req.method === 'GET') {
    return sendJSON(res, 200, { code: 0, message: 'ok', data: metrics });
  }

  if (pathname === '/api/trends' && req.method === 'GET') {
    return sendJSON(res, 200, { code: 0, message: 'ok', data: trends });
  }

  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`[api-server] listening at http://localhost:${PORT}/`);
});