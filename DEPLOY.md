# 部署指南：深色设计搜集网站

本项目由 **前端（Vite + React）** 和 **后端（Supabase）** 两部分组成。要完整跑起来，需要：  
1）在 Supabase 创建项目并配置数据库、存储、认证和 Edge Function；  
2）把前端部署到 Vercel（或其它静态托管），并配置环境变量。

---

## 一、整体架构

| 部分 | 作用 |
|------|------|
| **前端** | 静态网站，部署在 Vercel，用户访问的页面 |
| **Supabase 项目** | 提供：数据库（站点数据 KV）、存储（图片）、认证（登录）、Edge Function（站点 CRUD + 上传） |

前端通过环境变量连接到你自己的 Supabase 项目，所以你必须**自己创建一个 Supabase 项目**，不能继续用别人项目里的 ID 和 Key。

---

## 二、Supabase 配置（必做）

### 1. 创建 Supabase 项目

1. 打开 [Supabase](https://supabase.com) 并登录。
2. 点击 **New project**，选组织、填项目名、设数据库密码、选区域（如 Singapore），然后创建。
3. 进入项目后，在 **Settings → API** 里记下：
   - **Project URL**（如 `https://xxxx.supabase.co`）
   - **Project ID**（即 URL 里的 `xxxx`）
   - **anon public** key（前端用）
   - **service_role** key（仅后端 / Edge Function 用，勿泄露到前端）

### 2. 创建数据库表（存站点列表）

在 Supabase 控制台打开 **SQL Editor**，执行：

```sql
CREATE TABLE IF NOT EXISTS kv_store_5cb5e93b (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

这张表用来存站点数据的 key-value（例如 key = `design_sites`，value = 站点数组）。

### 3. 开启邮箱登录（认证）

- 进入 **Authentication → Providers**，确保 **Email** 已开启。
- 若只给自己用，可在 **Authentication → Settings** 里关掉 “Enable email confirmations”，这样注册/登录后不用再点邮件确认（可选）。

### 4. 部署 Edge Function（后端 API）

前端会请求：  
`https://<projectId>.supabase.co/functions/v1/make-server-5cb5e93b/sites` 等，  
所以需要在 Supabase 里部署名为 **make-server-5cb5e93b** 的 Edge Function。  
项目里已准备好 **supabase/functions/make-server-5cb5e93b/** 目录，可直接部署。

#### 步骤（使用 Supabase CLI）

1. **安装 Supabase CLI**  
   - Mac: `brew install supabase/tap/supabase`  
   - 其它: https://supabase.com/docs/guides/cli

2. **登录并链接项目**（在项目根目录执行）：

   ```bash
   cd "/Users/taojing/Desktop/深色设计搜集网站-from hina"
   supabase login
   supabase init
   supabase link --project-ref <你的 Project ID>
   ```

   按提示选择地区、输入数据库密码等。

3. **部署函数**：

   ```bash
   supabase functions deploy make-server-5cb5e93b
   ```

   Supabase 会自动为 Edge Function 注入 `SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`，无需在控制台再配。

4. 部署完成后，在 Supabase 控制台 **Edge Functions** 中能看到 `make-server-5cb5e93b`，可点进去查看日志或测试。

### 5. 存储桶（图片上传）

Edge Function 里会使用存储桶 `make-5cb5e93b-resources`，并在首次运行时尝试创建。  
你可以在 **Storage** 里检查是否已自动创建；若没有，可手动新建一个 **private** 桶，名称设为 `make-5cb5e93b-resources`，与代码中的 `BUCKET_NAME` 一致。

---

## 三、前端环境变量

在项目根目录复制一份环境变量示例并改成自己的值：

```bash
cp .env.example .env
```

编辑 `.env`，填入**你自己的** Supabase 信息和管理员邮箱：

```env
# 从 Supabase 项目 Settings → API 获取
VITE_SUPABASE_PROJECT_ID=你的 Project ID（如 xxxx）
VITE_SUPABASE_ANON_KEY=你的 anon public key

# 允许登录并管理站点的邮箱，多个用英文逗号分隔
VITE_ALLOWED_EMAILS=你的邮箱@example.com
```

- **不要**再使用别人项目里的 Project ID 和 Key。  
- 只有出现在 `VITE_ALLOWED_EMAILS` 里的邮箱才能登录并做增删改。

---

## 四、前端部署（Vercel）

项目已包含 `vercel.json`，构建输出目录为 `build`（与 `vite.config.ts` 中 `outDir: 'build'` 一致）。

### 1. 用 Vercel 部署

1. 把本仓库推送到 GitHub（或 GitLab 等）。
2. 登录 [Vercel](https://vercel.com)，**Import** 该仓库，选择 “Vite” 或默认即可。
3. 在 **Environment Variables** 中配置（与本地 `.env` 一致）：
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ALLOWED_EMAILS`
4. 部署。Vercel 会执行 `npm run build` 并发布 `build` 目录。

### 2. 其它静态托管

若用 Netlify、Cloudflare Pages 等：

- 构建命令：`npm run build`
- 发布目录：`build`
- 同样配置上述三个环境变量（名称不变）。

---

## 五、部署后自检

1. **前端**：打开 Vercel 给的域名，应能打开站点首页；若一直“无法加载站点列表”，多半是 Supabase 未配好或环境变量错误。
2. **登录**：用 `VITE_ALLOWED_EMAILS` 里的邮箱注册/登录，应能进入管理（添加/编辑/删除站点）。
3. **API**：在浏览器或 Postman 请求：  
   `https://<你的 Project ID>.supabase.co/functions/v1/make-server-5cb5e93b/sites`  
   并带上 Header：`Authorization: Bearer <你的 anon key>`，应返回 JSON（站点数组或空数组）。

---

## 六、注意事项

- **Service Role Key** 只用在 Edge Function 或后端，不要写进前端代码或 `.env` 里暴露给浏览器。
- 管理员邮箱建议用环境变量 `VITE_ALLOWED_EMAILS` 配置，不要在生产环境长期使用 `adminList.ts` 里的默认邮箱。
- 若你修改了 Edge Function 的路由或表名，需要同步改前端的请求 URL 或 Supabase 表结构。

按上述步骤做完：Supabase（数据库 + 认证 + 存储 + Edge Function）+ 前端环境变量 + Vercel 部署，即可把项目完整部署给自己用。
