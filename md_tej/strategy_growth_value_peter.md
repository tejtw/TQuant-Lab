# 彼得‧林區選股哲學實踐：成長與價值兼具的量化策略

- [彼得‧林區選股哲學實踐：成長與價值兼具的量化策略](#彼得林區選股哲學實踐成長與價值兼具的量化策略)
  - [前言](#前言)
  - [投資標的 ＆ 回測期間](#投資標的--回測期間)
  - [策略邏輯](#策略邏輯)
  - [股票篩選程式碼展示](#股票篩選程式碼展示)
    - [導入套件](#導入套件)
  - [匯入股票池（所有曾經上下市櫃的普通股）](#匯入股票池所有曾經上下市櫃的普通股)
  - [匯入股票財務資訊](#匯入股票財務資訊)
  - [處理資料](#處理資料)
  - [匯入回測資料](#匯入回測資料)
  - [回測架構](#回測架構)
  - [績效圖表＆分析](#績效圖表分析)
  - [績效圖表＆分析](#績效圖表分析-1)

---

## 前言

彼得‧林區（Peter Lynch）是美國基金界傳奇人物，曾於 1977 至 1990 年間擔任 **富達麥哲倫基金（Fidelity Magellan Fund）** 經理人。  
其間基金資產規模從 2,000 萬美元成長至 140 億美元，年化報酬率高達 **29.2%**，堪稱史上最成功的基金經理之一。  

他不僅以績效聞名，更以深入淺出的投資哲學啟發無數散戶與專業投資人。  
林區倡導「**投資你所熟悉的企業**」（Invest in what you know），認為個人投資者擁有觀察生活的優勢，能在企業基本面反映於股價前率先發現潛力股。  

其投資哲學強調：  
- 選股應建立在 **企業獲利能力、成長性與財務穩健**  
- 使用 **本益比 (P/E)、盈餘成長率 (EPS Growth)** 等指標  
- 發掘「**被低估的成長股**」  

---

## 投資標的 ＆ 回測期間

- **投資標的**：台灣證交所與櫃買中心所有上市櫃公司  
- **資料範圍**：2017 年起股價、財報、董監事持股等基礎資料  
- **回測期間**：2018-01-01 至 2025-04-29  
- **理由**：策略邏輯需引用最近一年財務資訊，因此將回測期起點設在 2018 年，以確保資料完整性。  

---

## 策略邏輯

彼得．林區的投資哲學：  
- 強調 **成長 + 價值兼具** 的企業  
- 不依賴市場時機或總體經濟預測  
- 注重 **公司本身與財務體質**  

本文將林區的核心財務標準轉化為 **五項量化條件**：  

1. **最近一季負債比率 ≤ 25%**  
   - 過高的槓桿會增加償債壓力  
   - 控制在 25% 以下確保財務體質良好  

2. **每股淨現金 > 產業平均值**  
   - 反映短期流動性與資本結構彈性  
   - 要求高於同產業平均，顯示現金優勢  

3. **P/FCF < 產業平均值**  
   - P/FCF = 股價 ÷ 每股自由現金流  
   - 代表現金創造力強且估值合理  

4. **存貨成長率 < 營收成長率**  
   - 避免存貨累積 > 銷售成長  
   - 篩選產銷協調良好的企業  

5. **(1年平均盈餘成長率 + 現金股息率) ÷ P/E ≥ 2**  
   - 確保「高成長 + 穩定配息 + 合理估值」  

---

👉 在實務操作上：  
- 通過上述條件的股票 → **等權重買入**  
- **持有至下一次再平衡日**（每 30 天換股一次）  

## 股票篩選程式碼展示

### 導入套件

```python
import pandas as pd
import numpy as np
import tejapi
import os
import datetime

start = '2017-01-01'
end   = '2025-04-29'

os.environ['TEJAPI_KEY'] = 'Your Key'
```
## 匯入股票池（所有曾經上下市櫃的普通股）
```python
from logbook import Logger, StderrHandler, INFO

log_handler = StderrHandler(
    format_string='[{record.time:%Y-%m-%d %H:%M:%S.%f}]: {record.level_name}: {record.func_name}: {record.message}',
    level=INFO
)
log_handler.push_application()
log = Logger('get_universe')

from zipline.sources.TEJ_Api_Data import get_universe

# 由文字型態轉為 Timestamp，供回測使用
tz = 'UTC'
start_dt, end_dt = pd.Timestamp(start, tz=tz), pd.Timestamp(end, tz=tz)

# 取得歷史全體普通股（含曾上下市櫃）
pool = get_universe(start=start_dt,
                    end=end_dt,
                    mkt=['TWSE', 'OTC'],
                    stktp_e=['Common Stock-Foreign', 'Common Stock'])
```
## 匯入股票財務資訊
```python
import TejToolAPI

columns = [
    '主產業別_中文', '報酬率', '收盤價', '本益比', '現金及約當現金',
    '非流動負債合計', '負債比率', '營收成長率', '現金股利率', '稅後淨利成長率',
    '存貨', '營運產生現金流量', '投資產生現金流量', '個股市值_元', '加權平均股數'
]

data__ = TejToolAPI.get_history_data(start=start_dt,
                                     end=end_dt,
                                     ticker=pool,
                                     fin_type=['Q'],   # 使用季資料
                                     columns=columns,
                                     transfer_to_chinese=True)
```
## 處理資料
```python 
# 以存貨變動為基礎計算存貨成長率（將變動日往後灌入）
inv_change_df = data__.copy()
inv_change_df['存貨變動'] = inv_change_df.groupby('股票代碼')['存貨_Q'].diff().ne(0)
inv_change_df = inv_change_df.loc[inv_change_df['存貨變動'], ['股票代碼', '日期', '存貨_Q']]

inv_change_df['存貨成長率'] = inv_change_df.groupby('股票代碼')['存貨_Q'].pct_change()
inv_change_df.loc[inv_change_df['存貨成長率'] == 0, '存貨成長率'] = np.nan

# 把變動日對齊到日資料中，並向後填入
idx = pd.MultiIndex.from_frame(data__.loc[:, ['股票代碼', '日期']])
inv_growth_series = (
    inv_change_df
    .set_index(['股票代碼', '日期'])['存貨成長率']
    .reindex(idx)
    .groupby(level=0)
    .ffill()
)

data__['存貨成長率'] = inv_growth_series.values

# 單位調整與衍生指標
data__['個股市值(千)'] = data__['個股市值_元'] / 1000
data__['每股淨現金'] = (data__['現金及約當現金_Q'] - data__['非流動負債合計_Q']) / data__['加權平均股數_Q'] * 1000
data__['每股自由現金流'] = (data__['營運產生現金流量_Q'] - data__['投資產生現金流量_Q']) / data__['加權平均股數_Q'] * 1000

# 1年期（252 交易日）移動平均指標
data__['1年平均稅後淨利成長率'] = (
    data__.groupby('股票代碼')['稅後淨利成長率_Q']
    .rolling(252).mean().reset_index(level=0, drop=True)
)
data__['1年平均現金股利率'] = (
    data__.groupby('股票代碼')['現金股利率']
    .rolling(252).mean().reset_index(level=0, drop=True)
)

# 簡易 Sharpe（以近 252 日報酬率均值 / 標準差）
data__['sharpe_ratio'] = (
    data__.groupby('股票代碼')['報酬率'].rolling(252).mean().reset_index(0, drop=True) /
    data__.groupby('股票代碼')['報酬率'].rolling(252).std().reset_index(0, drop=True)
)
```
## 匯入回測資料
```python
from zipline.data.run_ingest import simple_ingest

pools = pool + ['IR0001']  # 加入加權指數做基準

start_ingest = start.replace('-', '')
end_ingest   = end.replace('-', '')

print('開始匯入回測資料')
simple_ingest(name='tquant', tickers=pools, start_date=start_ingest, end_date=end_ingest)
print('結束匯入回測資料')
```

## 回測架構

```python
from zipline.pipeline import Pipeline
from zipline.pipeline.factors import Returns
from zipline.pipeline.filters import SingleAsset
from zipline.api import (
    set_slippage, set_commission, set_benchmark,
    symbol, record, order_target_percent, pipeline_output, attach_pipeline
)
from zipline.finance import commission, slippage

def initialize(context):
    # 交易成本＆滑價
    set_slippage(slippage.VolumeShareSlippage(volume_limit=1, price_impact=0.01))
    set_commission(commission.Custom_TW_Commission())

    # 基準指數（加權）
    set_benchmark(symbol('IR0001'))

    # 狀態管理
    context.i = 0
    context.state = False
    context.order_tickers = []
    context.last_tickers = []

def compute_stock(date, data):
    """
    根據指定的日期進行選股，回傳符合條件的股票清單（最多 20 檔）。
    """
    # 提取指定日期的股票資訊
    df = data[data['日期'] == pd.Timestamp(date)].reset_index(drop=True)

    # 條件 1：負債比率 ≤ 產業平均（此處採你提供的版本）
    set_1 = set(df[df['負債比率_Q'] <= df.groupby('主產業別_中文')['負債比率_Q'].transform('mean')]['股票代碼'])

    # 條件 2：每股淨現金 > 產業平均
    df['產業平均每股淨現金'] = df.groupby('主產業別_中文')['每股淨現金'].transform('mean')
    set_2 = set(df[df['每股淨現金'] > df['產業平均每股淨現金']]['股票代碼'])

    # 條件 3：P/FCF < 產業平均
    df['股價/每股自由現金流'] = df['收盤價'] / df['每股自由現金流']
    df['產業平均股價/每股自由現金流'] = df.groupby('主產業別_中文')['股價/每股自由現金流'].transform('mean')
    set_3 = set(df[df['股價/每股自由現金流'] < df['產業平均股價/每股自由現金流']]['股票代碼'])

    # 條件 4：存貨成長率 < 營收成長率
    set_4 = set(df[df['存貨成長率'] < df['營收成長率_Q']]['股票代碼'])

    # 條件 5：(1年平均盈餘成長率 + 現金股息率) / P/E ≥ 2
    df['條件五'] = (df['1年平均稅後淨利成長率'] + df['1年平均現金股利率']) / (df['本益比'])
    set_5 = set(df[df['條件五'] >= 2]['股票代碼'])

    # 交集
    tickers = list(set_1 & set_2 & set_3 & set_4 & set_5)

    # 依 Sharpe 排序，取前 20 檔
    filtered_df = df[df['股票代碼'].isin(tickers)].copy()
    filtered_df = filtered_df[filtered_df['sharpe_ratio'].notna()]
    sorted_df = filtered_df.sort_values(by='sharpe_ratio', ascending=False)
    top_20 = sorted_df['股票代碼'].tolist()[:20]
    return top_20

rebalance_period = 21  # 每 21 交易日（約月更）

def handle_data_1(context, data, rebalance=rebalance_period):
    # 避免前視：在擇股的下一交易日才下單
    if context.state is True:
        print(f"下單日期：{data.current_dt.date()}, 擇股股票數量：{len(context.order_tickers)}")

        # 砍掉已不在名單中的持股
        for i in context.last_tickers:
            if i not in context.order_tickers:
                order_target_percent(symbol(i), 0)

        # 等權建倉
        for i in context.order_tickers:
            order_target_percent(symbol(i), 1 / len(context.order_tickers))
            curr = data.current(symbol(i), 'price')
            record(price=curr, days=context.i)

        context.last_tickers = context.order_tickers
        context.state = False

    backtest_date = data.current_dt.date()

    # 月末（或固定週期）擇股
    if context.i % rebalance == 0:
        context.state = True
        context.order_tickers = compute_stock(date=backtest_date, data=data__)
        print(f"月末擇股名單: {context.order_tickers}")

    context.i += 1
```

## 績效圖表＆分析
```python
from pyfolio.utils import extract_rets_pos_txn_from_zipline
import pyfolio
import matplotlib.pyplot as plt
import matplotlib

# 取得回測結果
returns, positions, transactions = extract_rets_pos_txn_from_zipline(results)
benchmark_rets = results.benchmark_return

# 時區標準化
returns.index = returns.index.tz_localize(None).tz_localize('UTC')
positions.index = positions.index.tz_localize(None).tz_localize('UTC')
transactions.index = transactions.index.tz_localize(None).tz_localize('UTC')
benchmark_rets.index = benchmark_rets.index.tz_localize(None).tz_localize('UTC')

# 字型（如需顯示中文）
matplotlib.rcParams['font.family'] = 'SimHei'
matplotlib.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 槓桿與完整報表
pyfolio.plot_gross_leverage(returns, positions)
pyfolio.tears.create_full_tear_sheet(
    returns=returns,
    positions=positions,
    transactions=transactions,
    benchmark_rets=benchmark_rets
)
```
## 績效圖表＆分析

| 績效指標 / 策略      | 大盤 (Benchmark) | 彼得林區投資策略 |
|----------------------|------------------|------------------|
| 年化報酬率           | 13.598%          | 15.508%          |
| 累積報酬率           | 145.974%         | 176.705%         |
| 年化波動率           | 18.44%           | 21.49%           |
| 夏普值               | 0.78             | 0.78             |
| 卡瑪比率             | 0.48             | 0.55             |
| 期間最大回撤         | -28.553%         | -28.022%         |

七年內累積報酬率 ~ 176.71%、年化 ~ 15.51%，整體略優於基準。

存在正向 Alpha，但與大盤相關性偏高；年化波動 ~ 21.49%。

最大回撤約 -28.02%；建議可加入 曝險控管/風險指標（如 OTC/TSE 比、波動目標、動能濾網）以提升穩定度。