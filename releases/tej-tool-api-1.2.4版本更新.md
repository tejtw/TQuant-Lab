# tej-tool-api-1.2.4 版本更新
日期：2025/08/28

## 此次版本更新的範圍
tej-tool-api 1.1.2 -> 1.2.4 

<br>

### 更新方式
```
!pip install --upgrade tej-tool-api
```

<br>

### 欄位更新
- 原先部分資料不符合PIT概念，因此刪除其欄位，並以新欄位替代。


## TejToolAPI/tables/columns_group.xlsx
# 預計刪除欄位

| 中文名稱                       | 英文名稱                                            |
|--------------------------------|-----------------------------------------------------|
| 股利支付次數                   | Dividend_Payment_Frequency                         |
| 股利支付率%                    | Dividend_Payout_Rate_Percentage                    |
| 累計_現金股利(元)_盈餘        | Cumulative_Cash_Dividend_Earnings                  |
| 累計_現金股利(元)_公積        | Cumulative_Cash_Dividend_Capital_Reserves          |
| 累計_現金股利(元)             | Cumulative_Cash_Dividend                           |
| 最近一次_除息日               | Last_Ex-Dividend_Date                              |
| 最近一次_股息發放日           | Last_Dividend_Payment_Date                         |
| 除權日(配股)                  | Rights_Issuance_Date                               |
| 盈餘配股(元)                  | Earnings_Rights_Issuance                           |
| 公積配股(元)                  | Capital_Reserves_Rights_Issuance                   |
| 無償配股合計(元)              | Bonus_Issuance_Total                               |
| 年度累計股息是否已為全年度股息(Y/N) | Year-to-Date_Dividend_Is_Full_Year_Dividend_Fg |
| Q1_除息公告日                 | Q1_Ex-Dividend_Announcement_Date                   |
| Q1_除息日                     | Q1_Ex-Dividend_Date                                |
| Q1_盈餘分派_起日              | Q1_Earnings_Distribution_Start_Date                |
| Q1_盈餘分派_迄日              | Q1_Earnings_Distribution_End_Date                  |
| Q1_現金股利(元)              | Q1_Cash_Dividend_TWD                               |
| Q1_股息發放日                | Q1_Dividend_Payment_Date                           |
| Q1_股息決議股東會            | Q1_Dividend_Decision_Shareholders_Meeting          |
| Q1_股息決議董事會            | Q1_Dividend_Decision_Board_of_Directors            |
| Q1_除息融券最後回補日        | Q1_Ex-Dividends_Final_Short-covering_Date          |
| Q2_除息公告日                 | Q2_Ex-Dividend_Announcement_Date                   |
| Q2_除息日                     | Q2_Ex-Dividend_Date                                |
| Q2_盈餘分派_起日              | Q2_Earnings_Distribution_Start_Date                |
| Q2_盈餘分派_迄日              | Q2_Earnings_Distribution_End_Date                  |
| Q2_現金股利(元)              | Q2_Cash_Dividend_TWD                               |
| Q2_股息發放日                | Q2_Dividend_Payment_Date                           |
| Q2_股息決議股東會            | Q2_Dividend_Decision_Shareholders_Meeting          |
| Q2_股息決議董事會            | Q2_Dividend_Decision_Board_of_Directors            |
| Q2_除息融券最後回補日        | Q2_Ex-Dividends_Final_Short-covering_Date          |
| Q3_除息公告日                 | Q3_Ex-Dividend_Announcement_Date                   |
| Q3_除息日                     | Q3_Ex-Dividend_Date                                |
| Q3_盈餘分派_起日              | Q3_Earnings_Distribution_Start_Date                |
| Q3_盈餘分派_迄日              | Q3_Earnings_Distribution_End_Date                  |
| Q3_現金股利(元)              | Q3_Cash_Dividend_TWD                               |
| Q3_股息發放日                | Q3_Dividend_Payment_Date                           |
| Q3_股息決議股東會            | Q3_Dividend_Decision_Shareholders_Meeting          |
| Q3_股息決議董事會            | Q3_Dividend_Decision_Board_of_Directors            |
| Q3_除息融券最後回補日        | Q3_Ex-Dividends_Final_Short-covering_Date          |
| Q4_除息公告日                 | Q4_Ex-Dividend_Announcement_Date                   |
| Q4_除息日                     | Q4_Ex-Dividend_Date                                |
| Q4_盈餘分派_起日              | Q4_Earnings_Distribution_Start_Date                |
| Q4_盈餘分派_迄日              | Q4_Earnings_Distribution_End_Date                  |
| Q4_現金股利(元)              | Q4_Cash_Dividend_TWD                               |
| Q4_股息發放日                | Q4_Dividend_Payment_Date                           |
| Q4_股息決議股東會            | Q4_Dividend_Decision_Shareholders_Meeting          |
| Q4_股息決議董事會            | Q4_Dividend_Decision_Board_of_Directors            |
| Q4_除息融券最後回補日        | Q4_Ex-Dividends_Final_Short-covering_Date          |

# 更改為新的欄位

| 中文名稱           | 英文名稱                     |
|--------------------|------------------------------|
| 盈餘分配_迄日      | Dividends_Distri_End         |
| 董事會日期         | Director_Meeting_Date        |
| 股東會日期         | Meeting_Date                 |
| 盈餘分派_年度      | Dividends_Distri_Year        |
| 股利支付次數       | Dividend_Pay_Times           |
| 股息分配型態       | Dividends_Type               |
| 盈餘分配_起日      | Dividends_Distri_Begin       |
| 除息日             | Ex_Date_Cash_Div             |
| 除權日             | Ex_Date_Stock                |
| 股利支付率         | Payout_Ratio                 |
| 現金股利(元)       | Cash_Dividend                |
| 盈餘配股(元)       | Stock_Div_Earnings           |
| 公積配股(元)       | Stock_Div_Capital            |
| 無償配股合計(元)   | Subtotal_Stock_Div           |
| 股息發放日         | Cash_Dividend_Pay_Date       |
| 股票股利發放日     | Stock_Dividend_Pay_Date      |
| 發放幣別           | Currency                     |
| 除權息最後回補日   | Buyback_Short                |

### 新增 dependency
- dependencies 新增 `pyarrow`
