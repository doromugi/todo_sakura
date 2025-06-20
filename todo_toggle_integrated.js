// サクラエディタ TODO記号切り替えマクロ（統合版）
// ショートカットキーで □ → ◆ → ■ → □ の循環切り替えを行う

/**
 * インデント処理クラス
 */
function IndentProcessor() {
    // インデント文字の正規表現パターン（全角スペースは\u3000で統一）
    this.INDENT_PATTERN = /^([\t \u3000]*)/;
    
    // 各インデント文字
    this.TAB_CHAR = '\t';           // タブ文字
    this.HALF_SPACE = ' ';          // 半角スペース
    this.FULL_SPACE = '\u3000';     // 全角スペース
}

/**
 * 行からインデント部分とテキスト部分を分離する
 * @param {string} line - 処理対象の行
 * @return {object} {indent: string, text: string}
 */
IndentProcessor.prototype.parseIndent = function(line) {
    if (typeof line !== 'string') {
        return { indent: '', text: '' };
    }
    
    var match = line.match(this.INDENT_PATTERN);
    var indent = match ? match[1] : '';
    var text = line.substring(indent.length);
    
    return {
        indent: indent,
        text: text
    };
};

/**
 * インデントを保持しつつテキスト部分を置換する
 * @param {string} originalLine - 元の行
 * @param {string} newText - 新しいテキスト部分
 * @return {string} 新しい行
 */
IndentProcessor.prototype.replaceText = function(originalLine, newText) {
    var parsed = this.parseIndent(originalLine);
    return parsed.indent + newText;
};

// インデント処理インスタンスを作成
var indentProcessor = new IndentProcessor();

/**
 * 現在の記号状態を判定する
 * @param {string} text - テキスト部分
 * @return {object} {symbol: string, remainingText: string}
 */
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

/**
 * 記号状態判定ロジック：次の記号を決定する
 * @param {string} currentSymbol - 現在の記号
 * @return {string} 次の記号
 */
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

/**
 * メイン処理
 */
function main() {
    // 現在の行を取得
    var currentLineText = Editor.GetLineStr(0);
    
    // インデント処理モジュールを使用してインデントとテキストを分離
    var parsed = indentProcessor.parseIndent(currentLineText);
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
    Editor.SetLineStr(0, newLineText);
}

// マクロのエントリーポイント
main();