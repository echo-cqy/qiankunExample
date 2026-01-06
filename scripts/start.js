const { spawn } = require('child_process');

const commands = [
  { name: 'api      ', cmd: 'pnpm', args: ['--filter', 'api-server', 'run', 'start'] },
  { name: 'approvals', cmd: 'pnpm', args: ['--filter', 'approvals', 'run', 'dev'] },
  { name: 'dashboard', cmd: 'pnpm', args: ['--filter', 'dashboard', 'run', 'dev'] },
  { name: 'designer ', cmd: 'pnpm', args: ['--filter', 'designer', 'run', 'dev'] },
  { name: 'main     ', cmd: 'pnpm', args: ['run', 'dev'] },
];

console.log('Starting all services...');

const children = [];

commands.forEach(({ name, cmd, args }) => {
  const child = spawn(cmd, args, { 
    stdio: 'pipe', 
    shell: true,
    env: { ...process.env, FORCE_COLOR: 'true' }
  });
  
  children.push(child);

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) console.log(`[${name}] ${line}`);
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) console.error(`[${name}] ${line}`);
    });
  });
});

process.on('SIGINT', () => {
  console.log('Stopping all services...');
  children.forEach(child => child.kill());
  process.exit();
});
