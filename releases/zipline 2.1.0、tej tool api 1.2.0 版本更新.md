`預計更新時間：2024/10/30（三）`
---
此次版本更新的範圍
1. zipline-tej 2.0.0 -> 2.1.0
2. tej-tool-api 1.1.1 -> 1.2.0 

## 更新方式

在 IDE 中依序輸入以下 2 行程式以更新版本
```python
!pip install --upgrade zipline-tej
!pip install --upgrade tej-tool-api
```

## python版本提醒：
  - 未來的版本更新將不針對低於 python 3.11 的環境特別進行維護，因較舊的 python 版本可能存在安全漏洞。
  - 升級環境（安裝方式：[lecture/Install TQuant Lab.ipynb](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Install%20TQuant%20Lab.ipynb)），並安裝新版 TQuant Lab 程式，若有安裝問題請聯絡TEJ客服。
  - 先前利用 yml 建立的 python 3.8 環境目前仍舊可以繼續使用，但開發團隊已不再針對該環境特別進行維護。


以下分別說明更新項目：


# zipline

## 功能新增

### 1. 新增設定回測成交價格設定，於initialize中加入`set_execution_price_type`，參數為 open , high , close , low。

```python
def initialize(context):
    ...
    context.set_execution_price_type('open') # open , high , close , low 
    ...
```


### 2.  於 `zipline.data.run_ingest` 中新增 `simple_ingest` 功能，使得ingest更加容易。

```python
import os 
os.environ['TEJAPI_KEY'] = '<your_key>'
...
from zipline.data.run_ingest import simple_ingest
# 價量資料
simple_ingest(name = 'tquant' , tickers = ['2330'] , start_date = '20200101' , end_date = '20220101')
# 基本面資料
simple_ingest(name = 'fundamentals' , tickers = ['2330'] , start_date = '20200101' , end_date = '20220101' , fields = ["eps"])
...
```

### 3. 新增預設網域，未來在 `import zipline` 之前，僅需設定 `TEJAPI_KEY` 即可，預設網域為 `https://api.tej.com.tw`。

```python
# 原先
import os
os.environ['TEJAPI_BASE'] = "https://api.tej.com.tw"
os.environ['TEJAPI_KEY'] = '<your_key>'
import zipline

# 現在
import os
os.environ['TEJAPI_KEY'] = '<your_key>'
import zipline
```

### 4. Annotation 部分新增 `先買後賣交易限制`。

### 5. class TargetPercentPipeAlgo 新增 `min_long_count` 與 `min_short_count` 參數，以用於確定再平衡的**最小做多檔數**必須大於`min_long_count`或**最小做空檔數**大於`min_short_count`才會進行再平衡。

### 6. 將 PctSlippage 滑價模型加入至zipline.api

```python
from zipline.api import PctSlippage
...
```

### 7. 新增 TW_Slippage 滑價模型

```
TW_Slippage 說明 :

"""

Simple custom model for Taiwan Market.

Parameters

spread : float, optional

    Size of the assumed spread for all assets.

    Orders to buy will be filled at either limit_up price or ``execute_price + (spread * tick_diff)``.

    Orders to sell will be filled at either limit_down price or ``execute_price - (spread * tick_diff)``.

volume_limit : float, optional

    Maximum percent of historical volume that can fill in each bar. 0.5

    means 50% of historical volume. 1.0 means 100%. Default is 0.025 (i.e.,

    2.5%).

"""
```

```python
from zipline.finance.slippage import TW_Slippage
from zipline.api import set_slippage
...
def initialize(context) :
    ...
    set_slippage(TW_Slippage(spread = 2 , volume_limit = 0.025))
    ...
...
```


## 功能調整

### 1. 在回測期間基於當前交易價格，而非收盤價，修改 `order_value`、`order_target_value`、`order_percent` 和 `order_target_percent` 函數來計算數量和目標金額，確保在多變的市場條件下進行更精確的交易模擬。

### 以下將針對有改動的部分以表格進行列示

#### 1. order_value 

| 成交方式 | price_type | 下單股數 | 
| --- | --- | --- | 
| current_bar | open | value/ open(t) |
| current_bar | high | value/ high(t) |
| current_bar | low | value/ low(t) |

#### 2. order_target_value 

| 成交方式 | price_type | 目標股數 | 下單股數 | 
| --- | --- | --- | --- | 
| current_bar | open | value/open(t) | 目標股數 - 帳上持有股數(t期初，經除權調整) |
| current_bar | high | value/high(t) | 目標股數 - 帳上持有股數(t期初，經除權調整) |
| current_bar | low | value/low(t) | 目標股數 - 帳上持有股數(t期初，經除權調整) |

#### 3. order_percent

| 成交方式 | price_type | 下單價值 | 下單股數 | 
| --- | --- | --- | --- |
| current_bar | open | portfolio_value (t期初，經除權調整) * percent | value/open(t) | 
| current_bar | high | portfolio_value (t期初，經除權調整) * percent | value/high(t) | 
| current_bar | low | portfolio_value (t期初，經除權調整) * percent | value/low(t) | 
| current_bar | close | portfolio_value (t期初，經除權調整) * percent | value/close(t) | 

#### 4. order_target_percent

| 成交方式 | price_type | 目標價值 | 目標股數 | 下單股數 | 
| --- | --- | --- | --- | --- |
| current_bar | open | portfolio_value (t期初，經除權調整) * percent | value/open(t) | 目標價值 - 帳上持有股數(t期初，經除權調整) | 
| current_bar | high | portfolio_value (t期初，經除權調整) * percent | value/high(t) | 目標價值 - 帳上持有股數(t期初，經除權調整) | 
| current_bar | low | portfolio_value (t期初，經除權調整) * percent | value/low(t) | 目標價值 - 帳上持有股數(t期初，經除權調整) | 
| current_bar | close | portfolio_value (t期初，經除權調整) * percent | value/close(t) | 目標價值 - 帳上持有股數(t期初，經除權調整) | | 

# tej-tool-api
---
## bug修復 (目前已測試到pandas 2.2.2 , dask 2024.9.1 , dask-expr 1.1.15)

1. 修復較新版dask與pandas使用時可能會遇到string變成PyArrow導致資料型態不匹配的問題

2. 修復較新版dask與pandas使用時可能會遇到mdate資料型態不匹配的問題

## 功能新增

### 1. 顯示所有可以使用的欄位，參數為chinese , if True 使用中文 , false回傳英文欄位名稱

```python
import TejToolAPI
TejToolAPI.show_columns(chinese = True)
```

### 2. 新增get_history_data 的參數說明，

```python
ticker : list , 公司碼

columns : list , 欄位

fin_type : list , 累計,單季,移動四季(A,Q,TTM) (optional)

include_self_acc : ["Y","N"] , 是否包含公司自結 (optional)

start : str , 資料起始日 (YYYY-MM-DD) (optional)

end : str , 資料結束日 (YYYY-MM-DD) (optional)

npartitions : int , 每組資料數量 (optional)

require_annd : bool , 是否需要公告日欄位 (optional)

transfer_to_chinese : bool , 欄位是否轉換為中文 (optional)

show_progress : bool , 顯示流量狀況 (optional)
```
或在Jupyter Notebook中使用
```python
TejToolAPI.get_history_data?
```
## 異動

### 1. 更新月營收邏輯，將採用當下最新的月營收，若有重新公告的月營收將以公告時日進行更新；同時，重新公告過時的月營收將不會覆蓋。

```python
# 範例
import tejapi
tejapi.ApiConfig.api_base = 'https://api.tej.com.tw'
tejapi.ApiConfig.api_key = '<your_key>'
#  d0001 為月營收_千元
df = tejapi.fastget('TWN/APISALE1' , coid = ['6186'] , mdate  = {'gte': '20230101' , 'lte': '20230501'} , opts = { 'columns' : ['coid' , 'mdate' , 'key3' , 'annd_s' , 'd0001']  })
df = df.rename({'d0001':'月營收' , 'annd_s' : '公告日'}, axis=1)
# df 輸出
coid mdate      key3 公告日      月營收
6186 2023-01-01 1.0  2023-02-10 139310.0
6186 2023-02-01 1.0  2023-03-09 9789.0
6186 2023-03-01 1.0  2023-04-10 859024.0
6186 2023-03-01 2.0  2023-04-17 162844.0
6186 2023-04-01 1.0  2023-05-10 1022.0
6186 2023-05-01 1.0  2023-06-06 52945.0
# TejToolAPI比較(程式碼相同)
import os
os.environ['TEJAPI_KEY'] = '<your_key>'
import TejToolAPI
df = TejToolAPI.get_history_data(ticker=['6186'] , columns=['單月營收_千元'] , start = '20230406' , end = '20230420')

# 左邊為舊版的輸出結果 , 右邊為新板的輸出結果
coid mdate      月營收(舊版) 月營收(新版)
6186 2023-04-06 9789        9789
6186 2023-04-07 9789        9789
6186 2023-04-10 162844      859024
6186 2023-04-11 162844      859024
6186 2023-04-12 162844      859024
6186 2023-04-13 162844      859024
6186 2023-04-14 162844      859024
6186 2023-04-17 162844      162844
6186 2023-04-18 162844      162844
6186 2023-04-19 162844      162844
6186 2023-04-20 162844      162844
```


### 2. 新增預設網域，未來在 `import TejToolAPI` 之前，僅需設定 `TEJAPI_KEY` 即可，預設網域為 `https://api.tej.com.tw`。

## 欄位新增
| 新增      |            |                        |
|-----------|---------------|------------------------|
| 中文名稱      |  英文名稱         | 備註              |
| Q1_除息融券最後回補日    | Q1_Ex-Dividends_Final_Short-covering_Date |  |
| Q2_除息融券最後回補日    | Q2_Ex-Dividends_Final_Short-covering_Date      |   |
| Q3_除息融券最後回補日 | Q3_Ex-Dividends_Final_Short-covering_Date  |   |
| Q4_除息融券最後回補日    | Q4_Ex-Dividends_Final_Short-covering_Date |  |
| 月營收備註說明    | Revenue_Remark      |   |
| 暫停當沖先買後賣註記 | Suspension_of_Sell_After_Day_Trading_Fg  |   |
