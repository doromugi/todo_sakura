// サクラエディタ TODO記号切り替えマクロ（統合版）
// ショートカットキーで □ → ◆ → ■ → □ の循環切り替えを行う
// Unicode文字（\u25A1 \u25C6 \u25A0）を使用して文字化けを防止

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
    var symbols = ["\u25A1", "\u25C6", "\u25A0"];  // □ ◆ ■
    
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
    
    // 現在の行を新しい内容で置換（絶対位置でカーソル位置を確実に保持）
    var currentLine = Editor.GetLineCount(1);     // 現在行番号を記憶
    var currentCol = Editor.GetSelectColumnFrom(); // 現在列位置を記憶
    
    Editor.GoLineTop(0);          // 行頭に移動
    Editor.SelectLine();          // 行全体を選択
    Editor.Delete();              // 選択行を削除
    Editor.InsText(newLineText);  // 新しい内容を挿入
    
    Editor.Jump(currentLine, 1);  // 絶対位置で行頭に確実に復元
}

// マクロのエントリーポイント
main();