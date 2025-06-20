/**
 * サクラエディタ インデント処理モジュール
 * 行頭のインデント（tab、半角スペース、全角スペース）を検出・処理する
 */

/**
 * インデント処理クラス
 */
function IndentProcessor() {
    // インデント文字の正規表現パターン
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
 * インデントの種類を判定する
 * @param {string} indent - インデント文字列
 * @return {object} {hasTab: boolean, hasHalfSpace: boolean, hasFullSpace: boolean}
 */
IndentProcessor.prototype.analyzeIndent = function(indent) {
    return {
        hasTab: indent.indexOf(this.TAB_CHAR) !== -1,
        hasHalfSpace: indent.indexOf(this.HALF_SPACE) !== -1,
        hasFullSpace: indent.indexOf(this.FULL_SPACE) !== -1,
        length: indent.length
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

/**
 * インデント処理のテスト関数
 */
IndentProcessor.prototype.test = function() {
    var testCases = [
        '',
        'テスト',
        '\tテスト',
        '  テスト',
        '\u3000\u3000テスト',
        '\t  \u3000テスト',
        '\t\t  \u3000\u3000テスト行'
    ];
    
    var results = [];
    for (var i = 0; i < testCases.length; i++) {
        var line = testCases[i];
        var parsed = this.parseIndent(line);
        var analysis = this.analyzeIndent(parsed.indent);
        var replaced = this.replaceText(line, '□' + parsed.text);
        
        results.push({
            original: line,
            indent: parsed.indent,
            text: parsed.text,
            analysis: analysis,
            replaced: replaced
        });
    }
    
    return results;
};

// サクラエディタマクロ用のグローバル関数として公開
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IndentProcessor;
} else {
    // サクラエディタ環境用
    var indentProcessor = new IndentProcessor();
}