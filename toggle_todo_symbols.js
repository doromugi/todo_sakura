// サクラエディタ TODO記号切り替えマクロ
// ショートカットキーで □ → ◆ → ■ → □ の循環切り替えを行う

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
    
    if (contentAfterIndent.indexOf("□") === 0) {
        currentSymbol = "□";
        remainingText = contentAfterIndent.substring(1);
    } else if (contentAfterIndent.indexOf("◆") === 0) {
        currentSymbol = "◆";
        remainingText = contentAfterIndent.substring(1);
    } else if (contentAfterIndent.indexOf("■") === 0) {
        currentSymbol = "■";
        remainingText = contentAfterIndent.substring(1);
    }
    
    // 次の記号を決定
    var nextSymbol = getNextSymbol(currentSymbol);
    
    // 新しい行の内容を構築
    var newLineText = indentPart + nextSymbol + remainingText;
    
    // 現在の行を新しい内容で置換
    Editor.GoLineTop(0);          // 行頭に移動
    Editor.SelectLine();          // 行全体を選択
    Editor.InsText(newLineText);  // 選択範囲を置換
}

// 記号状態判定ロジック：次の記号を決定する
function getNextSymbol(currentSymbol) {
    switch (currentSymbol) {
        case "□":
            return "◆";
        case "◆":
            return "■";
        case "■":
            return "□";
        default:
            // 記号がない場合は□を追加
            return "□";
    }
}

// マクロのエントリーポイント
main();