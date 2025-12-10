# 安全审计报告

## 审计日期
2025年1月

## 发现的问题

### 🔴 严重问题

1. **硬编码的 Supabase 凭证**
   - **位置**: `src/utils/supabase/info.tsx`
   - **问题**: 包含硬编码的 `projectId` 和 `publicAnonKey`
   - **风险**: 虽然 `publicAnonKey` 设计为可公开，但硬编码在代码中不利于多环境部署
   - **状态**: ✅ 已修复 - 现在优先从环境变量读取

2. **管理员邮箱列表暴露**
   - **位置**: `src/utils/adminList.ts`
   - **问题**: 包含真实的管理员邮箱地址 `inseeing@gmail.com`
   - **风险**: 暴露管理员身份信息
   - **状态**: ✅ 已修复 - 现在支持从环境变量读取

3. **项目 ID 在注释中暴露**
   - **位置**: `src/supabase/functions/server/kv_store.tsx` (第10行)
   - **问题**: 注释中包含项目 ID
   - **状态**: ✅ 已修复 - 已替换为占位符

### 🟡 建议改进

1. **环境变量配置**
   - 已创建 `.env.example` 文件作为模板
   - 建议：创建实际的 `.env` 文件并添加到 `.gitignore`

2. **Git 忽略文件**
   - 已创建 `.gitignore` 文件
   - 确保 `.env` 文件不会被提交

## 已实施的修复

### 1. 创建 `.gitignore` 文件
- 忽略 `node_modules/`
- 忽略 `.env` 文件
- 忽略构建产物和日志文件

### 2. 修改 `src/utils/supabase/info.tsx`
- 优先从环境变量 `VITE_SUPABASE_PROJECT_ID` 和 `VITE_SUPABASE_ANON_KEY` 读取
- 保留默认值作为开发环境的后备方案

### 3. 修改 `src/utils/adminList.ts`
- 支持从环境变量 `VITE_ALLOWED_EMAILS` 读取（逗号分隔）
- 添加安全提示注释
- 保留默认值作为开发环境的后备方案

### 4. 修改 `src/supabase/functions/server/kv_store.tsx`
- 移除硬编码的项目 ID，替换为占位符

### 5. 创建 `.env.example` 文件
- 提供环境变量配置模板
- 包含必要的配置说明

## 部署前检查清单

在将代码推送到 Git 仓库之前，请确认：

- [ ] 已创建 `.env` 文件（不要提交到 Git）
- [ ] `.env` 文件已添加到 `.gitignore`
- [ ] 所有敏感信息已从代码中移除
- [ ] 环境变量已正确配置
- [ ] 测试环境变量配置是否正常工作

## 环境变量配置

### 开发环境
1. 复制 `.env.example` 为 `.env`
2. 填入实际的 Supabase 项目 ID 和密钥
3. 配置管理员邮箱列表

### 生产环境
确保在生产环境部署时设置以下环境变量：
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ALLOWED_EMAILS`

## 注意事项

1. **Supabase Public Anon Key**: 
   - 这个密钥设计为可以公开（用于客户端）
   - 但建议使用环境变量以便于管理

2. **管理员邮箱**:
   - 建议使用环境变量配置，避免在代码中硬编码
   - 定期审查管理员列表

3. **服务器端密钥**:
   - `SUPABASE_SERVICE_ROLE_KEY` 仅在服务器端使用
   - 已正确使用环境变量（`Deno.env.get`）

## 后续建议

1. 考虑使用密钥管理服务（如 AWS Secrets Manager、Azure Key Vault）
2. 实施代码审查流程，防止敏感信息被提交
3. 使用 pre-commit hooks 检查敏感信息
4. 定期进行安全审计

