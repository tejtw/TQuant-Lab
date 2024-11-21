# TQuant-Lab
使用文件、程式範例，閱讀完所有教材與範例後，您將會具備使用 TQuant Lab 執行多數交易策略的能力。為了更佳的閱讀體驗，建議您以下載方式閱讀教材或策略。

## 操作教材 (Lecture)

#### 安裝
* [Install TQuant Lab](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Install%20TQuant%20Lab.ipynb): 安裝 TQuant lab、檢查版本與升級。

#### 資料取得
* [Data collection](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Data%20collection.ipynb): 股票價量（!zipline ingest -b tquant）與非價量資料（!zipline ingest -b fundamentals）的下載方法。
* [TejToolAPI](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/TejToolAPI.ipynb): TejToolAPI 介紹。
* [TejToolAPI(Extended)](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Data%20Preprocess%20-%20tejtoolapi.ipynb): TejToolAPI 延伸教學。

#### Zipline 回測相關功能
* [get_universe說明](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/get_universe%E8%AA%AA%E6%98%8E.ipynb): 取得特定的股票池。
* [Universe Analysis－using get_universe](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Universe%20Analysis%EF%BC%8Dusing%20get_universe.ipynb): 分析股票池的產業分布與成交金額。
* [TSMC buy and hold strategy](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/TSMC%20buy%20and%20hold%20strategy.ipynb): 以買進持有策略示範 zipline 回測架構與四大基礎函式 initialize, handle_data, analyze 與 run_algorithm。
* [Simple Algorithm-TargetPercentPipeAlgo](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Simple%20Algorithm-TargetPercentPipeAlgo.ipynb): 利用pipeline提供的買賣清單與持股權重進行定期再平衡的演算法。
* [Zipline context](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Zipline%20Context.ipynb): context 功能介紹。
* [Zipline order (order & order_target)](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Zipline%20Order%20(order%20%26%20order_target).ipynb): 下單方法介紹(一)
* [Zipline order (value & target_value)](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Zipline%20Order%20(value%20%26%20target_value).ipynb): 下單方法介紹(二)
* [Zipline order (percent & target_percent)](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Zipline%20Order%20(percent%20%26%20target_percent).ipynb): 下單方法介紹(三)
* [Zipline slippage](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Zipline%20Slippage.ipynb): 滑價設置方法介紹。
* [Zipline trading control](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Zipline%20Trading%20Controls.ipynb): 下單限制設定。
* [Zipline commission models](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Zipline%20Commission%20Models.ipynb): 手續費設定。
* [Zipline cancel order](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Zipline%20Cancel%20Order.ipynb): 交易取消設定。

#### 資料處理和計算工具：Pipeline
* [Creating a pipeline](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Creating%20a%20Pipeline.ipynb): 建立 pipeline 教學。
* [Factor](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Factors.ipynb): 介紹因子使用方法。
* [Filter](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Filters.ipynb): 介紹濾網使用方法。
* [Masking](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Masking.ipynb): 介紹遮網使用方法。 
* [Custom Factor](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Custom%20Factors.ipynb): 客製化因子。
* [Pipeline built-in factor](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Pipeline%20built-in%20factors.ipynb): 內建的因子。
* [Pipeline built-in classifier](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Pipeline%20built-in%20classifier.ipynb): 內建的分類器。
* [Pipeline built-in filter](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Pipeline%20built-in%20filters.ipynb): 內建的濾網。
* [Pipeline example](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Pipeline%20example%20(請下載閱讀).ipynb): 介紹 Pipeline 於交易策略使用方法與 before_trading_start 及 schedule_function 函式。

#### 分析工具：Pyfolio 與 Alphalens
* [Pyfolio](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Pyfolio.ipynb): 交易策略績效與風險視覺化。
* [Alphalens](https://github.com/tejtw/TQuant-Lab/blob/main/lecture/Alphalens%20.ipynb): 因子研究。

## 策略範例 (Example)
* [TQ_ETF資產配置模型](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_ETF%E8%B3%87%E7%94%A2%E9%85%8D%E7%BD%AE%E6%A8%A1%E5%9E%8B.ipynb)
* [TQ_KD指標回測實戰](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_KD%E6%8C%87%E6%A8%99%E5%9B%9E%E6%B8%AC%E5%AF%A6%E6%88%B0.ipynb)
* [TQ_MACD交易策略](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_MACD%E4%BA%A4%E6%98%93%E7%AD%96%E7%95%A5.ipynb)
* [TQ_乖離率策略](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E4%B9%96%E9%9B%A2%E7%8E%87%E7%AD%96%E7%95%A5.ipynb)
* [TQ_動量策略](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E5%8B%95%E9%87%8F%E7%AD%96%E7%95%A5.ipynb)
* [TQ_尋找Alpha](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E5%B0%8B%E6%89%BEAlpha.ipynb)
* [TQ_布林通道交易策略](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E5%B8%83%E6%9E%97%E9%80%9A%E9%81%93%E4%BA%A4%E6%98%93%E7%AD%96%E7%95%A5.ipynb)
* [TQ_延伸量能回測策略](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E5%BB%B6%E4%BC%B8%E9%87%8F%E8%83%BD%E5%9B%9E%E6%B8%AC%E7%AD%96%E7%95%A5.ipynb)
* [TQ_趨勢跟蹤策略](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E8%B6%A8%E5%8B%A2%E8%B7%9F%E8%B9%A4%E7%AD%96%E7%95%A5.ipynb)
* [TQ_跟隨大戶策略](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E8%B7%9F%E9%9A%A8%E5%A4%A7%E6%88%B6%E7%AD%96%E7%95%A5.ipynb)
* [TQ_逆勢交易策略](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E9%80%86%E5%8B%A2%E4%BA%A4%E6%98%93%E7%AD%96%E7%95%A5.ipynb)
* [TQ_量能回測實戰](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E9%87%8F%E8%83%BD%E5%9B%9E%E6%B8%AC%E5%AF%A6%E6%88%B0.ipynb)
* [TQ_長期趨勢策略](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E9%95%B7%E6%9C%9F%E8%B6%A8%E5%8B%A2%E7%AD%96%E7%95%A5.ipynb)
* [TQ_月營收成長率策略](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E6%9C%88%E7%87%9F%E6%94%B6%E6%88%90%E9%95%B7%E7%8E%87%E7%AD%96%E7%95%A5.ipynb)
* [TQ_月營收成長率策略_simple_algo](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E6%9C%88%E7%87%9F%E6%94%B6%E6%88%90%E9%95%B7%E7%8E%87%E7%AD%96%E7%95%A5_simple_algo.ipynb)
* [TQ_阿隆指標交易策略](https://github.com/tejtw/TQuant-Lab/blob/main/example/TQ_%E9%98%BF%E9%9A%86%E6%8C%87%E6%A8%99%E4%BA%A4%E6%98%93%E7%AD%96%E7%95%A5.ipynb)

## 問題集 (problem)
* [NotSessionError](https://github.com/tejtw/TQuant-Lab/issues/12)
* [QA_不開槓桿設定](https://github.com/tejtw/TQuant-Lab/blob/main/Problem/QA_%E4%B8%8D%E9%96%8B%E6%A7%93%E6%A1%BF%E8%A8%AD%E5%AE%9A.ipynb)
* [QA_處理自建因子](https://github.com/tejtw/TQuant-Lab/blob/main/Problem/QA_%E8%99%95%E7%90%86%E8%87%AA%E5%BB%BA%E5%9B%A0%E5%AD%90.ipynb)
* [QA_因子出現 Bin edges must be unique array nan 問題](https://github.com/tejtw/TQuant-Lab/blob/main/Problem/QA_%E5%9B%A0%E5%AD%90%E5%87%BA%E7%8F%BE%20Bin%20edges%20must%20be%20unique%20array%20nan%20%E5%95%8F%E9%A1%8C.ipynb)
* [TEjToolAPI 欄位資訊](https://github.com/tejtw/TEJ_TOOL_API/blob/main/TejToolAPI/tables/columns_group.xlsx)
