# 学校図書館×ICT研修ポータル

生成AI・Gemini Notebook・Canva・Google Workspaceで、学校図書館をもっと楽しく、もっと便利に。
研修当日の進行支援だけでなく、研修後も学校司書・教員が繰り返し訪れて使う「実践支援サイト」です。

- HTML / CSS / JavaScript のみで構築(Node.js・npm・ビルドツール不使用)
- GitHub Pages にそのままアップロードすれば公開できます
- 相対パスのみで構成されているため、フォルダごと移動しても壊れません

---

## 1. サイトの目的

1. 90分研修の進行を支援する
2. 参加者がプロンプトをそのままコピーして使えるようにする
3. 研修後に内容を復習できるようにする
4. 学校図書館で困ったときに解決方法を探せるようにする
5. 他校の実践やアイデアを蓄積・共有できるようにする
6. 将来的に学校図書館DX事例を追加できるようにする

---

## 2. ファイル構成

```
school-library-ict-portal/
│
├── index.html                          … トップページ(第1階層)
│
├── courses/                            … 各STEPページ(第2階層)
│   ├── step0-slido.html                … STEP0: みんなの実践を集めよう(Slido)
│   ├── step1-chatgpt.html              … STEP1: AIでアイデアを生み出そう(ChatGPT)
│   ├── step2-gemini-notebook.html      … STEP2: 分かりやすく伝えよう(Gemini Notebook)
│   ├── step3-canva-website.html        … STEP3: 発信しよう(Canva)
│   └── step4-gas-dx.html               … STEP4: AIとつくる図書館日誌Webアプリ(ChatGPT×GAS)
│
├── prompts/
│   └── prompt-library.html             … 今日から使えるプロンプト集
│
├── cases/
│   └── dx-cases.html                   … 学校図書館DX事例集
│
├── community/
│   └── share.html                      … 実践共有・質問
│
├── resources/
│   └── resources.html                  … 資料・リンク集
│
├── assets/
│   ├── css/style.css                   … 共通スタイル(CSS変数で色・フォントを一元管理)
│   ├── js/main.js                      … 共通スクリプト(全ページ共通)
│   └── images/
│       ├── profile.jpg                 … 講師プロフィール写真(プレースホルダー同梱)
│       ├── book01.jpg / book02.jpg     … 著作の書影(プレースホルダー同梱)
│       ├── hero-library.jpg            … トップページ用イメージ(プレースホルダー同梱)
│       └── placeholders/               … その他の差し替え用素材置き場
│
├── README.md                            … このファイル
└── 画像差し替え手順.md                    … 画像差し替えの詳しい手順
```

---

## 3. ローカルで確認する方法

画像やアイコンをすべて表示させ、正しく動作を確認するには、簡易サーバーを使って開くことをおすすめします(ブラウザで直接ファイルを開いても閲覧はできますが、一部ブラウザではセキュリティ制限により正しく動かない場合があります)。

**Pythonがインストールされている場合**

```bash
cd school-library-ict-portal
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開いてください。

**VS Codeを使う場合**

拡張機能「Live Server」をインストールし、`index.html` を右クリックして「Open with Live Server」を選択してください。

---

## 4. GitHub Pagesで公開する方法

1. GitHubで新しいリポジトリを作成する
2. `school-library-ict-portal` フォルダの中身一式をリポジトリにアップロードする(コミット・プッシュする)
3. リポジトリの「Settings」→「Pages」を開く
4. 「Source」で公開したいブランチ(例: `main`)と、フォルダ(`/root`)を選択して保存する
5. 数分後、`https://(ユーザー名).github.io/(リポジトリ名)/` で公開される
6. 公開URLが確定したら、各HTMLファイルの `<link rel="canonical" ...>` と OGPコメントを実際のURLに差し替える(下記「15. 公開前チェックリスト」参照)

---

## 5. プロフィール写真の差し替え方法

1. 差し替えたい写真を `assets/images/profile.jpg` という同じファイル名で保存する(正方形推奨)
2. 既存の `profile.jpg` を上書きする
3. HTMLは変更不要です(ファイル名が同じであれば自動的に反映されます)

詳しくは「画像差し替え手順.md」を参照してください。

---

## 6. 書籍画像と情報の差し替え方法

現在は「先生のためのCanva教育版 やさしい入門」(技術評論社)の実際の情報を1冊、`.book-card-featured` という大きめのカードで掲載しています。

- 情報が変わった場合は、`index.html` 内の `<!-- 書籍情報とAmazon URLをここで差し替えてください -->` コメント以下のブロックを書き換えてください。
- 表紙画像は `assets/images/book01.jpg` を同じファイル名で差し替えます。
- 2冊目以降を追加する場合は、`<div class="card book-card-featured">...</div>` ブロックごと複製し、`assets/images/book02.jpg`(あらかじめ同梱済み)などの画像と情報に書き換えて、既存のカードの下に追加してください。2冊以上を横並びにしたい場合は、複製したカードを `<div class="grid grid-2">` で囲んでください。

---

## 7. SlidoのURLとQRコードの差し替え方法

`courses/step0-slido.html`(STEP0)には、現在のSlidoイベント(`https://app.sli.do/event/dhfZVaXE3bcz9fYbUkzd8F`)が参加URL・参加ボタンの2か所に設定済みです(ボタンは新しいタブで開きます)。QRコード画像も `assets/images/placeholders/slido-qr.png` に設定済みです。

イベントを差し替える場合は、次の手順で更新してください。

- `courses/step0-slido.html` 内の `https://app.sli.do/event/dhfZVaXE3bcz9fYbUkzd8F` という文字列を、新しい参加URLに置き換える(2か所)
- 新しいQRコード画像を用意し、同じファイル名(`assets/images/placeholders/slido-qr.png`)で上書き保存する(HTMLの変更は不要)

`community/share.html` の「みんなの実践を見る」ボタンのリンク先にもSlidoのURLを使う場合は、同様に `href` を差し替えてください。

---

## 8. GoogleフォームのURL差し替え方法

`community/share.html` 内の以下の `href` 属性を、実際のGoogleフォームURLに書き換えます。

- `【ここにGoogleフォームURLを入力】` … 実践共有フォーム
- `【ここに質問用GoogleフォームURLを入力】` … 質問フォーム
- `【ここに回答公開用URLまたはSlido URLを入力】` … 回答閲覧用ページ

---

## 9. YouTube動画の埋め込み方法

STEPページにデモ動画を追加したい場合は、任意の場所に次のような `.video-frame` ブロックを挿入してください。

```html
<div class="video-frame">
  <iframe src="https://www.youtube.com/embed/【動画ID】"
          title="デモ動画" allowfullscreen loading="lazy"></iframe>
</div>
```

`.video-frame` は16:9の比率を自動で保つので、`iframe` の幅・高さは指定不要です。なお `courses/step0-slido.html` のSlido参加エリアは、埋め込み表示ではなく「参加ボタン(新しいタブで開く)＋QRコード」の構成にしています。

---

## 10. プロンプトを追加する方法

`prompts/prompt-library.html` の `<div id="itemList">` 内にある `<article class="prompt-card">...</article>` ブロックのいずれかをコピーし、以下を書き換えて末尾に追加します。

1. `id` と `data-item` … サイト内で一意のID(例: `letter-02`)
2. `data-category` … 該当するカテゴリのスラッグ(下表参照)。複数該当する場合は半角スペース区切りで複数指定可能
3. `data-school` … 対象校種(`elementary` `middle` `high` を半角スペース区切りで指定。全校種なら3つとも記載)
4. `data-search` … 検索対象になるキーワード
5. `data-fav-id` … `id`と同じ値を指定(お気に入り機能に必要)
6. `data-copy-target` と、対応する `<div id="...">` の `id` … コピー対象のプロンプト本文
7. プロンプト本文(`.prompt-body`)を書き換える

**カテゴリスラッグ一覧**: `letter`(図書館だより) `pop`(POP) `recommend`(おすすめ本紹介) `event`(イベント企画) `week`(読書週間) `newbook`(新刊紹介) `exhibit`(展示企画) `orientation`(図書館オリエンテーション) `quiz`(クイズ) `worksheet`(ワークシート) `survey`(アンケート) `analysis`(集計・分析) `parent`(保護者向け文書) `video`(動画構成) `website`(ホームページ文章) `office`(校務効率化)

新しいカテゴリを追加する場合は、フィルターの `<button class="chip" data-filter-category="...">` も追加してください。

---

## 11. DX事例を追加する方法

`cases/dx-cases.html` の `<div id="itemList">` 内にある `<article class="card case-card">...</article>` ブロックをコピーし、以下を書き換えて追加します。

1. `data-item` … 一意のID(例: `case-16`)
2. `data-category` … 該当カテゴリのスラッグ(`borrow` `visualize` `efficiency` `display` `lesson` `participate` `count` `webapp`)
3. `data-search` … 検索用キーワード
4. 見出し・困りごと・ツール・校種・難易度ラベル(`difficulty easy/setup/dev/agree`)・導入目安を書き換える
5. `data-case-toggle` の対象IDと、`.case-detail` 内の `<dl>`(実施手順・期待できる効果・注意点・関連STEP・関連プロンプト)を書き換える

---

## 12. Canvaサイトへのリンク追加方法

`resources/resources.html` の「Canva教育版」セクションにある表に行を追加し、`【ここにURLを入力】` の部分に実際のURLを入力してください。トップページの著作カードやSTEP3ページからリンクする場合も、同様に `href` を書き換えます。

---

## 13. 外部リンクを追加する方法

このサイトでは、外部リンクをできるだけ `resources/resources.html` に集約しています。新しいリンクを追加する場合は、

1. `resources/resources.html` の該当カテゴリの表に行を追加する
2. 必要に応じて、関連するSTEPページや事例ページからも `resources/resources.html` へリンクする

という流れにすると、リンク切れが起きたときの管理がしやすくなります。

---

## 14. 色やフォントを変更する方法

`assets/css/style.css` の先頭にある `:root { ... }` 内のCSS変数を書き換えるだけで、サイト全体の配色が変わります。

```css
:root {
  --color-ink: #111114;       /* 基本の文字色・ボタン色 */
  --accent-start: #4f6df5;    /* アクセントグラデーション開始色 */
  --accent-end: #7c5cf0;      /* アクセントグラデーション終了色 */
  --color-navy: #16264a;      /* 補助カラー: ネイビー */
  --color-green: #1f6f54;     /* 補助カラー: 深緑 */
  --color-orange: #e08a35;    /* 補助カラー: オレンジ */
  ...
}
```

フォントを変更する場合は、`<head>` 内のGoogle Fonts読み込み行と、`style.css` の `--font-base` を書き換えてください(候補: Noto Sans JP / Zen Kaku Gothic New / M PLUS Rounded 1c)。

---

## 15. 公開前チェックリスト

- [ ] プロフィール写真を差し替えた(`assets/images/profile.jpg`)
- [ ] 著作情報・書影を差し替えた(`index.html` 内の書籍カード、`assets/images/book01.jpg` / `book02.jpg`)
- [ ] AmazonリンクのURLを差し替えた
- [ ] SlidoイベントコードとURL、QRコードを差し替えた(`courses/step0-slido.html`)
- [ ] GoogleフォームのURL(実践共有・質問)を差し替えた(`community/share.html`)
- [ ] Canva学校図書館サイトURLを差し替えた(`resources/resources.html` 等)
- [ ] YouTube動画URLを埋め込んだ(必要なSTEPページ)
- [ ] 問い合わせ先を差し替えた(全ページのフッター)
- [ ] GitHub Pages公開URLを確定し、各ページの `canonical` とOGPコメントを差し替えた
- [ ] OGP画像を準備し、設定した
- [ ] 正式な開催日・会場名・主催者名を必要な箇所に反映した(トップページ・研修資料等)
- [ ] 全ページをクリックし、リンク切れがないか確認した
- [ ] スマートフォン・タブレット・PCで表示を確認した
- [ ] ダークモードでも文字が読みやすいか確認した

---

## プレースホルダー一覧(公開前に差し替える項目)

| 項目 | 主な差し替え箇所 |
|---|---|
| プロフィール写真 | `assets/images/profile.jpg` |
| 著作情報 | `index.html`(書籍カード) |
| Amazonリンク | `index.html`(書籍カード内 `href`) |
| Slidoイベントコード | `courses/step0-slido.html` |
| Slido URL | `courses/step0-slido.html`, `community/share.html` |
| Slido QRコード | `courses/step0-slido.html` |
| GoogleフォームURL(実践共有) | `community/share.html` |
| 質問フォームURL | `community/share.html` |
| 実践共有URL(回答公開) | `community/share.html` |
| Canva学校図書館サイトURL | `resources/resources.html` |
| YouTube動画URL | 各 `courses/*.html` の `.video-frame` |
| 問い合わせ先 | 全ページのフッター |
| GitHub Pages公開URL | 全ページの `<link rel="canonical">`、OGPコメント |
| OGP画像 | 全ページの `<head>` 内OGPコメント |
| 正式な開催日 | トップページ・配布資料 |
| 会場名 | 配布資料・実施要項 |
| 主催者名 | フッター・配布資料 |

---

© 2026 Michihiro Wada. All Rights Reserved.
