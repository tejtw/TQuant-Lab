# zipline-2.2.1、tej-tool-api-1.2.10、pyfolio-2.0.4、alphalens-2.0.3、tej-exchange-calendars-1.0.1-版本更新

## 此次版本更新的範圍
1. zipline-tej -> 2.2.1
2. tej-tool-api -> 1.2.10
3. alphalens-tej -> 2.0.3
4. pyfolio-tej -> 2.0.4
5. tej-exchange-calendars -> 1.0.1

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
- **支援 pandas >= 2**。
- **支援 numpy >= 2**。
- **支援 python 3.12**：
  - Deprecated : zipline-tej 自2.2.1 版本開始 將棄用支援對 Python3.8 的支援

<br>

以下會分別說明更新項目：

## 1. zipline-tej　版本更新
- 版本：2.2.1
- 日期：2025/09/17

<br>

### 更新方式
```
!pip install --upgrade zipline-tej
```

<br>

### 功能新增和重構
- 支援 pandas >=2.0.0。
- 支援 numpy >=2。
- 支援 python 3.12。
- 新增 zipline 的dependencies：`scipy` >= 1.14.0。
- 新增 zipline 的dependencies：`h5py` >=3.11.0
- 新增 zipline 的dependencies：`packaging`
<br>

## 2. tej-tool-api　版本更新
- 版本：1.2.10
- 日期：2025/09/17

<br>

### 更新方式
```
!pip install --upgrade tej-tool-api
```

<br>

### 優化底層程式碼，減少data type mismatch的問題

## 3. alphalens-tej　版本更新
- 版本：2.0.3
- 日期：2025/09/17

<br>

### 更新方式
```
!pip install --upgrade alphalens-tej
```

<br>

### 功能新增
- 支援 pandas>=2.0.0。
- 支援 numpy>=2。
- 支援 python 3.12。
- 新增 alphalens 的dependencies：`packaging`
<br>

## 4. pyfolio-tej　版本更新
- 版本：2.0.4
- 日期：2025/09/17

<br>

### 更新方式
```
!pip install --upgrade pyfolio-tej
```

<br>


### 功能新增和重構
- 支援 pandas >=2.0.0。
- 支援 numpy >=2。
- 支援 python 3.12。
- 新增 pyfolio 的dependencies：`packaging`

## 5. tej-exchange-calendars　版本更新
- 版本：1.0.1
- 日期：2025/09/17

<br>

### 更新方式
```
!pip install --upgrade tej-exchange-calendars
```

<br>

### 功能新增和重構
- 支援 pandas >=2.0.0。
- 支援 numpy >=2。
- 支援 python 3.12。


