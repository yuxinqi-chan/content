---
title: Nginx Proxy Manager 介绍与 Docker 部署
description: Nginx Proxy Manager 是一个具有直观易用的 Web 界面，用于管理 Nginx 反向代理的工具
image:
  src: /images/nginx-proxy-manager.png
authors:
  - name: yuxinqi
    to: https://github.com/yuxinqi-chan
    avatar:
      src: https://avatars.githubusercontent.com/u/11438187?s=48&v=4
date: 2024-07-13T00:00:00.000Z
badge:
  label: Nginx, Docker
---

## 什么是 Nginx Proxy Manager？

Nginx Proxy Manager 是一个基于 Nginx 的反向代理管理工具，它提供了一个直观易用的 Web 界面，使得配置和管理反向代理变得简单快捷。通过它，用户可以轻松地设置反向代理、管理 SSL 证书、配置访问控制等，而无需深入了解 Nginx 配置文件。它特别适合那些希望简化 Nginx 管理的用户。

## 功能介绍

- **反向代理管理**：通过简单的表单添加、编辑和删除反向代理设置，支持 HTTP、HTTPS 和 WebSocket。
- **用户界面**：提供直观的 Web 界面，方便进行各种配置，适合不熟悉命令行操作的用户。
- **SSL 管理**：支持 Let’s Encrypt 自动生成和更新 SSL 证书，轻松启用 HTTPS。
- **访问控制**：设置基本的身份验证，限制对某些服务的访问。
- **安装简单**：通过 Docker 快速部署，方便集成到现有的容器环境中。
- **日志查看**：提供访问日志和错误日志的查看功能，帮助用户监控和排查问题。

## Docker 部署

部署 Nginx Proxy Manager 非常简单，只需要几步：

1. **安装 Docker 和 Docker-Compose**：确保你的系统上已经安装了 Docker 和 Docker Compose。

2. **创建 Docker Compose 文件**：在你的服务器上创建一个目录，比如 `nginx-proxy-manager`，然后在该目录下创建一个 `docker-compose.yml` 文件，并填入以下内容：

```yaml [docker-compose.yml]
version: "3"
services:
  app:
    image: "jc21/nginx-proxy-manager:latest"
    restart: unless-stopped
    ports:
      - "80:80" # HTTP 端口
      - "81:81" # 管理界面端口
      - "443:443" # HTTPS 端口
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

3. **启动服务**：在包含 `docker-compose.yml` 文件的目录下运行以下命令来启动服务：

```bash
docker-compose up -d
```

4. **访问管理界面**：部署成功后，通过 `http://<你的服务器IP>:81` 访问 Nginx Proxy Manager 的管理界面。默认的登录邮箱和密码分别是 `admin@example.com` 和 `changeme`。

5. **配置反向代理**：登录后，你可以开始添加反向代理。点击 “Add Proxy Host” 并填写相关信息，如域名、转发的主机/IP 和端口等。

6. **申请 SSL 证书**（可选）：如果需要 HTTPS，可以通过 Nginx Proxy Manager 申请 Let's Encrypt 证书。

## 注意事项

- 确保在部署前你的服务器上没有运行占用 80、81 和 443 端口的服务。
- 第一次登录后，建议立即修改默认密码，提高安全性。
- 如果需要使用自定义 SSL 证书，可以在管理界面上传你的证书文件。

通过以上步骤，你可以轻松地在你的服务器上部署 Nginx Proxy Manager，并开始管理你的反向代理服务。
