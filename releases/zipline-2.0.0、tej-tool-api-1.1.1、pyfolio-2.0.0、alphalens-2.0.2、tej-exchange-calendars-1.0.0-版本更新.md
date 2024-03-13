# zipline-2.0.0、tej-tool-api-1.1.1、pyfolio-2.0.2、alphalens-2.0.2、tej-exchange-calendars-1.0.0 版本更新

### `預計更新時間：2024/3/13（三） 15:00 ~ 19:00`

## 此次版本更新的範圍
1. zipline-tej 1.0.0 -> 2.0.0
2. tej-tool-api 1.1.0 -> 1.1.1
3. alphalens-tej 1.0.0 -> 2.0.2
4. pyfolio-tej 1.0.0 -> 2.0.2
5. tej-exchange-calendars 0.0.7 -> 1.0.0
6. 資料庫
7. 文件

## 更新方式

在 IDE 中依序輸入以下 5 行程式以更新版本
```
!pip install --upgrade zipline-tej
!pip install --upgrade tej-tool-api
!pip install --upgrade alphalens-tej
!pip install --upgrade pyfolio-tej
!pip install --upgrade tej-exchange-calendars
```

## 更新重點
- **此次更新為重大更新，可能會不兼容過去建立的回測程式碼。**
- **支援 pandas 2.0.0**。
- **支援 python 3.11**：
  - 未來的版本更新將不針對低於 python 3.11 的環境特別進行維護，因較舊的 python 版本可能存在安全漏洞。
  - 煩請撥冗於 **2024/4 月底前**升級環境（安裝方式可以參考 yml：[lecture/Install TQuant Lab.ipynb](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Install%20TQuant%20Lab.ipynb)），並安裝新版 TQuant Lab 程式，若有安裝問題請聯絡TEJ客服。
  - 先前利用 yml 建立的 python 3.8 環境目前仍舊可以繼續使用，但開發團隊預計於 2024/4 月底後將不再針對該環境特別進行維護。
- zipline
  - zipline 新增 **current_bar** 回測功能、fundamentals bundle 新增 **update** 與 **add** 功能。
  - zipline pipeline 中的 `class: TQDataSet` 拆分成財務（`class: TQDataSet`）和非財務（`class: TQAltDataSet`）兩個物件進行管理，故舊有的程式可能無法兼容。
  - 變更 tquant bundle 暫存檔案（由 csv 改為 parquet，以減少使用空間與 IO 時間），故舊有的 bundle 資料可能無法兼容，**請重新 ingest**。 
- tej-tool-api
  - 修正 tej-tool-api 抓不到暫停交易期間公布的最新財報／月營收／集保資料的問題。
  - 原先非交易日（t）公告的資料會合併至**前一個交易日（t-1）**，現在修改成合併至**後一個交易日（t+1）**。
- pyfolio
  - 修改 pyfolio round_trips 的使用方式。

<br>

以下會分別說明更新項目：

## 1. zipline-tej　版本更新
- 版本：2.0.0
- 日期：2024/03/13

<br>

### 更新方式
```
!pip install --upgrade zipline-tej
```

<br>

### 功能新增和重構
- 支援 pandas 2.0.0。
- 支援 python 3.11。
- 新增 zipline 的dependencies：`scipy` >= 1.10.0。
- **zipline update** 與 **zipline add** 功能現在可使用於 fundamentals bundle。（參考：[lecture/Data collection.ipynb](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Data%20collection.ipynb)，此功能將耗費 api_key 的流量）
- `!zipline ingest -b fundamentals`或`!zipline ingest -b tquant`成功後會顯示 log 訊息。範例如下：

    ```python
    INFO: zipline.data.bundles.core: Ingest tquant successfully.
    ```

    ```python
    INFO: zipline.data.bundles.core: Ingest fundamentals successfully.
    ```

- 使用下列功能時會顯示當前耗用 api_key 的流量。
  - **zipline.master.py**：
     - `get_prices`
     - `getToolData`
  - **zipline.sources.TEJ_Api_Data.py**：
     - `get_Benchmark_Return`
     - `get_universe`
     - `get_Treasury_Return`
  - **ingest tquant**：
     - `!zipline ingest -b tquant`
     - `!zipline add -b tquant -t <ticker>`
     - `!zipline update -b tquant`
  - **ingest fundamentals**：
     - `!zipline ingest -b fundamentals`
     - `!zipline add -b fundamentals -t <ticker>`
     - `!zipline add -b fundamentals -f <field>`
     - `!zipline update -b fundamentals`
  - **TejToolAPI**：
     - `get_history_data`
  
    ```python
    # 範例
    Currently used TEJ API key call quota 587/9223372036854775807 (0.0%)
    Currently used TEJ API key data quota 63565100/9223372036854775807 (0.0%)
    ```

- 將`zipline.pipeline.data.TQFundamentals`的`class: TQDataSet`拆分成財務（`class: TQDataSet`）和非財務（`class: TQAltDataSet`）兩個物件進行管理。所以使用非財務的欄位時需改用`TQAltDataSet.<columns>`，使用財務欄位時則照舊。
  - 參考：[example/TQ_月營收成長率策略_simple_algo.ipynb](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E6%9C%88%E7%87%9F%E6%94%B6%E6%88%90%E9%95%B7%E7%8E%87%E7%AD%96%E7%95%A5_simple_algo.ipynb)。
  - 查詢`class: TQDataSet`與`class: TQAltDataSet`支援的欄位名稱：
  
    ```python
    # TQAltDataSet
    from zipline.pipeline.data import TQAltDataSet
    TQAltDataSet._column_names
    ```

    ```python
    # TQDataSet
    from zipline.pipeline.data import TQDataSet
    TQDataSet._column_names
    ```

- 新增 **current_bar** 回測功能（即當天開盤前下單，收盤前成交）：將下單函數的位置由 **handle_data** 或自訂函式（掛在 **schedule_function** 之下的函式，例如：rebalance）改至 **before_trading_start**。範例如下：
  - 舊有下單方式（當天收盤後下單，隔一日收盤前成交，也就是原先的回測方式）

    ```python
    ...
    def handle_data(context, data):
        order(symbol('1101'), 1000000)   
    def before_trading_start(context, data):
        pass
    ...
    ```  

  - current_bar 回測方式   
      
    ```python
    ...
    def handle_data(context, data):
        pass  
    def before_trading_start(context, data):
        order(symbol('1101'), 1000000)
    ...
    ```    

- TargetPercentPipeAlgo（`zipline.algo.pipeline_algo.TargetPercentPipeAlgo`）
  - 新增 **current_bar** 回測功能，利用 **order_filling_policy** 參數進行設定：
     - 當天開盤前下單，收盤前成交：指定 `order_filling_policy='current_bar'`。
     - 當天收盤後下單，隔一日收盤前成交，也就是原先的回測方式：指定 `order_filling_policy='next_bar'`。
     - 參考：[lecture/Simple Algorithm-TargetPercentPipeAlgo](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Simple%20Algorithm-TargetPercentPipeAlgo.ipynb)
  - **pipeline參數**可以支援 **Pipeline物件**（`zipline.pipeline.Pipeline`）。
  
- tquant bundle：變更暫存檔案（從 csv 改為 parquet，以提升效能），故舊有的 bundle 資料可能無法兼容，**請重新 ingest**。 

<br>

### 問題修復
- 避免 `func: get_bundle`（`zipline.data.data_portal`）產出資料的起迄日與 start_dt 及 end_dt 不一致。
- 配合股票日交易註記資訊（TWN/APISTKATTR）修改產業別，同步修改 `func: get_universe` 的程式，確保能正確取得**一般產業**樣本。

<br>

### 即將不支援的功能
- 下個版本開始將不支援`zipline.pipeline.data.tejquant`的`class: TQDataSet`。
  - 請改用`zipline.pipeline.data.TQFundamentals`的`class: TQDataSet`和`class: TQAltDataSet`。


<br>

## 2. tej-tool-api　版本更新
- 版本：1.1.1
- 日期：2024/03/13

<br>

### 更新方式
```
!pip install --upgrade tej-tool-api
```

<br>

### 問題修復
- 修正抓不到暫停交易期間公布的最新財報／月營收／集保資料的問題。
- 原先非交易日（t）公告的資料會合併至**前一個交易日（t-1）**，現在修改成合併至**後一個交易日（t+1）**。

<br>

### 不支援的功能
- 將證券屬性資料表（TWN/APISTOCK）相關欄位從 tej-tool-api 移除。請直接使用 `tejapi.fastget('TWN/APISTOCK', paginate=True)` 取得資料（將耗費 api_key 的流量）。

<br>

## 3. alphalens-tej　版本更新
- 版本：2.0.2
- 日期：2024/03/13

<br>

### 更新方式
```
!pip install --upgrade alphalens-tej
```

<br>

### 功能新增
- 支援 pandas 2.0.0。
- 支援 python 3.11。

<br>

## 4. pyfolio-tej　版本更新
- 版本：2.0.2
- 日期：2024/03/13

<br>

### 更新方式
```
!pip install --upgrade pyfolio-tej
```

<br>


### 功能新增和重構
- 支援 pandas 2.0.0。
- 支援 python 3.11。
- 新增 pyfolio 的 dependencies：`dask[distributed]`。
- round_trips：
  - 有鑑於大規模回測涉及到過多標的與資金的分配，計算交易紀錄時間會嚴重拉長，因此增設 dask 功能，當設定 `dask_mode` 為 True （預設）時，系統會使用電腦全核心執行計算以節約時間。如不想要用全核心，則可設定 `n_workers_discount` 為 0.1 ~ 1 之間的小數。此外， `npartitions` 預設為拆分 100 個分區（可自由設定）。
  - 優化 round_trips 的使用方式，僅需將 `extract_rets_pos_txn_from_zipline(results)` 萃取後的 returns, positions, transactions 放入 `func: extract_round_trips`（`pyfolio.round_trips.extract_round_trips`） 中即可，因此 round_trips 新版的使用方式為：       

    ```python
    # 開啟平行化運算功能
    extract_round_trips(returns, transactions, positions, dask_mode=True, n_workers_discount=1, npartitions=100)
    # 關閉平行化運算功能
    extract_round_trips(returns, transactions, positions, dask_mode=False, n_workers_discount=1, npartitions=100)
    ```

  - 參考：[example/TQ_動量策略.ipynb](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E5%8B%95%E9%87%8F%E7%AD%96%E7%95%A5.ipynb)、[example/TQ_月營收成長率策略_simple_algo.ipynb](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E6%9C%88%E7%87%9F%E6%94%B6%E6%88%90%E9%95%B7%E7%8E%87%E7%AD%96%E7%95%A5_simple_algo.ipynb)。


### 問題修復
- 修正 round_trips 問題：修正在計算股票股利或股票減資時會出錯的 bug。

<br>

## 5. tej-exchange-calendars　版本更新
- 版本：1.0.0
- 日期：2024/03/13

<br>

### 更新方式
```
!pip install --upgrade tej-exchange-calendars
```

<br>

### 功能新增和重構
- 支援 pandas 2.0.0。
- 支援 python 3.11。

<br>

## 6.資料庫修改
今年以來的重大修改
- 修改股票日交易註記資訊（TWN/APISTKATTR）"綠能環保產業"與"數位雲端產業"的產業別及產業名稱（main_ind_c、main_ind_e、sub_ind_c、sub_ind_e）：

| TWN/APISTKATTR |            |      |  |  |      |  |  |  |
|----------------|------------|------|---------------------------|---|----------------|--------------------------------------------------------|---------|---------|
| OLD            |            |      |  |  | NEW  |  |  |  |
| main_ind_c     | main_ind_e | sub_ind_c | sub_ind_e                |   | main_ind_c    | main_ind_e                                             | sub_ind_c| sub_ind_e|
| M2300 電子工業  | M2300 Electronics | M2335 綠能環保 | M2335 TSE Green Energy and Environmental Services |   | M3500 綠能環保 | M3500 TSE Green Energy and Environmental Services | 空白    | 空白    |
| M2300 電子工業  | M2300 Electronics | M2336 數位雲端 | M2336 TSE Digital and Cloud Services              |   | M3600 數位雲端 | M3600 TSE Digital and Cloud Services              | 空白    | 空白    |
| OTC23 OTC 電子類| OTC23 OTC Electronic | O2335 OTC 綠能環保 | O2335 OTC Green Energy and Environmental Services |   | OTC35 OTC 綠能環保 | OTC35 OTC Green Energy and Environmental Services | 空白    | 空白    |
| OTC23 OTC 電子類| OTC23 OTC Electronic | O2336 OTC 數位雲端 | O2336 OTC Digital and Cloud Services              |   | OTC36 OTC 數位雲端 | OTC36 OTC Digital and Cloud Services              | 空白    | 空白    |

- 修改證券屬性資料表（TWN/APISTOCK）：修改"綠能環保產業"（M3500、OTC35）與"數位雲端產業"（M3600、OTC36）的 **tejind** 欄位，由 M2300 或 O2300 拆出

| TWN/APISTOCK |  |
|--------------|------------|
| 新增  | 備註       |
| M3500        | 由M2300拆出 |
| M3600        | 由M2300拆出 |
| OTC35        | 由O2300拆出 |
| OTC36        | 由O2300拆出 |


<br>

## 7.文件更新
文件的重要更新
- [lecture/Simple Algorithm-TargetPercentPipeAlgo](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Simple%20Algorithm-TargetPercentPipeAlgo.ipynb)：
  - 將部分的 TQDataSet 改為 TQAltDataSet。
  - 新增 order_filling_policy 範例。
- [lecture/Install TQuant Lab.ipynb](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Install%20TQuant%20Lab.ipynb)
  - 更新安裝方式說明。
- [lecture/Data collection.ipynb](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Data%20collection.ipynb)：
  - 新增 **zipline update** 與 **zipline add** 功能的說明。
- [lecture/Alphalens .ipynb](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Alphalens%20.ipynb)
  - 配合 pandas 2.0.0 更新部分程式碼。
- [lecture/Filters.ipynb](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Filters.ipynb) 
  - 配合 pandas 2.0.0 更新部分程式碼。
- [example/TQ_月營收成長率策略_simple_algo](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E6%9C%88%E7%87%9F%E6%94%B6%E6%88%90%E9%95%B7%E7%8E%87%E7%AD%96%E7%95%A5_simple_algo.ipynb)：
  - 將部分的 TQDataSet 改為 TQAltDataSet。
  - 修正 extract_round_trips 的參數。
- [example/TQ_月營收成長率策略](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E6%9C%88%E7%87%9F%E6%94%B6%E6%88%90%E9%95%B7%E7%8E%87%E7%AD%96%E7%95%A5.ipynb)：
  - 縮短回測的起迄日。
  - ticker 改用 get_universe 取。
- [example/TQ_尋找Alpha.ipynb](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E5%B0%8B%E6%89%BEAlpha.ipynb)：
  - ticker 改用 get_universe 取。
  - alphalens 的 prices 平移一期，避免前視偏誤。
