# 文字エンコーディング対策ガイド

## 問題の概要

サクラエディタでTODO記号 □◆■ が文字化けして表示される問題の対策ガイドです。

## 文字化け例

### 発生する文字化け
```
期待: □◆■
実際: 笹。箇・。笹・・。
```

### 文字化けパターン
- `□` → `笹。`
- `◆` → `箇・`  
- `■` → `笹・・`

## 原因

### エンコーディング不一致
- **JavaScriptファイル**: UTF-8で保存
- **サクラエディタ**: Shift_JISで動作
- **結果**: Unicode文字の解釈が異なり文字化け

## 解決方法

### Unicode Escape Sequenceの使用

#### 修正前（文字化けする）
```javascript
var symbols = ["□", "◆", "■"];
if (text.indexOf("□") === 0) {
    // 文字化けが発生
}
```

#### 修正後（文字化けしない）
```javascript
var symbols = ["\u25A1", "\u25C6", "\u25A0"];  // □ ◆ ■
if (text.indexOf("\u25A1") === 0) {
    // Unicode Escape Sequenceで確実に動作
}
```

## Unicode文字コード表

### TODO記号のUnicodeコード
| 記号 | 名前 | Unicodeコード | Escape Sequence |
|------|------|---------------|-----------------|
| □ | 白四角 | U+25A1 | `\u25A1` |
| ◆ | 黒ダイヤ | U+25C6 | `\u25C6` |
| ■ | 黒四角 | U+25A0 | `\u25A0` |

### その他のよく使用される記号
| 記号 | 名前 | Unicodeコード | Escape Sequence |
|------|------|---------------|-----------------|
| ○ | 白丸 | U+25CB | `\u25CB` |
| ● | 黒丸 | U+25CF | `\u25CF` |
| △ | 白三角 | U+25B3 | `\u25B3` |
| ▲ | 黒三角 | U+25B2 | `\u25B2` |
| ☆ | 白星 | U+2606 | `\u2606` |
| ★ | 黒星 | U+2605 | `\u2605` |

## 実装例

### 基本的な使用方法
```javascript
// Unicode Escape Sequenceを使用した安全な実装
function getSymbolName(symbol) {
    switch (symbol) {
        case "\u25A1":  // □
            return "未完了";
        case "\u25C6":  // ◆
            return "進行中";
        case "\u25A0":  // ■
            return "完了";
        default:
            return "不明";
    }
}
```

### 動的な記号生成
```javascript
// 記号配列の定義
var TODO_SYMBOLS = {
    PENDING: "\u25A1",    // □ 未完了
    PROGRESS: "\u25C6",   // ◆ 進行中
    COMPLETED: "\u25A0"   // ■ 完了
};

// 使用例
var currentSymbol = TODO_SYMBOLS.PENDING;  // □
```

## 検証方法

### 1. ファイル保存時の確認
```javascript
// テスト用コード（マクロ内に一時的に追加）
Editor.InsText("Test: " + "\u25A1" + "\u25C6" + "\u25A0");
// 実行結果が「Test: □◆■」になることを確認
```

### 2. 文字化けチェック
```javascript
// 各記号の正常表示確認
var symbols = ["\u25A1", "\u25C6", "\u25A0"];
for (var i = 0; i < symbols.length; i++) {
    Editor.InsText("Symbol " + i + ": " + symbols[i] + "\n");
}
```

## 注意事項

### やってはいけないこと
- ❌ 直接文字をコードに記述
- ❌ コピー&ペーストでの文字入力
- ❌ 文字コード混在

### 推奨する方法
- ✅ Unicode Escape Sequenceを使用
- ✅ 定数として文字を定義
- ✅ コメントで文字の意味を明記

## トラブルシューティング

### Q1: 修正後も文字化けする
**A1:** 以下を確認
- Escape Sequenceの記述が正しいか
- ファイルがUTF-8で保存されているか
- サクラエディタの文字コード設定

### Q2: 他の記号も文字化けする
**A2:** 同様にUnicode Escape Sequenceに変更
- Unicode表でコードを確認
- `\uXXXX` 形式で記述

### Q3: 日本語コメントが文字化けする
**A3:** ファイルエンコーディングを確認
- JavaScriptファイルをShift_JISで保存
- または英語コメントのみ使用

## まとめ

Unicode Escape Sequenceを使用することで：
- ✅ 環境に依存しない文字表示
- ✅ 文字化けの完全防止
- ✅ 保守性の向上
- ✅ 安定した動作

この方法により、どのような環境でもTODO記号が正しく表示されます。