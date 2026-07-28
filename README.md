# 天晟急診教學（網站＋PWA）

急診護理師與全院／外科部人員的教學平台。純靜態網頁，**不存個人資料、不接雲端**，
學習進度與測驗成績只存在使用者自己的裝置（localStorage）。

## 檔案結構

```
急診教學/
├─ index.html              ← 程式本體（版面、導覽、測驗邏輯）
├─ manifest.webmanifest    ← PWA 設定（App 名稱、圖示、主題色）
├─ sw.js                   ← 離線快取（Service Worker）
├─ icons/                  ← App 圖示
└─ data/                   ← ★ 平常只要改這三個檔
   ├─ courses.js           ← 教材（課程 → 章節 → 內容區塊）
   ├─ quiz.js              ← 測驗題庫
   └─ quickref.js          ← 臨床快查卡
```

**加教材、加題目、加快查卡，只要編輯 `data/` 裡的檔案，不用動 `index.html`。**
每個檔案開頭都有寫格式說明與可用的內容區塊型別。

## 常見維護動作

### 加一個新章節
在 `data/courses.js` 找到要放的課程，在它的 `chapters` 陣列裡加：

```js
{ id:'c7', title:'高血鉀急症', min:8, tags:['電解質'], blocks:[
    { t:'p', x:'開場說明…' },
    { t:'h', x:'一、心電圖變化' },
    { t:'ul', x:['T 波高尖','QRS 變寬'] },
    { t:'key', title:'重點', x:['血鉀 > 6.5 或有心電圖變化就要處理'] },
    { t:'warn', title:'注意', x:['先穩定心肌（鈣），再降鉀'] }
]}
```

> `id` 是進度紀錄的鍵值，**取好之後不要再改**，改了學員的已讀紀錄就會對不上。

### 加題目
在 `data/quiz.js` 陣列裡加一筆，`ch` 填章節 id，`a` 是**正確選項的索引（從 0 開始）**：

```js
{ id:'q069', ch:'c7', q:'高血鉀最先給哪一類藥物穩定心肌？',
  opts:['Calcium gluconate','Insulin+葡萄糖','利尿劑','Kayexalate'], a:0,
  ex:'鈣離子不會降血鉀，但能立刻穩定心肌細胞膜。' }
```

章節有幾題，教材頁與測驗頁會自動更新，不需另外設定。

### 放影片、PDF、圖片
- 影片：`{ t:'video', id:'YouTube影片ID', x:'影片說明' }`
- PDF／圖片：在 `急診教學/` 下開一個 `files/` 資料夾放檔案，然後
  `{ t:'pdf', href:'files/檢傷準則.pdf', x:'TTAS 完整版' }`、
  `{ t:'img', src:'files/ekg.png', x:'圖說' }`

## 本機預覽

```bash
python -m http.server 8801 --directory "C:\Users\user\Desktop\急診教學"
```

然後開 <http://localhost:8801>。
（用 `file://` 直接打開也能看，只是 PWA 安裝與離線功能不會啟用。）

## 部署到 GitHub Pages

桌面根目錄本身是「急診醫師排班」的 repo，本專案**要另外開一個獨立 repo**，
不要 commit 進根目錄那個 repo（根目錄的 `.gitignore` 已經預設忽略本資料夾）。

```bash
cd "C:\Users\user\Desktop\急診教學"
git init -b main
git add .
git commit -m "天晟急診教學：教材、題庫、快查、PWA"
gh repo create er-education --public --source=. --push
```

推上去後到 GitHub → Settings → Pages，Source 選 `main` / `root`，
網址會是 `https://leo005741010-byte.github.io/er-education/`。

之後改教材，重複：

```bash
cd "C:\Users\user\Desktop\急診教學"
git add . ; git commit -m "更新教材" ; git push
```

> 改完內容如果手機上還看到舊版，把 `sw.js` 最上面的 `er-edu-v1` 版本號 +1 再推一次，
> 就會強制清掉舊快取。

## 手機安裝成 App

- **Android Chrome**：開網址 → 右上角選單 →「安裝應用程式／加到主畫面」
- **iPhone Safari**：開網址 → 下方分享鍵 →「加入主畫面」

安裝後圖示在主畫面，開啟時全螢幕、沒有網路也能看教材與快查。

## 使用上的原則

1. **不要放病人資料**：教學案例一律去識別化（年齡以「50 多歲」表示，不寫病歷號、姓名、日期）。
2. **不要放個人成績**：這個站是公開的，學員成績只留在自己手機；要收訓練紀錄，
   請學員在「我的 → 列印／存成 PDF 學習紀錄」列印或存檔繳交。
3. **劑量以院內藥典為準**：快查卡是記憶輔助，程式內已加註免責說明，勿刪除。

## 之後可以再加的功能

- 依單位／職類分流（護理師版、PGY 版、全院版看到不同教材）
- 章節深連結（把某一章的網址直接貼到 LINE 群）
- 成績上傳雲端做完訓率總表（需要帳號機制，且個資不可放公開站）

---
版本 1.0 · 天晟醫院急診部
