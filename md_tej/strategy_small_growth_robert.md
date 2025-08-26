# 從 ***羅伯．加迪納*** 的選股法出發：在台股尋找小型成長黑馬

- [從 ***羅伯．加迪納*** 的選股法出發：在台股尋找小型成長黑馬](#從-羅伯加迪納-的選股法出發在台股尋找小型成長黑馬)
  - [前言](#前言)
  - [選股條件說明](#選股條件說明)
  - [選股條件](#選股條件)
  - [回測整體架構說明](#回測整體架構說明)
  - [資料撈取與前處理程式碼展示](#資料撈取與前處理程式碼展示)
    - [主要財務代碼](#主要財務代碼)
    - [Python 程式碼](#python-程式碼)
  - [股票篩選函數](#股票篩選函數)
  - [回測架構程式碼展示](#回測架構程式碼展示)
    - [匯入回測資料](#匯入回測資料)
  - [取出加權指數 (TSE) 與櫃買指數 (OTC)](#取出加權指數-tse-與櫃買指數-otc)
  - [策略初始化函數](#策略初始化函數)
  - [下單與持倉邏輯](#下單與持倉邏輯)
  - [回測架構程式碼展示（續）](#回測架構程式碼展示續)
    - [視覺化與績效分析函數](#視覺化與績效分析函數)
  - [執行回測](#執行回測)
  - [策略績效分析 ＆ 圖表（重點解讀）](#策略績效分析--圖表重點解讀)
  - [績效表格](#績效表格)

---

## 前言

在投資市場中，小型成長股因具備高度成長潛力與價格彈性，長期以來吸引著專業投資人與基金經理人的關注。  
美國知名基金經理人 **羅伯．加迪納（Robert Gardiner）** 便是此領域中的代表人物。  

他以管理 **瓦薩屈微型股基金（Wasatch Micro Cap Fund）** 聞名，曾在 2000 年與 2001 年美股震盪期間，依然交出超過三成與近五成的年報酬率，表現遠勝大盤，顯示其選股邏輯具備極強的抗震與增長能力。  

羅伯．加迪納的選股策略核心在於尋找 **市值偏小、盈餘成長力強且具備基本面優勢** 的公司。  
他透過獨創的 **ABGC 架構**，結合 **GARP（合理成長價格）** 理念，聚焦於 **PEG 值低於 1** 的潛力股，建構出一套系統性但具彈性的投資方法。  

為驗證此策略在台股市場的可行性，本文將依據加迪納的篩選精神，提出可量化的選股準則，並以台灣股市為對象進行回測，進一步探討小型成長股策略在本地市場的實證效果。

---

## 選股條件說明

在模仿羅伯．加迪納的選股策略時，我們聚焦在他最核心的投資理念：  
**投資於具備強勁成長潛力的小型企業，並以合理價格買進。**

雖然他在挑選企業時也會納入主觀判斷（例如經營團隊與競爭優勢），但為了便於量化實作，  
本文將條件轉化為以下幾個可計算的財務指標。

---

## 選股條件

1. **小型市值公司**  
   - 選取總市值低於市場平均的 30%。  
   - 聚焦於小型與微型成長股，加迪納認為這類公司尚未被市場充分關注，成長空間較大。  

2. **預估盈餘成長率 > 15%**  
   - 僅保留未來一年預估盈餘成長率超過 15% 的公司。  
   - 強勁的盈餘成長是股價推升的主要驅動力，也是成長型策略的核心。  

3. **近四季毛利率 > 產業平均**  
   - 比較公司近四季毛利率與所屬產業的平均水準。  
   - 毛利率高代表產品具備競爭力，有較強議價能力與經營效率。  

4. **董監持股比率 > 市場平均**  
   - 以董監事持股比率作為指標。  
   - 當管理層與股東利益綁在一起時，能提升治理品質，也反映對未來的信心。  

5. **PEG < 1**  
   - PEG（本益比 ÷ 預估盈餘成長率）作為評價標準。  
   - PEG 小於 1，代表以合理價格買到高成長股票，符合 **GARP 投資法則** 的核心精神。  

6. **PEG 值最小的前 20%**  
   - 在通過上述基本條件的股票中，依 PEG 值由小到大排序，僅挑選最前段的 20%。  
   - PEG 越小代表股價相對便宜、成長性又高，有助於提升投資組合的整體報酬潛力。  

## 回測整體架構說明

為驗證羅伯．加迪納選股邏輯在台股市場的可行性，本研究以 **2015 年 1 月 1 日至 2025 年 5 月 27 日** 為回測期間，  
設計一套具體的策略執行架構並進行回測。整體流程如下：

- **回測期間**：2015-01-01 至 2025-05-27  
- **再平衡頻率**：每 20 個交易日（約等同每月調整一次投資組合）  
- **選股邏輯**：依據選股條件篩出符合小型成長股特質之標的，並從中挑選 PEG 值最低的前 20%  
- **資金配置**：等權重分配至每一期選中的股票，假設無槓桿、無融資  

此策略以 **系統化方式執行加迪納的選股精神**，  
透過等距頻率再平衡與等權重分配，避免個別權重過度偏重某些標的，  
同時控制過度交易的風險。

---

## 資料撈取與前處理程式碼展示

以下展示透過 **TEJToolAPI** 進行資料撈取與前處理的程式碼範例。  

### 主要財務代碼

| TEJ 代碼  | 財務指標 | 中文名稱         |
|-----------|---------|------------------|
| mktcap    | 股票市值 | 市值             |
| per       | 本益比   | Price/Earnings  |
| r405      | 稅後淨利成長率 | Net Income Growth Rate |
| r403      | 營業利潤成長率 | Operating Profit Growth |
| r105      | 營業毛利率 | Gross Margin    |
| fld005    | 董監持股比例 | Insider Holdings |

---

### Python 程式碼

```python
import pandas as pd
import numpy as np
import tejapi
import os
import json
import matplotlib.pyplot as plt

plt.rcParams['font.family'] = 'Arial'

# API 設定
tej_key = 'your key'
tejapi.ApiConfig.api_key = tej_key
os.environ['TEJAPI_BASE'] = "https://api.tej.com.tw"
os.environ['TEJAPI_KEY'] = tej_key

from zipline.sources.TEJ_Api_Data import get_universe
import TejToolAPI
from zipline.data.run_ingest import simple_ingest
from zipline.api import set_slippage, set_commission, set_benchmark, symbol, record, order_target_percent
from zipline.finance import commission, slippage
from zipline import run_algorithm

# 回測時間
start_date = '2010-01-01'
end_date = '2025-05-27'

# 股票池
pool = get_universe(start=start_date,
                     end=end_date,
                     mkt_bd_e=['TSE', 'OTC'],
                     stktp_e=['Common Stock-Foreign','Common Stock'])

# 欄位設定
columns = ['coid', 'Industry', 'roi', 'mktcap', 'r405', 'r403', 'per', 'r105', 'fld005']

# 時間格式
start_dt = pd.Timestamp(start_date, tz='UTC')
end_dt = pd.Timestamp(end_date, tz="UTC")

# 取得資料
data_use = TejToolAPI.get_history_data(start=start_dt,
                                   end=end_dt,
                                   ticker=pool + ['IR0001'],
                                   fin_type=['Q', 'TTM'],
                                   columns=columns,
                                   transfer_to_chinese=False)

# 排序
data_use = data_use.sort_values(['mdate', 'coid'])

# 新增衍生欄位
data_use['avg_mkt'] = data_use.groupby('mdate')['Market_Cap_Dollars'].transform('mean')
data_use['avg_ds_ratio'] = data_use.groupby('mdate')['Director_and_Supervisor_Holdings_Percentage'].transform('mean')
data_use['ind_gross_margin_mean'] = data_use.groupby(['mdate', 'Industry'])['Gross_Margin_Rate_percent_Q'].transform('mean')
data_use['PEG'] = data_use['PER_TWSE'] / data_use['Net_Income_Growth_Rate_TTM']
```

## 股票篩選函數

```python
def compute_stock(date, data):
   df = data[data['mdate'] == pd.to_datetime(date)].reset_index(drop=True)

   set_1 = set(df[df['Market_Cap_Dollars'] <= df['avg_mkt'] * 0.3]['coid'])
   set_2 = set(df[df['Net_Income_Growth_Rate_Q'] >= 15]['coid'])
   set_3 = set(df[df['Gross_Margin_Rate_percent_TTM'] >= df['ind_gross_margin_mean']]['coid'])
   set_4 = set(df[df['Director_and_Supervisor_Holdings_Percentage'] > df['avg_ds_ratio']]['coid'])
   set_5 = set(df[df['PEG'] < 1.0]['coid'])

   passed = set_1 & set_2 & set_3 & set_4 & set_5

   top_n = int(len(passed) * 0.2)

   # 篩選出通過條件的股票
   filtered_df = df[df['coid'].isin(passed)]

   # 排序並取前 top_n 名（PEG 最小）
   top_df = filtered_df.sort_values(by='PEG').head(top_n)
   tickers = list(top_df['coid'])
   sets = [len(set_1), len(set_2), len(set_3), len(set_4), len(set_5)]

   return tickers, sets
```

## 回測架構程式碼展示

以下展示如何將資料匯入 Zipline 並建立回測架構。

---

### 匯入回測資料

```python
pools = pool + ['IR0001', 'IX0043']

start_ingest = start_date.replace('-', '')
end_ingest = end_date.replace('-', '')

print(f'開始匯入回測資料')
simple_ingest(name='tquant', tickers=pools, start_date=start_ingest, end_date=end_ingest)
print(f'結束匯入回測資料')
```
## 取出加權指數 (TSE) 與櫃買指數 (OTC)
```
back_start = '2015-01-01'
codes = ['IR0001', 'IR0043']

co = ['coid','Industry', 'mkt', 'vol', 'open_d', 'high_d', 'low_d', 'close_d', 'roi', 'shares', 'per', 'pbr_tej','mktcap']
data_index = TejToolAPI.get_history_data(start=start_dt,
                                  end=end_dt,
                                  ticker=codes,
                                  columns=co,
                                  transfer_to_chinese=False)

# 篩選時間
data_index = data_index[data_index['mdate'] >= back_start]

# 分別取出 TSE 與 OTC 並標準化
tse = data_index[data_index['coid'] == 'IR0001'][['mdate', 'Close']].copy()
otc = data_index[data_index['coid'] == 'IR0043'][['mdate', 'Close']].copy()
tse.rename(columns={'Close': 'TSE_Close'}, inplace=True)
otc.rename(columns={'Close': 'OTC_Close'}, inplace=True)

# 合併
merged = pd.merge(tse, otc, on='mdate', how='inner')

# 標準化：以首日為基準
merged['TSE_norm'] = merged['TSE_Close'] / merged['TSE_Close'].iloc[0] * 100
merged['OTC_norm'] = merged['OTC_Close'] / merged['OTC_Close'].iloc[0] * 100

# 計算風險偏好比
merged['OTC_TSE_ratio'] = merged['OTC_norm'] / merged['TSE_norm']

# 畫圖
fig, axes = plt.subplots(2, 1, figsize=(12, 8), sharex=True)
axes[0].plot(merged['mdate'], merged['TSE_norm'], label='TSE')
axes[0].plot(merged['mdate'], merged['OTC_norm'], label='OTC')
axes[0].set_title('Normalized Index Performance (Base = 100)')
axes[0].legend()
axes[0].grid(True)

axes[1].plot(merged['mdate'], merged['OTC_TSE_ratio'], label='OTC / TSE')
axes[1].set_title('Risk Appetite Ratio (OTC / TSE)')
axes[1].axhline(1.0, color='gray', linestyle='--', linewidth=1)
axes[1].legend()
axes[1].grid(True)

plt.tight_layout()
plt.show()
```

## 策略初始化函數
```python
def initialize(context, re=20):
   set_slippage(slippage.VolumeShareSlippage(volume_limit=1, price_impact=0.01))
   set_commission(commission.Custom_TW_Commission())
   set_benchmark(symbol('IR0001'))

   context.i = 0
   context.state = False
   context.order_tickers = []
   context.last_tickers = []
   context.rebalance = re
   context.set1 = 0
   context.set2 = 0
   context.set3 = 0
   context.set4 = 0
   context.set5 = 0
   context.set = 0
   context.dic = {}
```
## 下單與持倉邏輯
```python 
def handle_data_1(context, data):
   # 避免前視偏誤，在篩選股票的下一交易日下單
   if context.state == True:

       # 清空未入選的持股
       for i in context.last_tickers:
           if i not in context.order_tickers:
               order_target_percent(symbol(i), 0)

       # 建立新持倉
       for i in context.order_tickers:
           order_target_percent(symbol(i), 1.0 / len(context.order_tickers))
           context.dic[i] = data.current(symbol(i), 'price')

       record(p=context.dic)
       context.dic = {}

       print(f"下單日期：{data.current_dt.date()}, 擇股數量：{len(context.order_tickers)}, Leverage: {context.account.leverage}")
       context.last_tickers = context.order_tickers.copy()
       context.state = False

   backtest_date = data.current_dt.date()

   if context.i % context.rebalance == 0:
       context.state = True
       context.order_tickers = compute_stock(date=backtest_date, data=data_use)[0]
       context.set = compute_stock(date=backtest_date, data=data_use)[1]

   record(tickers=context.order_tickers)
   record(Leverage=context.account.leverage)

   # 控制槓桿
   if context.account.leverage > 1.2:
       print(f'{data.current_dt.date()}: Over Leverage, Leverage: {context.account.leverage}')
       for i in context.order_tickers:
           order_target_percent(symbol(i), 1 / len(context.order_tickers))

   context.i += 1
```
## 回測架構程式碼展示（續）

### 視覺化與績效分析函數

```python
def analyze(context, perf):
    plt.style.use('ggplot')

    # 第一張圖：策略績效與超額報酬、風險偏好比
    fig1, axes1 = plt.subplots(nrows=3, ncols=1, figsize=(18, 15), sharex=False)

    # 策略 vs 基準（以 100 為起點的累積報酬）
    axes1[0].plot(perf.index, perf['algorithm_period_return'], label='Strategy')
    axes1[0].plot(merged['mdate'], (merged['TSE_norm'] / merged['TSE_norm'].iloc[0]) - 1, label='Benchmark [TSE]')
    axes1[0].plot(merged['mdate'], (merged['OTC_norm'] / merged['OTC_norm'].iloc[0]) - 1, label='Benchmark [OTC]')
    axes1[0].set_title("Backtest Results")
    axes1[0].legend()

    # 對 TSE 的超額報酬（柱狀）
    axes1[1].bar(perf.index,
                 perf['algorithm_period_return'] - perf['benchmark_period_return'],
                 label='Excess return', alpha=1.0)
    axes1[1].set_title('Excess Return vs. TSE')
    axes1[1].legend()

    # 風險偏好比（OTC / TSE）
    axes1[2].plot(merged['mdate'], merged['OTC_TSE_ratio'], label='OTC / TSE')
    axes1[2].set_title('Risk Appetite Ratio (OTC / TSE)')
    axes1[2].axhline(1.0, color='gray', linestyle='--', linewidth=1)
    axes1[2].legend()
    axes1[2].grid(True)

    plt.tight_layout()
    plt.show()
```
## 執行回測

```python
results = run_algorithm(
    start=pd.Timestamp(back_start, tz='utc'),
    end=pd.Timestamp(end_date, tz='utc'),
    initialize=initialize,
    handle_data=handle_data_1,
    analyze=analyze,
    bundle='tquant',
    capital_base=1e5
)
```
## 策略績效分析 ＆ 圖表（重點解讀）

- 在第二張子圖的 **超額報酬** 中，可觀察到一段由負轉正並且 **持續超越大盤（TSE）** 的區間；同期間對應到 Rolling Alpha（若另行計算）也由負翻正並維持約一年，顯示策略的 **選股貢獻（alpha）** 顯著。

- 於另一組圖（若額外繪製）中同時呈現：
  - **策略累積報酬 vs OTC/TSE 指數**
  - **Rolling Beta（對 OTC 與 TSE）**
  - **OTC/TSE 比值（風險偏好）**
  - **景氣信號燈分數（若有）**
  
  在藍色區塊中可見：雖然大盤回檔，但策略 **報酬已與大盤脫鉤上行**；同時期的 Beta 約在 **0.5** 左右震盪，代表策略 **不依賴市場報酬**，主要靠選股能力取得超額報酬。

- **2025 年後**，OTC/TSE 比值快速下行，顯示資金偏好大型股、風險偏好轉弱，小型成長股短期 **較難展現優勢**。此階段策略表現受壓，推論需等待 **不確定性下降** 再度展現優勢。

- 就 **回撤** 而言（若繪製深水圖），最大回撤約 **-30%**，波動度偏高；建議輔以簡單市場因子（如 **OTC/TSE 比值**）作為 **降曝或進出場** 的輔助規則，以提升穩定性。

## 績效表格

| 回測指標 | 羅伯加迪納投資法 | 加權股價指數 (大盤) | 櫃買指數 (OTC) |
|---|---:|---:|---:|
| 累積報酬率 | 249.33% | 234.56% | 121.744% |
| 年化報酬率 | 13.257% | 12.77% | 8.25% |
| 年化波動度 | 16.61% | 16.67% | 18.70% |
| 夏普值 | 0.83 | 0.81 | 0.52 |
| 卡瑪比率 | 0.45 | 0.45 | 0.25 |
| 最大回撤 | -29.67% | -28.97% | -33.137% |

> 註：**卡瑪比率**＝年化報酬率 ÷ 期間最大回撤，用於衡量「報酬率對虧損」之比值（概念與風暴比相近），**越高越好**。
