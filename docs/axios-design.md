# Axios 二次封装与工程化实践

本文档详细说明了本项目中 Axios 封装的设计思路、实现细节及对应的面试考点。

## 1. 核心目标
我们在 `packages/utils/src/index.ts` 中实现了 Axios 的二次封装，旨在解决以下问题：
- **统一鉴权**：自动注入 Token，处理 Token 刷新。
- **错误收敛**：统一处理 HTTP 状态码错误和业务错误（Code != 0）。
- **稳定性治理**：针对幂等接口（GET）的网络/超时错误进行指数退避重试。
- **类型安全**：通过 TypeScript 泛型约束返回结构。

## 2. 架构设计

### 2.1 整体分层
虽然核心逻辑集中在 `utils` 包，但在应用层（如 `apps/approvals`）推荐以下分层：
```text
api/
 ├─ instance.ts     // 单例 Axios 实例（注入具体的 Token 获取/刷新逻辑）
 ├─ client.ts       // 导出通用请求方法
 ├─ tasks.ts        // 业务模块 A 的接口定义
 └─ flow.ts         // 业务模块 B 的接口定义
hooks/
 └─ useRequest.ts   // 结合 React 声明周期的请求 Hook
```

### 2.2 请求流程
1.  **Request Interceptor**: 注入 `Authorization` Header。
2.  **Adapter (Axios)**: 发送 XHR/Fetch 请求。
3.  **Response Interceptor**:
    -   拦截 401 错误 -> 触发 Token 刷新流程（队列机制防止并发刷新）。
    -   拦截网络/超时错误 -> 触发指数退避重试（仅限 GET 请求）。
    -   透传其他错误。
4.  **Request Function**:
    -   检查业务 Code（如 `code === 0`）。
    -   区分错误类型（取消、业务、网络、HTTP状态）。

## 3. 关键实现细节（面试高频）

### 3.1 Token 刷新与并发控制
**问题**：Token 过期时，多个并发请求会导致多次刷新 Token 吗？
**实现**：不会。我们维护了一个 `isRefreshing` 标志和 `requests` 队列。
- 当第一个请求遇到 401 时，设置 `isRefreshing = true` 并开始刷新。
- 后续遇到的 401 请求会被放入 `requests` 队列，处于 `Promise pending` 状态。
- 刷新成功后，遍历队列重新发送请求；刷新失败则拒绝所有请求并触发 `onUnauthorized`。

### 3.2 错误类型区分
我们在 `request` 方法中对错误进行了分类处理：
- **主动取消** (`axios.isCancel(e)`): 忽略，不提示错误。
- **业务错误** (`BusinessError`): 后端返回 HTTP 200 但 Code != 0。
- **状态码错误** (`e.response` 存在): 如 403, 404, 500。
- **网络错误** (`e.request` 存在且无 response): 断网或请求超时。

### 3.3 取消请求（AbortController）
在 `useRequest` Hook 中，利用 `AbortController` 实现自动取消：
- **竞态处理**：发起新请求前，自动 abort 上一次未完成的请求。
- **组件卸载**：组件销毁时，自动 abort 正在进行的请求。
- **手动取消**：暴露 `cancel` 方法给业务层。

### 3.4 接口重试机制
**策略**：
- 仅针对幂等请求（`config.method === 'GET'`）。
- 仅针对非业务错误（网络超时、5xx）。
- **指数退避**：重试间隔为 `1s, 2s, 4s`，避免雪崩效应。

## 4. 代码参考
- **核心封装**: [`packages/utils/src/index.ts`](../packages/utils/src/index.ts)
- **React Hook**: [`apps/approvals/src/hooks/useRequest.ts`](../apps/approvals/src/hooks/useRequest.ts)
- **实例配置**: [`apps/approvals/src/api/instance.ts`](../apps/approvals/src/api/instance.ts)
