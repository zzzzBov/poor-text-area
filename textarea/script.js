(function (root, $) {
    "use strict";
    
    var shortcuts;
    
    shortcuts = {
        '000.9': 'indent',
        '010.9': 'outdent',
        '000.36': 'home',
        '010.36': 'selecthome',
        '001.66': 'bold',
        '001.71': 'image',
        '001.73': 'italic',
        '001.75': 'code',
        '011.75': 'code2',
        '001.76': 'link',
        '001.79': 'numbered',
        '001.81': 'quote',
        '001.85': 'bulleted'
    };
    
    $('body').on({
        'keydown': function (e) {
            var key;
            key = '' + (+e.altKey) + (+e.shiftKey) + (+e.ctrlKey) + '.' + e.which;
            
            if (shortcuts.hasOwnProperty(key)) {
                $('textarea').trigger(shortcuts[key]);
                e.preventDefault();
            } else {
                //console.log(e.which);
            }
        },
        'bold': function () {
            //console.log('bold');
            
            var val,
                sStart,
                sEnd,
                beginning,
                middle,
                end;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
            
            if (//`beginning` ends with '**' and `end` starts with '**'
                /\*\*$/.test(beginning) &&
                /^\*\*/.test(end)) {
                //toggle bold off
                this.value = beginning.slice(0, -2) + middle + end.slice(2);
                this.selectionStart = sStart - 2;
                this.selectionEnd = sEnd - 2;
            } else {
                //toggle bold on
                this.value = beginning + '**' + middle + '**' + end;
                this.selectionStart = sStart + 2;
                this.selectionEnd = sEnd + 2;
            }
        },
        'italic': function () {
            //console.log('italic');
            
            var val,
                sStart,
                sEnd,
                beginning,
                middle,
                end,
                on;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
            
            if (//`beginning` ends with '***' and `end` starts with '***'
                /\*\*\*$/.test(beginning) &&
                /^\*\*\*/.test(end)) {
                on = false;
            } else if (//`beginning` ends with '**' and `end` starts with '**'
                /\*\*$/.test(beginning) &&
                /^\*\*/.test(end)) {
                on = true;
            } else if (//`beginning` ends with '*' and `end` starts with '*'
                /\*$/.test(beginning) &&
                /^\*/.test(end)) {
                on = false;
            } else {
                on = true;
            }
            
            if (on) {
                this.value = beginning + '*' + middle + '*' + end;
                this.selectionStart = sStart + 1;
                this.selectionEnd = sEnd + 1;
            } else {
                this.value = beginning.slice(0, -1) + middle + end.slice(1);
                this.selectionStart = sStart - 1;
                this.selectionEnd = sEnd - 1;
            }
        },
        'indent': function () {
            //console.log('indent');
            
            ///NEED TO FIX FOR WHEN NO TEXT IS SELECTED
            
            var val,
                sStart,
                sEnd,
                beginning,
                middle,
                end,
                firstR,
                firstN;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            
            //move `sStart` to just after last newline in `beginning`
            //if there isn't a newline, move to the beginning
            sStart = Math.max(val.lastIndexOf('\r', sStart - 1), val.lastIndexOf('\n', sStart - 1)) + 1;
            
            //move `sEnd` to just before first newline in `end`
            //if there isn't a newline, move to the end
            firstR = val.indexOf('\r', sEnd);
            firstN = val.indexOf('\n', sEnd);
            if (firstR < 0) {
                firstR = Number.POSITIVE_INFINITY;
            }
            if (firstN < 0) {
                firstN = Number.POSITIVE_INFINITY;
            }
            sEnd = Math.min(firstR, firstN, val.length);
            
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
            
            //add 4 spaces after all newlines in `middle`
            middle = middle.replace(/^|\r\n?|\n/g, '$&    ');
            
            this.value = beginning + middle + end;
            this.selectionStart = sStart;
            this.selectionEnd = sStart + middle.length;
        },
        'outdent': function () {
            //console.log('outdent');
            
            ///NEED TO FIX FOR WHEN NO TEXT IS SELECTED
            
            var val,
                sStart,
                sEnd,
                beginning,
                middle,
                end,
                firstR,
                firstN;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            
            //move `sStart` to just after last newline in `beginning`
            sStart = Math.max(val.lastIndexOf('\r', sStart - 1), val.lastIndexOf('\n', sStart - 1)) + 1;
            
            //move `sEnd` to just before first newline in `end`
            //if there isn't a newline, move to the end
            firstR = val.indexOf('\r', sEnd);
            firstN = val.indexOf('\n', sEnd);
            if (firstR < 0) {
                firstR = Number.POSITIVE_INFINITY;
            }
            if (firstN < 0) {
                firstN = Number.POSITIVE_INFINITY;
            }
            sEnd = Math.min(firstR, firstN, val.length);
            
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
            
            //remove up to 4 spaces, or a single tab, after all newlines in `middle`
            middle = middle.replace(/(^|\r\n?|\n)(?: {1,4}|\t)/g, '$1');
            
            this.value = beginning + middle + end;
            this.selectionStart = sStart;
            this.selectionEnd = sStart + middle.length;
        },
        'code': function () {
            //console.log('code');
            
            var val,
                sStart,
                sEnd,
                beginning,
                middle,
                end;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
            
            if (//`beginning` ends with '`' and `end` starts with '`'
                /`$/.test(beginning) &&
                /^`/.test(end)) {
                this.value = beginning.slice(0, -1) + middle + end.slice(1);
                this.selectionStart = sStart - 1;
                this.selectionEnd = sEnd - 1;
            } else {
                this.value = beginning + '`' + middle + '`' + end;
                this.selectionStart = sStart + 1;
                this.selectionEnd = sEnd + 1;
            }
        },
        'code2': function () {
            //console.log('code2');
            
            var val,
                sStart,
                sEnd,
                beginning,
                middle,
                end;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
            
            if (//`beginning` ends with '``' and `end` starts with '``'
                /``$/.test(beginning) &&
                /^``/.test(end)) {
                this.value = beginning.slice(0, -2) + middle + end.slice(2);
                this.selectionStart = sStart - 2;
                this.selectionEnd = sEnd - 2;
            } else if (//`beginning` ends with '`' and `end` starts with '`'
                /`$/.test(beginning) &&
                /^`/.test(end)) {
                this.value = beginning + '`' + middle + '`' + end;
                this.selectionStart = sStart + 1;
                this.selectionEnd = sEnd + 1;
            } else {
                this.value = beginning + '``' + middle + '``' + end;
                this.selectionStart = sStart + 2;
                this.selectionEnd = sEnd + 2;
            }
        },
        'home': function () {
            //console.log('home');
            
            var val,
                sStart,
                lineStart,
                textStart;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            
            //find the nearest newline before the cursor
            lineStart = Math.max(val.lastIndexOf('\r', sStart - 1), val.lastIndexOf('\n', sStart - 1)) + 1;
            
            //find the first non-space character (' ' and '\t') after lineStart
            //start at lineStart and add 1 every time the character is still a space or a tab
            for (textStart = lineStart; val.charCodeAt(textStart) === 32 || val.charCodeAt(textStart) === 9; textStart += 1);
            
            this.selectionStart = 
                this.selectionEnd = sStart === textStart ? lineStart : textStart;
        },
        'selecthome': function () {
            //console.log('select home');
            
            var val,
                sStart,
                sEnd,
                head,
                tail,
                lineStart,
                textStart,
                fwd;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            fwd = this.selectionDirection === 'forward';
            
            head = fwd ? sEnd : sStart;
            tail = fwd ? sStart : sEnd;
            
            //find the nearest newline before the cursor
            lineStart = Math.max(val.lastIndexOf('\r', head - 1), val.lastIndexOf('\n', head - 1)) + 1;
            
            //find the first non-space character (' ' and '\t') after lineStart
            //start at lineStart and add 1 every time the character is still a space or a tab
            for (textStart = lineStart; val.charCodeAt(textStart) === 32 || val.charCodeAt(textStart) === 9; textStart += 1);
            
            //move the head to the textStart unless it already is, in which case move it to the lineStart
            head = head === textStart ? lineStart : textStart;
            
            if (head < tail) {
                this.selectionStart = head;
                this.selectionEnd = tail;
                this.selectionDirection = 'backward';
            } else {
                this.selectionStart = tail;
                this.selectionEnd = head;
                this.selectionDirection = 'forward';
            }
        },
        'link': function () {
            console.log('link');
            
            var val,
                sStart,
                sEnd,
                beginning,
                middle,
                end;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
        },
        'image': function () {
            console.log('image');
            
            var val,
                sStart,
                sEnd,
                beginning,
                middle,
                end;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
        },
        'quote': function () {
            console.log('quote');
            
            var val,
                sStart,
                sEnd,
                beginning,
                middle,
                end;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
        },
        'bulleted': function () {
            console.log('bulleted list');
            
            var val,
                sStart,
                sEnd,
                beginning,
                middle,
                end;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
        },
        'numbered': function () {
            console.log('numbered list');
            
            var val,
                sStart,
                sEnd,
                beginning,
                middle,
                end;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
        }
    }, 'textarea').on('click', '.button', function (e) {
        $('textarea').trigger($(this).data('event'));
    });
}(this, this.jQuery));