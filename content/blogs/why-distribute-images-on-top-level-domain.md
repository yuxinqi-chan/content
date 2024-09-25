---
title: "为什么要在一级域名上分发图片"
description: "当浏览器发出静态图像请求并将 Cookie 与请求一起发送时，服务器不会使用这些 Cookie。"
image:
  src: /images/e94f63b8654fffb30601f04b422c4d32.jpeg
authors:
  - name: yuxinqi
    to: https://github.com/yuxinqi-chan
    avatar:
      src: https://avatars.githubusercontent.com/u/11438187?s=48&v=4
date: 2023-08-25
badge:
  label: CDN
sitemap:
  loc: /blogs/why-distribute-images-on-top-level-domain
---

## 好处

当浏览器发出静态图像请求并将 Cookie 与请求一起发送时，服务器不会使用这些 Cookie。因此，他们只是无缘无故地创建网络流量。您应该确保使用无 cookie 请求来请求静态组件。创建一个子域并在其中托管所有静态组件。

## 解决方案

如果您的域是 www.example.org ，则可以在 static.example.org 上托管静态组件。但是，如果您已经在顶级域上设置了 Cookie example.org 而不是 www.example.org ，则对 static.example.org 的所有请求都将包含这些 Cookie。在这种情况下，您可以购买一个全新的域，在那里托管您的静态组件，并保持此域无 cookie。雅虎使用 yimg.com，YouTube 使用 ytimg.com，亚马逊使用 images-amazon.com 等等。

## 其他

在无 Cookie 的域上托管静态组件的另一个好处是，某些代理可能会拒绝缓存使用 Cookie 请求的组件。与此相关的是，如果您想知道应该将 example.org 还是 www.example.org 用于您的主页，请考虑 cookie 的影响。省略 www 让您别无选择，只能将 cookie 写入 \*.example.org，因此出于性能原因，最好使用 www 子域并将 cookie 写入该子域。
