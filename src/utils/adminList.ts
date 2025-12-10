// 在这里添加允许登录和管理网站的邮箱地址
// 只有在这个列表里的邮箱才能接收登录链接并进行管理操作
// 
// ⚠️ 安全提示：此文件包含敏感信息，请确保不要将真实的管理员邮箱提交到公开仓库
// 建议：使用环境变量 VITE_ALLOWED_EMAILS（逗号分隔）来配置管理员邮箱

const envEmails = import.meta.env.VITE_ALLOWED_EMAILS;
const emailsFromEnv = envEmails 
  ? envEmails.split(',').map(email => email.trim()).filter(Boolean)
  : [];

export const ALLOWED_EMAILS = emailsFromEnv.length > 0 
  ? emailsFromEnv
  : [
      // 默认值（仅用于开发，生产环境应使用环境变量）
      "inseeing@gmail.com", // 请替换为您自己的邮箱
      "admin@example.com",
    ];