# サクラエディタ TODO記号切り替えマクロ 開発TODO

## プロジェクト概要
サクラエディタで1つのショートカットキーで行頭に □ → ◆ → ■ → □ の記号を循環切り替えするマクロを作成する。

## 要件
- ショートカットキー（KEY）を押すと、□が文の頭に出る
- □の状態でKEYを押すと、◆になる
- ◆の状態でKEYを押すと、■になる
- ■の状態でKEYを押すと、□になる
- 1行の頭から「tabか半角スペース、全角スペース」は無視をして挙動してほしい

## 動作例
```
　　　テスト
　　　□テスト
　　　◆テスト
　　　■テスト
```

## TODOリスト

### 🔴 高優先度
- [x] ~~サクラエディタマクロの要件分析（ショートカットキーでの状態切り替え）~~
- [x] ~~行頭のインデント（tab、半角スペース、全角スペース）を無視する処理の設計~~
- [x] ~~状態判定ロジックの設計（□→◆→■→□のサイクル）~~

### 🟡 中優先度
- [x] ~~カーソル位置の制御とテキスト挿入・置換処理の設計~~
- [x] ~~サクラエディタマクロファイル（.js）の実装~~

### 🟢 低優先度
- [x] ~~マクロの動作テストとショートカットキー設定手順の確認~~

## 技術仕様

### 対象記号
- □ (白四角)
- ◆ (黒ダイヤ)
- ■ (黒四角)

### インデント処理
- タブ文字 (`\t`)
- 半角スペース (` `)
- 全角スペース (`　`)

### 実装言語
- JavaScript (サクラエディタマクロ)

## 完了基準
- [x] ~~1つのショートカットキーで記号が正しく循環する~~
- [x] ~~インデントが正しく保持される~~
- [x] ~~既存のテキストが破損しない~~
- [x] ~~マクロファイルが完成している~~
- [x] ~~設定手順が明確になっている~~

## 実装済みファイル
- `indent-processor.js` - インデント処理モジュール
- `toggle_todo_symbols.js` - TODO記号切り替えマクロ（完全実装版）
- `todo_toggle_integrated.js` - 統合版マクロ
- `README.md` - プロジェクト説明とインストールガイド
- `SETUP_GUIDE.md` - 詳細設定手順とトラブルシューティング
- `COMPATIBILITY.md` - サクラエディタ互換性ガイド
- `CHARACTER_ENCODING_GUIDE.md` - 文字エンコーディング対策ガイド

## 修正履歴
### 2025-06-20 互換性問題修正
- ❌ 文字化け（□◆■→笹。箇・。） → ✅ Unicode Escape Sequence使用
- ❌ `startsWith()` → ✅ `indexOf() === 0`
- ❌ `Editor.SetLineStr()` (存在しない関数) → ✅ 正しいAPI組み合わせに修正
- ES5準拠コードに統一

### 文字エンコーディング修正詳細
```javascript
// 修正前（文字化けする）
var symbols = ["□", "◆", "■"];
if (text.indexOf("□") === 0) {

// 修正後（文字化けしない）
var symbols = ["\u25A1", "\u25C6", "\u25A0"];  // □ ◆ ■
if (text.indexOf("\u25A1") === 0) {
```

### API修正詳細（v2: 絶対位置指定）
```javascript
// 修正前（存在しない関数）
Editor.SetLineStr(0, newLineText);

// 修正後（絶対位置でカーソル位置保持）
var currentLine = Editor.GetLineCount(1);     // 現在行番号を記憶
var currentCol = Editor.GetSelectColumnFrom(); // 現在列位置を記憶

Editor.GoLineTop(0);          // 行頭に移動
Editor.SelectLine();          // 行全体を選択
Editor.Delete();              // 選択行を削除
Editor.InsText(newLineText);  // 新しい内容を挿入

Editor.Jump(currentLine, 1);  // 絶対位置で行頭に確実に復元
```

### API問題修正詳細（v3: シンプル安全版）
- `Editor.GetLineCount(1)` でLine 38エラーが発生
- API仕様不明のため、複雑なカーソル制御を諦める
- `Editor.GoLineTop(0)` による基本的な行頭復帰に変更
- 確実に動作する安全な実装を優先

### カーソル位置制御修正（v4: MoveCursor API版）
- API仕様書調査により正式なMoveCursor関数を確認
- `Editor.GetSelectLineFrom()` で現在行番号を記憶
- `Editor.MoveCursor(currentLine, 1, 0)` で確実に同じ行の行頭に復帰
- 連続記号切り替えが可能になる正確な位置制御を実現