import { Editor } from "codemirror";
import CodeMirror = require("codemirror");
import key from 'keymaster';

module.exports = {
	default: function(_context: any) {

        function movePosition(position: CodeMirror.Position, offset: number): CodeMirror.Position {
            return { line: position.line, ch: position.ch + offset };
        }

        const plugin = function(CodeMirror) {
            CodeMirror.defineExtension('highlight', function() {
                const cm: Editor = this;
                const cursorFrom = cm.getCursor("from");
                const cursorTo = cm.getCursor("to");

                var selectedText = cm.getSelection();
                var surroundText = cm.getRange(movePosition(cursorFrom, -2), movePosition(cursorTo, 2))
                if (selectedText.startsWith("==") && selectedText.endsWith("==")) {
                    cm.replaceRange(selectedText.substring(2, selectedText.length - 2), cursorFrom, cursorTo);
                } else if (surroundText.startsWith("==") && surroundText.endsWith("==")) {
                    cm.replaceRange(selectedText, movePosition(cursorFrom, -2), movePosition(cursorTo, 2));
                } else {
                    var headOffset = /^(\s*)/.exec(selectedText)[1].length;
                    var tailOffset = /(\s*)$/.exec(selectedText)[1].length;
                    cm.replaceRange("==" + selectedText.trim() + "==", movePosition(cursorFrom, headOffset), movePosition(cursorTo, -tailOffset));
                }
                cm.focus();
                cm.refresh();
            });
        }

        const addHotkey = function(CodeMirror) {
            key('ctrl+h', () => {
                const cm = CodeMirror.getInstance();
                if (cm) {
                    cm.highlight();
                }
            });
        }

        return {
            plugin: plugin,
            addHotkey: addHotkey
        }
    }
}

// Ensure the hotkey is added
const CodeMirror = require('codemirror');
const { addHotkey } = require('./highlighter');
addHotkey(CodeMirror);
