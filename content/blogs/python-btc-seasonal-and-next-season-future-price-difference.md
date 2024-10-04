---
title: python画出BTC当季和次季交割合约价差
description: BTC当季和次季交割合约存在价差，通过python分析价差的波动情况
image:
  src: /images/510a69f7dc98f2cea6feb1b023137bf5.jpeg
authors:
  - name: yuxinqi
    to: https://github.com/yuxinqi-chan
    avatar:
      src: https://avatars.githubusercontent.com/u/11438187?s=48&v=4
date: 2024-06-13T00:00:00.000Z
badge:
  label: BTC, Python
---

## 下载数据

币安网页下载太麻烦了，所以找出下载链接用代码拼接后下载，简单看下4h粒度的。

这里假设每份交割合约都有前6个月的数据，实际下载下来发现只有23年12月之后的有6个月的数据，这导致后面能计算价差的只有23到24年的数据了

```python
import requests
import os

# 定义合约列表
contracts = [
    "BTCUSDT_210326", "BTCUSDT_210625", "BTCUSDT_210924", "BTCUSDT_211231",
    "BTCUSDT_220325", "BTCUSDT_220624", "BTCUSDT_220930", "BTCUSDT_221230",
    "BTCUSDT_230331", "BTCUSDT_230630", "BTCUSDT_230929", "BTCUSDT_231229",
    "BTCUSDT_240329", "BTCUSDT_240628", "BTCUSDT_240927"
]


# 定义下载函数
def download_data(contract):
    # 假设每个合约有6个月的数据，从合约日期开始的前6个月
    end_year = int(contract[-6:-4])
    end_month = int(contract[-4:-2])

    for i in range(6):
        month = (end_month - i - 1) % 12 + 1
        year = end_year if month <= end_month else end_year - 1
        month_str = f"20{year}-{month:02d}"
        url = f"https://data.binance.vision/data/futures/um/monthly/klines/{contract}/4h/{contract}-4h-{month_str}.zip"

        # 创建目录
        os.makedirs(f"data/{contract}", exist_ok=True)

        # 下载数据
        response = requests.get(url)
        if response.status_code == 200:
            with open(f"data/{contract}/{contract}-4h-{month_str}.zip", 'wb') as f:
                f.write(response.content)
            print(f"Downloaded {contract}-4h-{month_str}.zip")
        else:
            print(f"Failed to download {contract}-4h-{month_str}.zip")


# 遍历合约并下载数据
for contract in contracts:
    download_data(contract)
```

## 解压

```python
import os
import zipfile

def unzip_files(root_directory):
    # Walk through all directories and subdirectories
    for dirpath, dirnames, filenames in os.walk(root_directory):
        for filename in filenames:
            if filename.endswith('.zip'):
                # Construct the full file path
                file_path = os.path.join(dirpath, filename)
                # Open the zip file
                with zipfile.ZipFile(file_path, 'r') as zip_ref:
                    # Extract to the same directory as the zip file
                    zip_ref.extractall(dirpath)
                    print(f"Unzipped {filename} in {dirpath}")

# Call the function, replace 'path_to_root_directory' with your directory path
unzip_files('data')
```

![v2-16e1ec3252b8cde8096b47c458dc4ed3_720w.png](/images/v2-16e1ec3252b8cde8096b47c458dc4ed3_720w.png)![v2-8cf127e386d26d345f604f8fa7637089_720w.png](/images/v2-8cf127e386d26d345f604f8fa7637089_720w.png)

## 画图

```python
import pandas as pd
import glob
import matplotlib.pyplot as plt


def read_all_month(path):
    # 读取CSV文件
    # 创建一个空的列表来存储每个月的数据
    dataframes = []
    # 循环读取每年的数据
    for filename in glob.glob(path):
        # 读取数据
        df = pd.read_csv(filename)
        # 将数据添加到列表中
        dataframes.append(df)
    # 使用pd.concat函数将所有月份的数据拼接到一起
    data = pd.concat(dataframes)
    # data.columns = ["open_time", "open", "high", "low", "close", "volume", "close_time", "quote_asset_volume",
    #                 "number_of_trades", "taker_buy_base_asset_volume", "taker_buy_quote_asset_volume", "ignore"]
    data["open_time"] = pd.to_datetime(data["open_time"], unit="ms")
    data["close_time"] = pd.to_datetime(data["close_time"], unit="ms")
    data = data.set_index("open_time")
    return data

# 连接价差
concat = pd.DataFrame()
symbol = ['BTCUSDT_231229', 'BTCUSDT_240329', 'BTCUSDT_240628', 'BTCUSDT_240927']
for i in range(0, len(symbol) - 1):
    # 近期交割合约
    recent = read_all_month(f'./data/{symbol[i]}/*.csv')
    # 远期交割合约
    forward = read_all_month(f'./data/{symbol[i + 1]}/*.csv')
    # 价差
    offset = forward["close"] - recent["close"]
    # 比例
    # offset = (forward["close"] - recent["close"]) / recent["close"]
    concat = pd.concat([concat, offset], axis=1)

# 画出连接价差
concat.columns = symbol[1:]
concat.plot()
plt.show()
```

![v2-9c3ea8f4f723645f57ada9e7f77d405f_720w.png](/images/v2-9c3ea8f4f723645f57ada9e7f77d405f_720w.png)

可以看到在一定范围内波动，但23年btc价格低，24年价格高，所以不能只看价差，还要看比例。

如果真要用来套利也是一边做多一边做空，对冲掉现货的涨跌后，最后盈利也是看比例的变化。

![v2-ed9168bf0bc50e9227791cb566f79d16_720w.png](/images/v2-ed9168bf0bc50e9227791cb566f79d16_720w.png)

换成比例后看出，过去大体上在1%-7%内波动，大涨的时候，预期变好价差扩大。

波动虽说能覆盖0.02%的手续费，但实际交易时可能还要处理移仓之类的情况，比较麻烦，数据也还不够多。
