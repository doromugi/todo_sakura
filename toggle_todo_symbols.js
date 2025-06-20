// サクラエディタ TODO記号切り替えマクロ
// ショートカットキーで □ → ◆ → ■ → □ の循環切り替えを行う
// 
// 使用方法:
// 1. indent-processor.js と toggle_todo_symbols.js を同じフォルダに配置
// 2. サクラエディタで indent-processor.js を先に実行してモジュールを読み込み
// 3. toggle_todo_symbols.js を実行してTODO記号を切り替え

// IndentProcessorモジュールの存在確認と初期化
if (typeof IndentProcessor === 'undefined') {
    throw new Error('IndentProcessor module not found. Please load indent-processor.js first.');
}
var indentProcessor = new IndentProcessor();

function main() {
    // 現在の行を取得
    var currentLineText = Editor.GetLineStr(0);
    
    // インデント処理モジュールを使用してインデントとテキストを分離
    var parsed = indentProcessor.parseIndent(currentLineText);
    var indentPart = parsed.indent;
    var contentAfterIndent = parsed.text;
    
    // 現在の記号状態を判定
    var symbolInfo = detectCurrentSymbol(contentAfterIndent);
    
    // 次の記号を決定
    var nextSymbol = getNextSymbol(symbolInfo.symbol);
    
    // 新しいテキスト部分を構築
    var newText = nextSymbol + symbolInfo.remainingText;
    
    // インデント処理モジュールを使用して新しい行を構築
    var newLineText = indentProcessor.replaceText(currentLineText, newText);
    
    // 現在の行を新しい内容で置換
    Editor.SetLineStr(newLineText, 0);
}

// 現在の記号状態を判定する
function detectCurrentSymbol(text) {
    var symbols = ["□", "◆", "■"];
    
    for (var i = 0; i < symbols.length; i++) {
        var symbol = symbols[i];
        if (text.indexOf(symbol) === 0) {
            return {
                symbol: symbol,
                remainingText: text.substring(symbol.length)
            };
        }
    }
    
    // 記号が見つからない場合
    return {
        symbol: "",
        remainingText: text
    };
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