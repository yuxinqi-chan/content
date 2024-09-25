---
title: python集成mt5，并暴露api给外部服务调用
description: 当只想用外部信号使mt5下单而不想使用EA时，可以通过python集成mt5，并暴露api给外部服务调用
image:
  src: /images/f4aa1264a093830028aa7f1cb20a881b.jpeg
authors:
  - name: yuxinqi
    to: https://github.com/yuxinqi-chan
    avatar:
      src: https://avatars.githubusercontent.com/u/11438187?s=48&v=4
date: 2024-07-13T00:00:00.000Z
badge:
  label: MT5, Python
sitemap:
  loc: /blogs/python-integrate-mt5-expose-api-for-external-services
---

## 安装依赖

MT5需要numpy版本<2.0，所以需要指定版本安装

```plaintext [requirements.txt]
sanic==24.6.0
MetaTrader5==5.0.4424
numpy==1.26.4
```

```bash
pip install -r requirements.txt
```

## 编写服务端代码

```python [server.py]
import os
from sanic import Sanic, json, text
import MetaTrader5 as mt5
from sanic.exceptions import BadRequest, NotFound

app = Sanic("Mt5ApiProxy")
# 打印mt5包的版本信息
print("MetaTrader5 package author: ", mt5.__author__)
print("MetaTrader5 package version: ", mt5.__version__)
# 可以通过环境变量配置账户信息
account = int(os.getenv("MT5_ACCOUNT_NUMBER"))
password = os.getenv("MT5_PASSWORD")
server = os.getenv("MT5_SERVER")
if not mt5.initialize(login=account, server=server, password=password):
    print("initialize() failed, error code =", mt5.last_error())
    quit()


@app.get("/health")
async def health(request):
    return text("ok")


@app.get("/account_info")
async def account_info(request):
    account_info = mt5.account_info()
    return json(account_info._asdict())


@app.get("/terminal_info")
async def terminal_info(request):
    terminal_info = mt5.terminal_info()
    return json(terminal_info._asdict())


@app.get("/symbol_info")
async def symbol_info(request):
    symbol = request.args.get("symbol")
    if not symbol:
        raise BadRequest("Symbol is required")
    selected = mt5.symbol_select(symbol, True)
    if not selected:
        raise NotFound("Symbol not found")
    symbol_info = mt5.symbol_info(symbol)
    if symbol_info is None:
        raise NotFound("Symbol not found")
    return json(symbol_info._asdict())


@app.get("/positions_get")
async def positions_get(request):
    params = {}
    symbol = request.args.get("symbol")
    if symbol:
        params["symbol"] = symbol
    group = request.args.get("group")
    if group:
        params["group"] = group
    ticket = request.args.get("ticket")
    if ticket:
        params["ticket"] = ticket
    positions = mt5.positions_get(**params)
    return json(list(map(lambda p: p._asdict(), positions)))


@app.get("/positions_total")
async def position_total(request):
    total = mt5.positions_total()
    return json(total)


@app.get("/orders_get")
async def orders_get(request):
    params = {}
    symbol = request.args.get("symbol")
    if symbol:
        params["symbol"] = symbol
    group = request.args.get("group")
    if group:
        params["group"] = group
    ticket = request.args.get("ticket")
    if ticket:
        params["ticket"] = ticket
    orders = mt5.orders_get(**params)
    return json(list(map(lambda o: o._asdict(), orders)))


@app.get("/orders_total")
async def orders_total(request):
    total = mt5.orders_total()
    return json(total)


@app.post("/order_check")
async def order_check(request):
    data = request.json
    if hasattr(data, "action"):
        data["action"] = getattr(mt5, data["action"])
    if hasattr(data, "type"):
        data["type"] = getattr(mt5, data["type"])
    if hasattr(data, "type_filling"):
        data["type_filling"] = getattr(mt5, data["type_filling"])
    if hasattr(data, "type_time"):
        data["type_time"] = getattr(mt5, data["type_time"])
    order = mt5.order_check(data)
    return json(order._asdict())


@app.post("/order_send")
async def order_send(request):
    data = request.json
    if hasattr(data, "action"):
        data["action"] = getattr(mt5, data["action"])
    if hasattr(data, "type"):
        data["type"] = getattr(mt5, data["type"])
    if hasattr(data, "type_filling"):
        data["type_filling"] = getattr(mt5, data["type_filling"])
    if hasattr(data, "type_time"):
        data["type_time"] = getattr(mt5, data["type_time"])
    order = mt5.order_send(data)
    return json(order._asdict())

```

## 启动服务端

```bash
sanic server:app --port 8000 --single-process
```

## 调用服务端

```bash
curl http://localhost:8000/health
```

后续就可以尝试通过 TradingView 等外部服务调用服务端，想保证安全可以额外再每个接口添加 Token 校验

## 参考

- [MetaTrader 5 Python Integration](https://www.mql5.com/en/docs/python_metatrader5)
- [Sanic](https://sanic.dev/en/guide/getting-started.html)
