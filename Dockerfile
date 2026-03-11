######## 构建阶段 ########
FROM node:20.20.1-alpine AS builder

WORKDIR /yapi

# 安装构建依赖 (alpine 环境下编译原生模块需要)
RUN apk add --no-cache python3 make g++

# 复制包定义文件
COPY package.json ./

# 安装所有依赖（包括 devDependencies，因为需要构建前端）
RUN npm install --legacy-peer-deps

# 复制源代码
COPY . .

# 构建前端资源
RUN npm run build-client || true

######## 运行阶段 ########
FROM node:20.20.1-alpine

WORKDIR /yapi

# 安装运行时依赖
RUN apk add --no-cache dumb-init

# 从构建阶段复制文件
COPY --from=builder /yapi/node_modules ./node_modules
COPY --from=builder /yapi/vendors ./vendors
COPY --from=builder /yapi/server ./server
COPY --from=builder /yapi/static ./static
COPY --from=builder /yapi/config ./config
COPY --from=builder /yapi/package.json ./

# 初始化数据库（仅在首次启动时）
RUN node server/install.js || true

# 暴露端口
EXPOSE 3000

# 使用 dumb-init 作为 PID 1 处理信号
ENTRYPOINT ["dumb-init", "--"]

# 启动应用
CMD ["node", "server/app.js"]
