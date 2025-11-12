# tej-tool-api-1.3.0 版本更新
日期：2025/12/1

## 此次版本更新的範圍
tej-tool-api 1.2.12 -> 1.3.0

<br>

### 更新方式
```
!pip install tej-tool-api --upgrade 
```

<br>

### 更新內容

1. 重構底層寫法，完全移除dtype mismatch 問題。
2. 更新財務資訊欄位，說明如下表。
3. 財務資訊採用PIT規則，若在收盤前公布則屬於前日；收盤後公布則屬於當日，因此可能會與前版的財務資訊的日期不同。


**Full Changelog**: https://github.com/tejtw/TEJ_TOOL_API/compare/1.2.11...1.3.0rc0


1.3.0版本刪除欄位
欄位代號 | 中文名稱 | 英文名稱
-- | -- | --
bp11 | 現金及約當現金 | Cash_and_Cash_Equivalent
bp21 | 應收帳款 | Accounts_Receivable
bp22 | 長期應收款 | Long_Term_Accounts_Receivable
bp31 | 存貨 | Inventories
bp41 | 應付帳款 | Accounts_Payable
bp51 | 固定資產 | Fixed_Assets
bp53 | 無形資產 | Intangible_Assets
bp61 | 預付款 | Prepayments
bp62 | 其他應收款 | Other_Receivables
bp63 | 預收款_流動 | Advances_Receipts_Current
bp64 | 其他應付款 | Other_Accounts_Payable
bp65 | 預收款_非流動 | Advances_Receipts_Non_Current
bf11 | 金融借款_流動 | Short_Term_Borrowings_Financial_Institutions
bf12 | 金融借款_非流動 | Long_Term_Borrowings_Financial_Institutions
bf21 | 非金融借款_流動 | Short_Term_Borrowings_Non_Financial_Institutions
bf22 | 非金融借款_非流動 | Long_Term_Borrowings_Non_Financial_Institutions
bf41 | 普通股股本 | Common_Stocks
bf42 | 資本公積 | Capital_Reserves
bf43 | 保留盈餘 | Total_Retained_Earnings
bf44 | 特別股股本 | Preferred_Stocks
bf45 | 非控制權益 | Non_Controlling_Interest
bf99 | 其他權益 | Total_Other_Equity_Interest
bsca | 流動資產合計 | Total_Current_Assets
bsnca | 非流動資產合計 | Total_Non_Current_Assets
bsta | 資產總計 | Total_Assets
bscl | 流動負債合計 | Total_Current_Liabilities
bsncl | 非流動負債合計 | Total_Non_current_Liabilities
bstl | 負債總額 | Total_Liabilities
bsse | 股東權益總計 | Total_Equity
bslse | 負債及股東權益總計 | Total_Liabilities_and_Equity
quick | 速動資產 | Quick_Assets
ppe | 生財設備 | Total_Fixed_Assets
ar | 長短期應收帳款 | Accounts_Receivable_Current_and_Non_Current
ip22 | 營業總成本 | Total_Operating_Cost
ip31 | 營業費用 | Total_Operating_Expenses
ip51 | 所得稅 | Income_Tax_Expense
iv41 | 利息收入 | Total_Interest_Income
if11 | 利息支出 | Interest_Expense
ispsd | 特別股股息 | Preferred_Stock_Dividends
nri | 非常續性利益 | Non_Recurring_Net_Income
ri | 常續性利益 | Recurring_Net_Income
nopi | 非營業利益 | Non_Operating_Income
ebit | 稅前息前淨利 | Earnings_Before_Interest_and_Tax
cip31 | 折舊及攤提 | Depreciation_and_Amortisation
cscfo | 營運產生現金流量 | Cash_Flow_from_Operating_Activities
cscfi | 投資產生現金流量 | Cash_Flow_from_Investing_Activities
cscff | 融資產生現金流量 | Cash_Flow_from_Financing_Activities
person | 員工人數 | Number_of_Employees
wavg | 加權平均股數 | Weighted_Average_Outstanding_Shares_Thousand
taxrate | 稅率 | Taxrate
r104 | 常續ROE | Return_Rate_on_Equity_A_percent
r115 | 常續ROA | Return_on_Total_Assets_A_percent
r410 | 固定資產成長率 | Depreciable_Fixed_Assets_Growth_Rate
r517 | 利息支出率 | Interest_Expense_Rate_percent
r616 | 應付帳款週轉率 | Accounts_Payable_Turnover
r834 | 每人營收 | Sales_Per_Employee



1.3.0版本新增欄位
欄位代號 | 中文名稱 | 英文名稱
-- | -- | --
a0100 | 流動資產 | Total_Current_Assets
a0960 | 非流動資產 | Total_Non_Current_Assets
a0010 | 資產總額 | Total_Assets
a1100 | 流動負債 | Total_Current_Liabilities
a1800 | 非流動負債 | Total_Non_Current_Liabilities
a1000 | 負債總額 | Total_Liabilities
a200e | 母公司股東權益合計 | Total_Equity_Attributable_To_Owners_Of_Parent
a2900 | 非控制權益 | NCI
a2000 | 股東權益總額 | Total_Equity
a0020 | 負債及股東權益總額 | Total_Liabilities_And_Equity
a3100 | 營業收入淨額 | Total_Operating_Revenue
a3200 | 營業成本 | Total_Operating_Costs
a3295 | 營業毛利 | Gross_Profit_Loss_From_Operations
a3300 | 營業費用 | Total_Operating_Expenses
a3395 | 營業利益 | Net_Operating_Income_Loss
a3501 | 財務成本 | Finance_Costs_Net
a3700 | 營業外收入及支出 | Total_Non_Operating_Income_And_Expenses
a3900 | 稅前淨利 | Profit_Loss_Before_Tax
a3910 | 所得稅費用 | Income_Tax_Expense
a3920 | 繼續營業單位損益 | Profit_Loss_From_Continuing_Operations
a3970 | 合併總損益 | Total_CI
a3950 | 歸屬母公司淨利_損 | Profit_Loss_Attributable_To_Owners_Of_Parent
a3990 | 每股盈餘 | Basic_Earnings_Per_Share
a211f | 加權平均股數 | Weighted_Average_Number_Of_Ordinary_Shares_In_Thousands
a399z | 每股盈餘_基本_財報原值 | Basic_Earnings_Per_Share_MOPS
a2111 | 普通股股數 | Common_Stock_Shares
a2121 | 特別股股數 | Preferred_Stock_Shares
a2303 | 增資準備_約當股數 | Equivalent_Shares_Of_Stock_Dividend_To_Be_Distributed
a2117 | 發放特別股股息 | Preference_Share_Dividends
a2402 | 稅前息前淨利 | Earnings_Before_Interest_And_Tax
a2403 | 稅前息前折舊前淨利 | Earnings_Before_Interest_Tax_Depreciation_And_Amortization
a240g | 庫藏股數（母持及子持母） | Total_Treasury_Shares
a7210 | 來自營運之現金流量 | Net_Cash_Flows_From_Used_In_Operating_Activities
a7300 | 投資活動之現金流量 | Net_Cash_Flows_From_Used_In_Investing_Activities
a7400 | 籌資活動之現金流量 | Net_Cash_Flows_From_Used_In_Financing_Activities
r101 | ROA_A_稅後息前 | ROA_A_Income_From_Continuing_Operation_Before_Interest
r103 | ROE_A_稅後 | ROE_After_Tax
r145 | 稅前息前折舊前淨利率 | Net_Profit_Margin_Before_Interest_Taxes_Depreciation_And_Amortization
r203 | 研究發展費用率 | R&D_Expenses_Ratio
a0200 | 貼現及放款_銀行、金控 | Discounts_And_Loans_Net_Banking_And_Financial
a1300 | 存款及匯款_銀行、金控 | Total_Deposits_And_Remittances_Banking_And_Financial
a3510 | 利息支出_銀行、金控 | Total_Interest_Expenses_Banking_And_Financial_
a341c | 利息淨收益_銀行、金控 | Net_Income_Loss_Of_Interest_Banking_And_Financial_
a345a | 手續費淨收益_銀行、金控 | Net_Service_Fee_Charge_Income_Losses_Banking_And_Financial
a340a | 淨收益_銀行、金控 | Net_Income_Banking_And_Financial
a3350 | 營業成本_保險 | Total_Operating_Costs_Insurance
a3400 | 營業外收入及支出_保險 | Total_Non_Operating_Income_And_Expenses_Insurance
a310c | 收益合計_證券 | Total_Revenue_Securities
a3600 | 支出及費用合計_證券 | Total_Expenditure_And_Expense_Securities
a340f | 業外_營業外損益合計_證券 | Total_Non_Operating_Income_And_Expenses_Securities
