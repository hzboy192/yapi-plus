# Vercel 部署指南

## 环境变量配置

在 Vercel 部署 YApi 时，需要通过环境变量配置数据库连接。请在 Vercel Dashboard 的项目设置中配置以下环境变量：

### 数据库配置

**推荐使用 `MONGODB_CONNECTION_STRING`（最简单）**：

| 环境变量名 | 说明 | 示例 |
|-----------|------|------|
| `MONGODB_CONNECTION_STRING` | MongoDB 完整连接字符串 | `mongodb+srv://user:pass@cluster.mongodb.net/yapi` |

**或者使用分项配置**：

| 环境变量名 | 说明 | 示例 |
|-----------|------|------|
| `DB_SERVERNAME` | MongoDB 服务器地址 | `127.0.0.1` 或 `cluster0.xxx.mongodb.net` |
| `DB_DATABASE` | 数据库名称 | `yapi` |
| `DB_PORT` | MongoDB 端口 | `27017` |
| `DB_USER` | 数据库用户名 | `admin` |
| `DB_PASS` | 数据库密码 | `password123` |
| `DB_AUTH_SOURCE` | 认证数据库（可选） | `admin` |

### 邮件配置（可选）

| 环境变量名 | 说明 | 示例 |
|-----------|------|------|
| `MAIL_HOST` | SMTP 服务器地址 | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP 端口 | `587` |
| `MAIL_FROM` | 发件人邮箱 | `noreply@example.com` |
| `MAIL_USER` | SMTP 用户名 | `user@example.com` |
| `MAIL_PASS` | SMTP 密码 | `password123` |

### 其他配置

| 环境变量名 | 说明 | 示例 |
|-----------|------|------|
| `PORT` | 服务端口（Vercel 自动管理，通常无需设置） | `3000` |

## 配置优先级

环境变量的配置优先级高于 `config.json` 文件中的配置。即：
1. 首先读取 `config.json` 中的配置
2. 如果设置了对应的环境变量，则使用环境变量的值覆盖

## 设置步骤

1. 登录 Vercel Dashboard
2. 进入你的 YApi 项目
3. 点击 **Settings** → **Environment Variables**
4. 点击 **Add New** 添加上述环境变量
5. 选择环境（Production/Preview/Development）
6. 保存后重新部署项目

## 示例：MongoDB Atlas 连接

如果使用 MongoDB Atlas，推荐使用连接字符串方式：

```
MONGODB_CONNECTION_STRING=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/yapi?retryWrites=true&w=majority
```

将 `<username>`、`<password>`、`<cluster>` 替换为你的实际值。
