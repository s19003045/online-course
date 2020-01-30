![](https://i.imgur.com/CpwEOIU.png)

## 專案名稱

### GamiCo 線上課程電商網站

![](https://i.imgur.com/T9RZKjO.png)

## 專案說明

- GamiCo 是一個線上課程網站，所有的網站使用者都可以購買課程、觀看課程、上傳課程、販售課程，幫助想要學習多元事物的人輕鬆的上課與分享知識。
- 為提升線上課程完課率，此專案嘗試使用遊戲化的元素加入專案，目前在實現在登入機制上，使用者登入時可以拿到固定點數，累積滿點數之後可以玩抽獎遊戲，有機會抽中平台內的課程。圖示如下
  ![](https://i.imgur.com/BSBmJZH.png)

## 網站 Demo

本專案已部署至 heroku 上，可以直接點選連結體驗
https://gamicourse.herokuapp.com

```
[demo account 1]
email: demo@course.com
password: 12345678

[demo account 2]
email: user1@course.com
password: 12345678
```

## User Story

### 學習者端

- 使用者可以看到全部課程
- 使用者可以選擇課程類別，看該類別的課程清單
- 使用者可以用 email 註冊
- 使用者可以收藏/取消收藏課程
- 使用者可以購買課程
- 使用者可以看課程介紹
- 使用者可以觀看課程內容
- 使用者可以勾選完成單元
- 使用者可以選擇章節
- 使用者可以看到問題討論區
- 使用者可以發問問題
- 使用者可以回覆問題
- 使用者可以看個人帳號資訊
- 使用者可以看到買過的課程清單
- 使用者可以看到收藏的課程清單
- 使用者可以看到提示訊息
- 使用者可以看到滑動式課程廣告

### 開課者端

- 建立課程

  - 使用者可以建立課程基本資訊（名稱、簡介、課程介紹影片、選擇課程類別、講師簡介）
  - 使用者可以上傳課程封面圖片
  - 使用者可以建立新章節（包含章節序號、名稱、簡介、時數、是否預覽/隱藏、影片連結）
  - 使用者可以用 Rich Editor 建立章節內容
  - 使用者可以暫存課程內容
  - 使用者可以訂定課程價格
  - 使用者可以預覽課程內容
  - 使用者可以送出開課申請

- 課程管理

  - 使用者可以看到自己開的課程資訊(課程名稱、狀態、申請日期、上架日期、價錢、課程時間、評價、學生人數)
  - 使用者可以編輯課程內容
  - 使用者可以看到學生資訊

## 使用技術/框架

- Front-end
  - HTML5/CSS3/Javascript
  - jQuery
  - Bootstrap
- Back-end
  - Node.js
  - NPM
  - Express.js
  - Handlebars
- Database
  - MySQL
  - Sequelize CLI

## 開發團隊

- 振銜
  - [GitHub](https://github.com/s19003045)
  - Medium [從零開始-打造線上課程平台](https://bit.ly/3aKceqh)
- Ariel
  - [GitHub](https://github.com/ariel92911)
  - Medium [AC 畢業專案：線上課程平台 GamiCo](https://bit.ly/2uGqdwJ)
- Sean
  - [GitHub](https://github.com/siang720)
  - Medium [ALPHA Camp 畢業專案心路歷程](https://medium.com/@siang720/7354171b1c36)

## Installation 本地端安裝專案

- Install Node.js and MySQL
  - Use [NVM](https://github.com/nvm-sh/nvm) to install Node.js
  - [MySQL](https://www.mysql.com/downloads/)
- 下載專案，請於終端機輸入
  ```
  $ git clone https://github.com/s19003045/online-course.git
  ```
- 切換至專案資料夾內，並執行下列指令安裝套件
  ```
  npm install
  ```
- 設置環境變數，請在專案資料夾內新增.env 檔，並依照[範例](https://github.com/s19003045/online-course/blob/master/.env.example)填上資料
- 安裝 MySQL Workbench，並建立一個連線，請使用以下連線資訊或是自行修改 config.json 檔
  ```
  Title: Local instance 3306
  Hostname: localhost
  Port: 3306
  Username: root
  Password: password
  ```
- 使用 MySQL Workbench 創建資料庫，開啟 Query 並執行下列指令
  ```
  CREATE DATABASE online_course_workspace;
  CREATE DATABASE online_course_workspace_test;
  ```
- 安裝並初始化 sequelize
  ```
  $ npm install mysql2 sequelize sequelize-cli
  $ npx sequelize init
  ```
- 執行 Migration & seeder
  ```
  $ npx sequelize db:migrate
  $ npx sequelize db:seed:all
  ```
- 大功告成，開啟伺服器
  ```
  $ npm run dev
  ```
- 開啟瀏覽器，網址列輸入 http://localhost:3000，即可開始體驗
