# サクラエディタ互換性ガイド

## 概要

サクラエディタの古いJavaScriptエンジンとの互換性を確保するための修正一覧とガイドライン。

## 修正済み問題

### 1. ES6メソッドの互換性問題

#### `startsWith()` メソッド
```javascript
// ❌ 非互換（ES6）
if (text.startsWith("□")) {

// ✅ 互換性あり（ES5以前）
if (text.indexOf("□") === 0) {
```

#### `endsWith()` メソッド
```javascript
// ❌ 非互換（ES6）
if (text.endsWith("□")) {

// ✅ 互換性あり（ES5以前）
if (text.indexOf("□") === text.length - 1) {
```

#### `includes()` メソッド
```javascript
// ❌ 非互換（ES6）
if (text.includes("□")) {

// ✅ 互換性あり（ES5以前）
if (text.indexOf("□") !== -1) {
```

### 2. サクラエディタAPI問題

#### `Editor.SetLineStr()` 関数問題
```javascript
// ❌ 存在しない関数
Editor.SetLineStr(0, newLineText);

// ✅ 正しい実装方法
Editor.GoLineTop(0);          // 行頭に移動
Editor.SelectLine();          // 行全体を選択
Editor.InsText(newLineText);  // 選択範囲を置換
```

#### `Editor.GetLineStr()` 使用方法
```javascript
// ✅ 現在行の取得
var currentLineText = Editor.GetLineStr(0);
```

## 互換性チェックリスト

### JavaScriptメソッド
- [x] `startsWith()` → `indexOf() === 0`
- [x] `endsWith()` → `indexOf() + length === string.length`
- [x] `includes()` → `indexOf() !== -1`
- [x] `const`/`let` → `var` に統一
- [x] アロー関数 → `function` 形式
- [x] テンプレートリテラル → 文字列連結

### サクラエディタAPI
- [x] `Editor.GetLineStr(行番号)` - 正しく使用
- [x] `Editor.SetLineStr()` - 存在しない関数を正しいAPI呼び出しに修正
- [x] `Editor.GoLineTop()`, `Editor.SelectLine()`, `Editor.InsText()` - 組み合わせで行置換

### ES5準拠の書き方

#### 変数宣言
```javascript
// ✅ var使用（ES5互換）
var currentSymbol = "";
var remainingText = contentAfterIndent;
```

#### 関数定義
```javascript
// ✅ function文（ES5互換）
function getNextSymbol(currentSymbol) {
    // 処理
}
```

#### オブジェクトリテラル
```javascript
// ✅ ES5互換
return {
    symbol: symbol,
    remainingText: text.substring(symbol.length)
};
```

## テスト済み環境

- ✅ サクラエディタ 2.2.0以降
- ✅ Windows 7/8/10/11
- ✅ JScriptエンジン（Internet Explorer互換）

## 注意事項

### 避けるべき機能
- ES6以降の新しいメソッド
- `const`/`let` キーワード
- アロー関数
- テンプレートリテラル
- 分割代入
- デフォルト引数

### 推奨する書き方
- `var` による変数宣言
- `function` による関数定義
- `indexOf()` による文字列検索
- 従来の文字列連結（`+` 演算子）
- プロトタイプベースのオブジェクト指向

## デバッグ方法

### エラー確認
1. サクラエディタでマクロ実行
2. エラーメッセージの行番号を確認
3. 該当行の非互換メソッドをチェック
4. 互換性のある書き方に修正

### 動作テスト
1. 各種インデントパターンでテスト
2. 記号切り替えの循環確認
3. エラーハンドリングの確認

## 更新履歴

- 2025-06-20: 初版作成
  - `startsWith()` → `indexOf()` 修正
  - `Editor.SetLineStr()` 存在しない関数問題を修正
  - 正しいサクラエディタAPI使用方法に変更
  - 互換性ガイドライン策定