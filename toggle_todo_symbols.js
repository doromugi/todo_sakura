// サクラエディタ TODO記号切り替えマクロ
// ショートカットキーで □ → ◆ → ■ → □ の循環切り替えを行う
// Unicode文字（\u25A1 \u25C6 \u25A0）を使用して文字化けを防止

function main() {
    // 現在の行を取得
    var currentLineText = Editor.GetLineStr(0);
    
    // 行頭のインデント部分を取得（tab、半角スペース、全角スペース）
    var indentMatch = currentLineText.match(/^([\t 　]*)/);
    var indentPart = indentMatch ? indentMatch[1] : "";
    
    // インデント後の内容を取得
    var contentAfterIndent = currentLineText.substring(indentPart.length);
    
    // 現在の記号状態を判定
    var currentSymbol = "";
    var remainingText = contentAfterIndent;
    
    if (contentAfterIndent.indexOf("\u25A1") === 0) {  // □ 白四角
        currentSymbol = "\u25A1";
        remainingText = contentAfterIndent.substring(1);
    } else if (contentAfterIndent.indexOf("\u25C6") === 0) {  // ◆ 黒ダイヤ
        currentSymbol = "\u25C6";
        remainingText = contentAfterIndent.substring(1);
    } else if (contentAfterIndent.indexOf("\u25A0") === 0) {  // ■ 黒四角
        currentSymbol = "\u25A0";
        remainingText = contentAfterIndent.substring(1);
    }
    
    // 次の記号を決定
    var nextSymbol = getNextSymbol(currentSymbol);
    
    // 新しい行の内容を構築
    var newLineText = indentPart + nextSymbol + remainingText;
    
    // 現在の行を新しい内容で置換（絶対位置でカーソル位置を確実に保持）
    var currentLine = Editor.GetLineCount(1);     // 現在行番号を記憶
    var currentCol = Editor.GetSelectColumnFrom(); // 現在列位置を記憶
    
    Editor.GoLineTop(0);          // 行頭に移動
    Editor.SelectLine();          // 行全体を選択
    Editor.Delete();              // 選択行を削除
    Editor.InsText(newLineText);  // 新しい内容を挿入
    
    Editor.Jump(currentLine, 1);  // 絶対位置で行頭に確実に復元
}

// 記号状態判定ロジック：次の記号を決定する
function getNextSymbol(currentSymbol) {
    switch (currentSymbol) {
        case "\u25A1":  // □ 白四角
            return "\u25C6";  // ◆ 黒ダイヤ
        case "\u25C6":  // ◆ 黒ダイヤ
            return "\u25A0";  // ■ 黒四角
        case "\u25A0":  // ■ 黒四角
            return "\u25A1";  // □ 白四角
        default:
            // 記号がない場合は□を追加
            return "\u25A1";  // □ 白四角
    }
}

// マクロのエントリーポイント
main();