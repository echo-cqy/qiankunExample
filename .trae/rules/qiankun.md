一、项目背景（必须严格遵循）

项目名称：流程管理平台（微前端）

架构：基于 qiankun 的微前端架构

主应用职责：

统一管理路由

权限与登录态

主题配置

子应用：

审批中心（approval）

流程设计器（designer）

数据看板（dashboard，可只保留壳）

二、技术栈（不得随意替换）

React

TypeScript

Vite

qiankun

Axios

Zustand

Ant Design

pnpm Monorepo

三、整体工程结构（重点）

使用 pnpm Monorepo，目录结构如下：

root/
 ├─ apps/
 │   ├─ main-app/        # qiankun 主应用
 │   ├─ approval/        # 审批中心子应用
 │   ├─ designer/        # 流程设计器子应用
 │   └─ dashboard/       # 数据看板（最小壳即可）
 ├─ packages/
 │   ├─ request-core/    # Axios + TS 二次封装（重点）
 │   └─ ui-kit/          # 公共组件库（可只放 Button）
 ├─ package.json
 └─ pnpm-workspace.yaml

四、Axios 二次封装要求（核心）

在 packages/request-core 中实现：

1️⃣ Axios Instance

统一 baseURL、timeout

支持创建多个 instance（配置化）

2️⃣ 请求拦截器

自动注入 Token（从 localStorage 或 Zustand 中读取）

支持请求级配置（如 skipAuth）

3️⃣ 响应拦截器

统一处理：

网络错误 / 超时

HTTP 状态码错误

业务错误（code !== 0）

将错误收敛为前端可感知的错误模型

4️⃣ TypeScript 强类型
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}


对外暴露：

request<T>(config): Promise<T>

五、子应用演示要求（最小可用即可）
approval 子应用

一个「审批任务列表」页面

调用 request-core 中的 request 方法

展示请求成功 / 失败的基本状态

designer 子应用

一个简化的流程设计器示例：

使用 React Hooks

使用原生 Drag API

支持节点拖拽 + 简单连线（示意即可）

六、qiankun 集成要求

主应用负责注册微应用

子应用支持：

独立运行

被 qiankun 挂载

路由不冲突