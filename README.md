# qiankunExample

一个基于 qiankun 的微前端 Monorepo 示例，包含主应用与三个子应用（审批中心、流程设计器、数据看板），以及本地示例后端。演示主应用统一管理路由、权限与主题配置，子应用独立开发/部署与跨项目组件、工具复用。

## 特性

- 微前端架构：主应用聚合多个子应用，按路由懒加载与权限管控
- Monorepo 管理：`pnpm` 工作区组织 `apps/*` 与 `packages/*`，共享工具与组件
- 审批中心：任务列表、流程时间线、表单流转（通过/驳回）与后端联调
- 流程设计器：画布入口（可扩展拖拽、连线、布局与缩放）
- 数据看板：指标与趋势展示，支持独立访问与主应用嵌入
- 统一主题/权限：主应用维护 `theme`、`roles` 并通过 `props` 下发到子应用

## 技术栈

- 前端：React、TypeScript、Ant Design、Zustand、React Router、Vite、qiankun
- 工具库：Axios + TS 泛型请求封装（Token 注入、错误拦截、类型推导）
- 包管理：pnpm 工作区
- 后端：Node.js 简易 API（示例）

## 目录结构

```
apps/
  approvals/     审批中心子应用（3001）
  designer/      流程设计器子应用（3002）
  dashboard/     数据看板子应用（3003）
  api-server/    本地示例后端（4000）
packages/
  utils/         共享工具库（Axios 封装等）
  components/    业务组件库（如 Kpi 指标组件）
main.js          主应用入口与子应用注册（5173）
```

## 快速开始

前置要求：已安装 Node.js 与 pnpm

1) 安装依赖

```
pnpm install
```

2) 启动后端（示例 API）

```
pnpm --filter api-server start
```

3) 启动子应用（独立终端运行）

```
pnpm --filter approvals dev   # http://localhost:3001/
pnpm --filter designer dev    # http://localhost:3002/
pnpm --filter dashboard dev   # http://localhost:3003/
```

4) 启动主应用（聚合入口）

```
pnpm dev  # http://localhost:5173/
```

打开主应用后，点击导航进入各子应用。默认角色为 `guest`，仅可访问“审批中心”；可扩展为 `admin` 访问全部。

## 接口说明（示例）

- 任务列表：`GET /api/tasks`
- 流程详情：`GET /api/flow/:id`
- 审批操作：`POST /api/tasks/:id/approve`、`POST /api/tasks/:id/reject`

示例后端实现：`apps/api-server/server.js:1`

## 关键实现

- 审批任务列表与联调：`apps/approvals/src/routes/Tasks.tsx:1`
  - 获取任务列表并渲染表格，行内提供“查看流转”跳转
- 流程时间线与表单流转：`apps/approvals/src/routes/Flow.tsx:1`
  - 拉取流程步骤与时间，执行通过/驳回并刷新流程与列表
- 业务组件复用：`packages/components/src/Kpi.tsx:1`，在审批首页展示指标卡：`apps/approvals/src/routes/App.tsx:1`
- 主应用统一管理：`main.js:1`
  - 路由聚合、权限检查（`permissionMap`）与 `props` 注入（`theme`、`roles`）；初始进入自动重定向到 `/approvals`

## 开发注意事项

- CORS 与 HMR：子应用的 Vite 开发服务器配置了跨域响应头与禁用 HMR，保证主应用嵌入稳定
- React Fast Refresh：在微前端嵌入场景中默认关闭以避免动态执行冲突
- qiankun 生命周期：子应用需实现 `mount/unmount/update`（开发模式可启用 `useDevMode` 便于联调）
- Axios Headers 类型：在工具库中兼容 `AxiosHeaders` 与普通对象的设置方式，避免类型错误
- `.gitignore`：忽略 `node_modules/`、构建产物、日志与环境文件，避免仓库膨胀与换行提示噪音

## 多仓库与部署

- qiankun 与仓库组织无关，支持多仓库：主应用通过远程 `entry` 加载各子应用入口
- 发布共享库：将 `packages/utils`、`packages/components` 发布到私有/公共 npm，在子应用按版本依赖
- 环境切换：可通过环境变量配置各子应用的 `entry`，区分开发/测试/生产地址

## Git 与远程

- 远程关联：`git remote add origin https://github.com/<your>/qiankunExample.git`
- 首次推送：`git add . && git commit -m "init" && git push -u origin main`
- 合并不相关历史：`git pull origin main --allow-unrelated-histories`
- 账号切换：HTTPS 用凭据管理器清理后用新 PAT；或改用 SSH Key 绑定对应账号

## FAQ

- 主应用看不到子应用？
  - 确认子应用端口已启动；确保子应用启用 CORS 与禁用 HMR；主应用的 `entry` 指向正确
- 端口占用或不可用？
  - 使用 `strictPort: true` 保持固定端口；若占用请关闭冲突进程后重启
- `refusing to merge unrelated histories`？
  - 本地与远程没有共同祖先，用 `--allow-unrelated-histories` 合并或重置到远端

## License

仅用于示例演示，实际项目请按公司或开源协议要求补充 License。