FROM ubuntu:22.04

# 避免交互式安装提示
ENV DEBIAN_FRONTEND=noninteractive

# 更新系统并安装必要工具
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# 安装 Docker CLI（只是客户端，不是守护进程）
RUN curl -fsSL https://get.docker.com | sh

# 设置工作目录
WORKDIR /app

# 复制整个项目
COPY . .

# 给启动脚本执行权限
RUN chmod +x start_all_services.sh

# 暴露前端端口
EXPOSE 80

# 启动所有服务
CMD ["./start_all_services.sh"]
