# 產業輪動
- [產業輪動](#產業輪動)
  - [前言](#前言)
  - [總經背景](#總經背景)
  - [產業資料分析方法](#產業資料分析方法)
    - [RSI 指標應用](#rsi-指標應用)
    - [分析三大步驟](#分析三大步驟)
    - [研究期間](#研究期間)
  - [程式碼實證展示](#程式碼實證展示)
    - [資料下載](#資料下載)
  - [RSI 的公式計算](#rsi-的公式計算)
  - [視覺化主要產業的 RSI 數值](#視覺化主要產業的-rsi-數值)
  - [產業資料圖表與分析](#產業資料圖表與分析)
    - [滾動相關係數分析 (Rolling Correlation)](#滾動相關係數分析-rolling-correlation)
  - [分析解讀](#分析解讀)
    - [滯後相關性分析 (Lagged Correlation)](#滯後相關性分析-lagged-correlation)
  - [分析解讀](#分析解讀-1)
    - [Transfer Entropy 轉移熵分析](#transfer-entropy-轉移熵分析)
    - [程式碼範例](#程式碼範例)
  - [分析結果](#分析結果)
    - [航運產業對半導體產業](#航運產業對半導體產業)
    - [金融保險產業對半導體產業](#金融保險產業對半導體產業)
    - [生醫產業對半導體產業](#生醫產業對半導體產業)
  - [分析解讀](#分析解讀-2)
  - [分析結論](#分析結論)

---

## 前言
在投資實務中，「產業輪動」一直是資金配置與選股的重要依據。隨著景氣週期的推移，市場資金往往會由領先產業逐步轉向後進產業，形成結構性的板塊輪動。

例如在景氣復甦初期，原物料與景氣循環類股（如航運、鋼鐵）常率先反應；隨著經濟持續擴張與企業資本支出增加，成長性產業如半導體、科技股則可能接棒上漲。

然而，要精確辨識產業輪動的「起點與終點」，仍需倚賴量化工具與實證資料輔助。本文將聚焦於多產業指數的歷史資料，透過 **Transfer Entropy（轉移熵）**、**滾動相關係數** 等統計工具，分析不同行業之間是否存在穩定的領先－落後關係，並初步探討景氣信號燈在這些關係中的可能角色。

---

## 總經背景
台灣經濟結構高度依賴科技製造與出口導向產業，尤以半導體產業為主體。根據經濟部資料，台灣半導體產業在全球市占率高居前列，涵蓋上游 IC 設計、中游晶圓製造、下游封裝測試等完整供應鏈，並為台灣 GDP 與出口貢獻主要動能。

因此，**半導體產業的景氣循環與資金變化，常被視為台股與整體經濟的重要風向球**。

然而，在不同經濟階段，市場資金並非總是集中於單一產業，而是會在各板塊間切換與輪動。影響因素包括：

- 全球貿易活動變化  
- 通膨壓力  
- 利率政策  
- 資本支出週期  

若能掌握半導體與其他產業（如金融保險、航運、生技醫療）的相對變化關係，將有助於投資人在配置上做出更具前瞻性的決策。

本文以 **半導體** 作為核心觀察指標，進一步檢驗其與其他產業是否存在 **領先—落後或輪動關係**，並嘗試建構一套可操作的輪動預測架構。

## 產業資料分析方法

為了進行產業輪動的實證分析，本文採用 **TQuant Lab 所提供的歷史產業指數** 作為研究對象。  
該平台涵蓋台股市場中的主要產業分類，包括：

- 半導體  
- 電子  
- 金融保險  
- 航運  
- 生技醫療  

並提供可回溯的長期日資料，適合作為輪動行為的分析基礎。

---

### RSI 指標應用
由於產業指數屬於價格型指標，長期趨勢通常呈現緩步上升，並非穩定於某個價格區間震盪。  
如果直接觀察價格資料，不易辨識出相對強弱變化。  

為解決此問題，本文選擇計算 **相對強弱指數（Relative Strength Index, RSI）**。  
RSI 能反映某段期間內價格上漲與下跌的強度比例，進而識別產業在不同時期的 **相對強勢與弱勢**。

---

### 分析三大步驟
完成 RSI 轉換後，本文進一步進行以下分析：

1. **滾動相關係數（Rolling Correlation）**  
   - 觀察產業 RSI 與半導體 RSI 在不同時期的相關性變化。  
   - 幫助判斷輪動結構是否具週期性或階段性。

2. **滯後相關性分析（Lagged Correlation）**  
   - 計算產業 RSI 與半導體 RSI 在不同滯後期數下的相關性。  
   - 用來推測產業輪動的先後順序。

3. **Transfer Entropy（轉移熵）分析**  
   - 衡量各產業 RSI 對半導體 RSI 是否具有預測力。  
   - 判斷是否存在 **資訊流方向**，例如「航運 → 半導體」。

---

### 研究期間
- **2012 年初至 2019 年底**：作為分析樣本  
- **2020 年初至今**：作為策略回測樣本  

這樣的設計可避免過擬合，並驗證分析方法的穩健性。

## 程式碼實證展示

本文使用 **TQuant Lab 提供的 TEJToolAPI** 下載各產業的指數資料，並進行 RSI 計算與視覺化。

---

### 資料下載

```python
codes = [
   "IX0001", "IX0002", "IX0003", "IX0006", "IX0010", "IX0011", "IX0012",
   "IX0016", "IX0017", "IX0018", "IX0019", "IX0020", "IX0021", "IX0022",
   "IX0023", "IX0024", "IX0025", "IX0026", "IX0027", "IX0028", "IX0029",
   "IX0030", "IX0031", "IX0032", "IX0033", "IX0034", "IX0035", "IX0036",
   "IX0037", "IX0038", "IX0039", "IX0040"
]

names = [
   "加權指數", "台灣50指數", "台灣中型指數", "台灣高股息指數", "水泥工業類指數",
   "食品工業類指數", "塑膠工業類指數", "紡織纖維類指數", "電機機械類指數",
   "電器電纜類指數", "化學生技醫療類指數", "化學工業指數", "生技醫療指數",
   "玻璃陶瓷類指數", "造紙工業類指數", "鋼鐵工業類指數", "橡膠類指數",
   "汽車工業類指數", "電子類指數", "半導體業指數", "電腦及週邊設備業指數",
   "光電業指數", "通信網路業指數", "電子零組件業指數", "電子通路業指數",
   "資訊服務業指數", "其他電子業指數", "建材營造類指數", "航運業類指數",
   "觀光事業類指數", "金融保險類指數", "貿易百貨類指數"
]

import pandas as pd
import numpy as np
import tejapi
import os
import matplotlib.pyplot as plt
plt.rcParams['font.family'] = 'Arial'

tej_key ='Your key'
tejapi.ApiConfig.api_key = tej_key
os.environ['TEJAPI_BASE'] = "https://api.tej.com.tw"
os.environ['TEJAPI_KEY'] = tej_key

start_dt = pd.Timestamp('2006-01-01', tz = 'UTC')
end_dt = pd.Timestamp('2025-04-23', tz = "UTC")

import TejToolAPI

co = ['coid','Industry', 'mkt', 'vol', 'open_d', 'high_d', 'low_d',
      'close_d', 'roi', 'shares', 'per', 'pbr_tej','mktcap']

data = TejToolAPI.get_history_data(start = start_dt,
                                  end = end_dt,
                                  ticker = codes,
                                  columns = co,
                                  transfer_to_chinese = True)
```

## RSI 的公式計算

RSI 常見的回傳參數是 14 天，但由於本文分析的對象是「產業指數」，非單一個股，因此改用 60 天。
這樣設計可以讓數值更平滑，更容易看出 週期輪動的現象。

```python
data_use = data.pivot(index='日期', columns='股票代碼', values='收盤價')

def compute_rsi(series, period = 60):
   delta = series.diff()

   gain = delta.where(delta > 0, 0.0)
   loss = -delta.where(delta < 0, 0.0)

   avg_gain = gain.rolling(window=period).mean()
   avg_loss = loss.rolling(window=period).mean()

   rs = avg_gain / avg_loss
   rsi = 100 - (100 / (1 + rs))

   return rsi

# 每個產業計算 RSI
rsi_df = data_use.iloc[:, 1:].apply(compute_rsi)
```

## 視覺化主要產業的 RSI 數值

挑選 半導體、電子、金融保險、航運、生技醫療 五大產業進行比較。
```python
from matplotlib import rcParams
plt.rcParams['font.family'] = 'DejaVu Sans'  # 可視需要改成中文字體

selected_codes = [
   "IX0028",  # 半導體業指數
   "IX0027",  # 電子類指數
   "IX0039",  # 金融保險類指數
   "IX0037",  # 航運業類指數
   "IX0021",  # 生技醫療指數
]

selected_names = [
   "Semiconductor Index",
   "Electronics Sector Index",
   "Financial & Insurance Index",
   "Shipping Sector Index",
   "Biotechnology & Medical Care Index",
]

rsi_s = rsi_df.loc['2012-01-01':'2020-01-01'].copy()
plt.style.use('ggplot')
plt.figure(figsize = (20, 8))
for idx, i in enumerate(selected_codes):
   plt.plot(rsi_s.index, rsi_s[i], label = selected_names[idx])
plt.title('RSI Industry')
plt.legend()
plt.show()
```

## 產業資料圖表與分析

### 滾動相關係數分析 (Rolling Correlation)

使用 **60 日滾動視窗**，觀察各產業 RSI 與半導體 RSI 的相關性變化。

```python
# ─── 滾動相關 (Rolling Correlation) ──────＃
window = 60  # 滑動視窗大小，可自行調整
base_code  = "IX0028"  # 半導體業指數
base_name  = "Semiconductor Index"

plt.figure(figsize=(20, 8))
for code, name in zip(selected_codes[1:], selected_names[1:]):
   rc = rsi_s[base_code].rolling(window).corr(rsi_s[code])
   plt.plot(rc.index, rc.values, label=f"{base_name} vs {name}")

plt.xlabel("Date")
plt.ylabel(f"{window}-Day Rolling Correlation")
plt.title(f"Rolling {window}-Day Correlation Between {base_name} and Other Sector Indices")
plt.legend()
plt.show()
```
## 分析解讀

本圖透過 60 日滾動相關係數，呈現各產業與半導體產業之間的連動性：

電子產業 vs 半導體
長期維持高度同步關係（紅色線），屬於結構性連動。

航運產業 vs 半導體
相關性呈現週期性波動，顯示可能存在 具時間延遲的輪動關係。

金融產業、生技醫療產業
展現出較多 反向或不穩定的連動，支持其為 非同步或防禦性資產 的判斷。

### 滯後相關性分析 (Lagged Correlation)

利用 **Cross-Correlation (叉相關)**，分析不同產業 RSI 與半導體 RSI 在 ±60 天內的相關性，  
以判斷潛在的 **領先—落後關係**。

---

```python
# ─── 叉相關 (Cross-correlation) ────────────────────────────────
def cross_corr(series1: pd.Series, series2: pd.Series, max_lag: int = 60) -> pd.Series:
   """
   回傳 lag 從 -max_lag 到 +max_lag 時，series1 與 series2 的 Pearson 相關係數。
   index=lag, value=corr
   """
   lags = np.arange(-max_lag, max_lag + 1)
   corrs = [series1.corr(series2.shift(lag)) for lag in lags]
   return pd.Series(corrs, index=lags)

base_code  = selected_codes[0]  # 半導體
base_name  = selected_names[0]
max_lag    = 60

plt.style.use('ggplot')
plt.figure(figsize=(12, 6))
for code, name in zip(selected_codes[1:], selected_names[1:]):
   cc = cross_corr(rsi_s[base_code], rsi_s[code], max_lag=max_lag)
   plt.plot(cc.index, cc.values, label=f"{base_name} vs {name}")

plt.axvline(0, color='black', lw=0.8)
plt.xlabel("Lag (Days)")
plt.ylabel("Pearson Correlation Coefficient")
plt.title(f"Cross-Correlation Between {base_name} and Other Sector Indices (±{max_lag} Days)")
plt.legend()
plt.show()
```
## 分析解讀

- 航運產業 vs 半導體
- 在 滯後約 +30 天 時，相關性達到高點（紫色線）。
- → 表示當航運產業相對強勢時，約 30 天後 半導體產業 才會明顯上升。
- → 支持「航運 → 半導體」的輪動假說。

金融保險產業 vs 半導體
在 滯後約 -50 天 時，相關性最高（藍色線）。
→ 代表 半導體領先金融，金融產業約落後 50 天才反應。
→ 支持「半導體 → 金融」的輪動假說。

電子與生技醫療產業 vs 半導體
相關性曲線較對稱或平緩，沒有明顯的峰值。
→ 表示其關係偏向 同步 或 無顯著輪動性質。

### Transfer Entropy 轉移熵分析

**轉移熵（Transfer Entropy, TE）** 用來衡量一個時間序列對另一個時間序列的 **資訊傳遞強度**，  
可以捕捉 **非線性** 與 **方向性** 關聯。

若「產業 A → 產業 B」的 TE 值大於反方向，就能推論 **A 的變化對 B 有較高的預測性**。

---

### 程式碼範例

```python
import numpy as np
import pandas as pd
from pyinform.transferentropy import transfer_entropy

for q in [3, 4, 5]:       # 分位數 (離散化程度)
   for k in [3, 5, 7]:    # 滯後期數
       x = pd.qcut(rsi_s['IX0037'], q=q, labels=False).astype(int).tolist()  # 航運 RSI
       y = pd.qcut(rsi_s['IX0028'], q=q, labels=False).astype(int).tolist()  # 半導體 RSI
       try:
           te_xy = transfer_entropy(x, y, k=k)
           te_yx = transfer_entropy(y, x, k=k)
           print(f"q={q}, k={k} → TE 航 → 半: {te_xy:.4f} | 半 → 航: {te_yx:.4f}")
       except:
           print(f"q={q}, k={k} → 無法計算")
```
## 分析結果

### 航運產業對半導體產業
| 滯後期數 (交易日) | TE 值 航 → 半 | TE 值 半 → 航 | 資訊流方向 |
|------------------|--------------|---------------|------------|
| 3                | 0.0177       | 0.0155        | 航 → 半    |
| 5                | 0.0539       | 0.0376        | 航 → 半    |
| 7                | 0.0866       | 0.0589        | 航 → 半    |

---

### 金融保險產業對半導體產業
| 滯後期數 (交易日) | TE 值 金 → 半 | TE 值 半 → 金 | 資訊流方向 |
|------------------|--------------|---------------|------------|
| 3                | 0.0188       | 0.0164        | 金 → 半    |
| 5                | 0.0469       | 0.0538        | 半 → 金    |
| 7                | 0.0780       | 0.0811        | 半 → 金    |

---

### 生醫產業對半導體產業
| 滯後期數 (交易日) | TE 值 生醫 → 半 | TE 值 半 → 生醫 | 資訊流方向 |
|------------------|-----------------|-----------------|------------|
| 3                | 0.0139          | 0.0169          | 半 → 生醫  |
| 5                | 0.0487          | 0.0333          | 生醫 → 半  |
| 7                | 0.0779          | 0.0494          | 生醫 → 半  |

---

## 分析解讀

- **航運 → 半導體**  
  - TE 值隨滯後期數增加而 **穩定上升**  
  - 資訊流方向一致（航 → 半）  
  - 顯示航運對半導體具有 **穩定的領先性**  

- **金融保險 ↔ 半導體**  
  - 短期 (3 日) 顯示「金 → 半」，但在 5 日、7 日卻反轉為「半 → 金」  
  - 資訊流方向不穩定，代表關係 **敏感且不可靠**  

- **生醫 ↔ 半導體**  
  - 短期為「半 → 生醫」，中長期則變為「生醫 → 半」  
  - 顯示其資訊傳遞方向 **不一致**，難以作為可靠的輪動依據  


## 分析結論

綜合 **滾動相關係數分析**、**滯後相關性分析** 與 **轉移熵 (Transfer Entropy) 分析** 的結果：

- **航運產業 → 半導體產業**  
  - 三種方法均顯示航運對半導體具有領先性。  
  - 資訊傳遞方向穩定且一致，具備較高的解釋力。  
  - 可視為半導體產業的 **潛在領先指標**，具有策略應用價值。  

- **金融保險產業 ↔ 半導體產業**  
  - 在不同分析方法與滯後期數下，資訊流方向出現反轉。  
  - 結果敏感、不具一致性，缺乏可靠性。  
  - 不適合作為穩定的輪動依據，只能作為輔助參考。  

- **生技醫療產業 ↔ 半導體產業**  
  - 在短期與中長期分析下，方向不一致。  
  - 缺乏統一性與穩定性，不宜作為主要輪動指標。  

---

👉 **總結**：  
在本研究中，**航運產業對半導體產業的領先關係** 是最顯著且穩定的結果，  
投資人可考慮將其納入 **產業輪動分析與資產配置策略**；  
至於金融與生醫產業，因結果不穩定，應更審慎解讀，避免誤導投資決策。
