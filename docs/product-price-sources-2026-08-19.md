# 商品價格與來源紀錄（2026-08-19）

## 主題：新增「行動電源」分頁，最終定案五款

原本 `cio-smartcoby-slimii-wireless-2-2-8k-special-edition`（CIO SMARTCOBY SLIMII
Wireless2.2 8K）掛在「藥妝日用」的「3C 配件」分類下。使用者要求把行動電源獨立成一個分頁，
並另外分析可攜帶、容量大、評價高的 CIO 行動電源。

本文件記錄同日兩輪研究：第一輪（三款，含 20,000 mAh 的 TRIO）依「容量大」選型；
使用者接著確認情境為「一個人、只充手機」，第二輪據此重選，最終定案為下列五款：

1. SMARTCOBY Pro SLIM SS（¥6,280）── 首選
2. SMARTCOBY SLIMⅡ Wireless2.2 Pro SS10K（¥8,580）── 磁吸貼背
3. SMARTCOBY SLIMII Wireless2.2 8K Special Edition（¥8,980）── 原有卡片，保留
4. SMARTCOBY Pro SLIM CABLE（¥5,980）── 內建線
5. SMARTCOBY Pro CABLE C（¥6,578）── 內建線，舊世代

## 使用情境（2026-08-19 第二輪確認）

使用者確認情境為**一個人、只充手機**。這一點推翻了第一輪的選型：

- 手機最多吃到 20–27 W，35 W 以上的輸出差異用不到，高輸出不構成選購理由。
- USB-A、多埠同時充電同樣用不到。
- 20,000 mAh 級的 `cio-smartcoby-trio-35w-ss-20k`（320 g）對單人充手機是純負擔，**本輪已下架**，
  圖片（thumb／full／原圖）與 manifest 項目一併移除。

因此分頁改為五款，全部是 8,000–10,000 mAh 級距，依推薦順位排列。

## CIO 現行陣容的重要變化

查證時發現 CIO 的 SMARTCOBY 系列在 2026 年整批換代。官方系列頁
（<https://connectinternationalone.co.jp/cioproduct/mobilebattery/smartcoby>）
現在只列 10 款，**全部是半固體（SS）電芯**，且多數搭載 Qi2.2 磁吸無線。

本頁五款中：

| 商品 | 是否在官方現行系列頁 |
|---|---|
| SMARTCOBY Pro SLIM SS | ✅ 現行 |
| SMARTCOBY SLIMⅡ Wireless2.2 Pro SS10K | ✅ 現行 |
| SMARTCOBY SLIMII Wireless2.2 8K Special Edition | ❌ 已不列入 |
| SMARTCOBY Pro SLIM CABLE | ❌ 已不列入（官方選購指南仍在推薦並附購買連結） |
| SMARTCOBY Pro CABLE C | ❌ 已不列入（更早的群眾募資世代） |

「不在系列頁」不等於「停產」——官方選購指南 <https://connectinternationalone.co.jp/mb-choice>
仍列出 Pro SLIM CABLE 並附 Amazon／楽天 連結。因此這三款維持在清單上，但：

- 8K 的 `note` 與 `priceNote` 明講它已非現行、且接班人更便宜容量更大。
- 五款的 `stores` 一律留空、只填 `storeCandidates`（詳見下方「購買地點」一節），
  因為門市不保證有貨，不應該給出「這家買得到」的確定語氣。

**8K 與其接班人的對照**（這是本輪最有價值的發現）：
SLIMⅡ Wireless2.2 Pro SS10K（¥8,580）比 8K（¥8,980）**便宜 ¥400、容量多 2,000 mAh、
電芯改半固體、有線輸出從 30 W 升到 35 W**。想要磁吸無線就該買接班人。

## 選型理由（第一輪，保留備查）

CIO 官方選購指南（<https://connectinternationalone.co.jp/mb-choice>）把現行 SMARTCOBY
系列依用途分組，其中 **SMARTCOBY Pro SLIM SS** 是「まず1台、失敗しにくいものを選びたい」
組的イチオシ，官方文案為「迷ったらコレ。全部のバランスが一番良い」。這個判斷在第二輪
（只充手機）依然成立，故維持為首選。

## 查證資料（五款，2026-08-19 查證）

| 商品 | 型號 | 容量 | 有線輸出 | 無線 | 尺寸 | 重量 | 本體充飽 | 含稅定價 | priceKind |
|---|---|---|---|---|---|---|---|---|---|
| Pro SLIM SS | CIO-MB35W2C1A-SSA10K-S | 10,000 mAh（39.1 Wh） | 單埠 35 W | — | 66.8×98.3×16 mm | 187 g | 90 分 | ¥6,280 | `official` |
| SLIMⅡ W2.2 Pro SS10K | CIO-MB35W1C-SS10K-S2W25 | 10,000 mAh | 單埠 35 W | Qi2.2 25 W | 101×70×17 mm | 225 g | 140 分 | ¥8,580 | `official` |
| SLIMII W2.2 8K SE | CIO-MB30W1C-8K-S2W25-EE-BK | 8,000 mAh | 30 W | Qi2.2 25 W | 約 12 mm 厚 | 170 g | — | ¥8,980 | `retailer-reference` |
| Pro SLIM CABLE | CIO-MB35W2C-10000-SC | 10,000 mAh（38.5 Wh） | 單埠 35 W（雙埠合計 30 W） | — | 101.5×64.5×17.8 mm | 189 g | 90 分 | ¥5,980 | `official` |
| Pro CABLE C | SMARTCOBYPRO-35W-CABLE-C | 10,000 mAh | 單埠 35 W（雙埠合計 15 W） | — | 83×66×26.3 mm | 198 g | — | ¥6,578 | `official` |

官方單品頁：

- Pro SLIM SS：<https://connectinternationalone.co.jp/cioproduct/mobilebattery/smartcoby/cio-mb35w2c1a-ssa10k-s/>
- SLIMⅡ W2.2 Pro SS10K：<https://connectinternationalone.co.jp/cioproduct/mobilebattery/smartcoby/cio-mb35w1c-ss10k-s2w25/>
- Pro SLIM CABLE：<https://connectinternationalone.co.jp/cioproduct/mobilebattery/smartcoby/cio-mb35w2c-10000-sc/>
- Pro CABLE C：<https://connectinternationalone.co.jp/cioproduct/mobilebattery/smartcoby/smartcoby-pro-cable-c/>
- 8K Special Edition：<https://www.biccamera.com/bc/item/15238470/>（沿用 2026-08-11 查證）

### 兩款內建線款的差異（使用者特別詢問）

Pro SLIM CABLE 與 Pro CABLE C 同為 10,000 mAh、單埠 35 W、內建可拆式 USB-C 線，但：

| | Pro SLIM CABLE | Pro CABLE C |
|---|---|---|
| 體積 | 116.5 cm³ | 144.1 cm³（大 24%） |
| 厚度 | 17.8 mm | 26.3 mm |
| 雙埠合計 | 30 W | 15 W |
| 快充規格 | PPS／PD3.0／QC4.0+ | PD3.0／PPS |
| 定價 | ¥5,980 | ¥6,578 |

Pro CABLE C 是上一代（群眾募資世代），每一項都較差且定價更高，結論是**除非出清到 ¥3,000
上下否則不值得**。此結論寫入其 `note`。

Pro SLIM CABLE 官方頁面存在自我矛盾：功能敘述寫「デジタル残量表示」，規格表卻寫
「ドットLED残量表示」。無法從官方資料判定，已在 `priceNote` 記錄，請到店以實機確認。

## 電量顯示與實容量

《家電批評》2026 上半期實測 Pro SLIM SS 的實際可充出容量為 6,187.5／10,000 mAh
（損失率 38.1%，屬業界平均水準），0→45% 只要 30 分鐘。其餘四款無同等級的第三方實測，
比較表因此只寫標稱容量，並在表頭說明「實際可充出約為標稱的六至七成」。

## 評價依據

- CIO 官方選購指南把 Pro SLIM SS 列為「迷ったらコレ。全部のバランスが一番良い」的イチオシ。
- 日本評測媒體對前代／同型 TRIO 20000mAh 的評價普遍在 4.5/5 左右，重點是
  「20,000 mAh 卻只有卡片大小」；價格.com 上 TRIO 20000mAh 的使用者評價亦以
  「この容量でこの大きさと重さは適切」為主，共通的扣分項是「相對於 10,000 mAh 款仍偏重」。
- TRIO 系列在 Makuake 募資時有 9,685 位支持者，是 CIO 話題度最高的行動電源系列之一。

以上為第三方評價的定性摘要，**沒有**寫進商品資料的 `priceNote`，避免與價格佐證混淆。

## 購買地點（2026-08-19 定案，同日修正為 stores 留空）

使用者指定**五款一律並列同一組店家**，購買動線統一：

| 店家 | 說明 |
|---|---|
| `yodobashi-camera-hakata`（ヨドバシカメラ マルチメディア博多） | ヨドバシ設有 CIO 專門賣場（逾 190 項 CIO 商品），SMARTCOBY 系列鋪貨最完整 |
| `biccamera-tenjin-1`、`biccamera-tenjin-2` | BicCamera 亦販售 SMARTCOBY 系列；天神兩館分館別品項不同，故兩館都列 |

「購買動線統一」指的是這三家店，不代表「確定有貨」——五款中有三款（8K、Pro SLIM
CABLE、Pro CABLE C）已非 CIO 現行陣容，門市能不能買到要碰運氣。因此五款的
`stores` 一律留空，上列三家改列 `storeCandidates`；頁面上以「可詢問門市」的措辭
在分區頂端顯示一列，不再用肯定語氣宣稱「購買地點」，卡片內也不各印一次。

需要留意的兩點：

1. 這是**購買動線的安排**，不是「已確認三家都有貨」的查證結論。五款中有三款
   （8K、Pro SLIM CABLE、Pro CABLE C）已非 CIO 現行陣容，門市能不能買到要碰運氣，
   各自的 `note`／`priceNote` 都寫明「到店請直接報型號問店員」。
2. 8K 的**價格佐證**仍取自 BicCamera 商品頁（`priceSourceUrl` 為 biccamera.com），
   與購買地點是兩件事。這句說明寫在 `note` 而非 `priceNote`——驗證器會檢查
   `priceNote` 點名的通路是否與 `priceSourceUrl` 網域相符，把「購買地點含ヨドバシ」
   寫進 `priceNote` 會（正確地）觸發誤報。

## 購買地點（第一輪，保留備查）

| 店家 | 用途 |
|---|---|
| `yodobashi-camera-hakata`（ヨドバシカメラ マルチメディア博多） | 列為 `stores`。ヨドバシ設有 CIO 專門賣場（`https://www.yodobashi.com/maker/5000006288`，逾 190 項 CIO 商品），SMARTCOBY 系列鋪貨最完整 |
| `biccamera-tenjin-1`、`biccamera-tenjin-2` | 列為 `storeCandidates`。BicCamera 亦販售 SMARTCOBY 系列，天神兩館分館別品項不同 |

半固體（SS）版本為 2026 年新品，**線上有貨不等於門市有貨**，到店請先向店員確認型號庫存。

## 圖片

CIO 官方商品照無授權可用，本次環境亦無法取得原圖，因此兩款的卡片圖改為
依官方規格自繪的**規格示意圖**（`images/source/cio-smartcoby-pro-slim-ss-10k.svg`、
`images/source/cio-smartcoby-trio-35w-ss-20k.svg`），圖上標明容量、輸出、尺寸與重量，
右下角註記「規格示意圖」，商品 `note` 亦寫明不是官方商品照，避免被誤認為實品照片。
之後若取得可用的實品照片，替換 `images/source/` 原圖再跑 `npm run build:images` 即可。

## 攜帶提醒（寫入比較表）

日本自 **2026 年 4 月 24 日**起實施行動電源上機新規（國土交通省依 ICAO 修訂，JAL 已公告）：

- 每人最多攜帶 **2 個**（160 Wh 以下），違反有罰則
- **機內禁止對行動電源充電**，也不可用它為其他裝置充電
- 不可放入頭頂行李櫃，須置於座位口袋等隨手可及處
- 一律不可託運

本頁五款均在 40 Wh 以內，遠低於 160 Wh 上限（IATA 可能自 2027 年 1 月收緊至 100 Wh，
仍在範圍內）。第一輪只寫了「不可託運」，本輪已補上完整新規。

來源：<https://www.jal.co.jp/jp/ja/info/2026/other/260330>
