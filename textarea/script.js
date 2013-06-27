(function (root, $) {
    "use strict";
    
    var shortcuts;
    
    shortcuts = {
        '000.9': 'indent',      //tab
        '010.9': 'outdent',     //shift+tab
        '000.13': 'newline',    //enter
        '000.36': 'home',       //home
        '010.36': 'selecthome', //shift+home
        '001.66': 'bold',       //ctrl+b
        '001.71': 'image',      //ctrl+g
        '001.73': 'italic',     //ctrl+i
        '001.75': 'code',       //ctrl+k
        '011.75': 'code2',      //ctrl+shift+k
        '001.76': 'link',       //ctrl+l
        '001.79': 'numbered',   //ctrl+o
        '001.81': 'quote',      //ctrl+q
        '001.85': 'bulleted'    //ctrl+u
    };
    
    $('body').on({
        'keydown': function (e) {
            var key;
            key = '' + (+e.altKey) + (+e.shiftKey) + (+e.ctrlKey) + '.' + e.which;
            
            if (shortcuts.hasOwnProperty(key)) {
                $(this).trigger(shortcuts[key]);
                e.preventDefault();
            } else {
                //console.log(key);
            }
        },
        'bold': function () {
            var val,
                sStart,
                sEnd,
                beginning,
                middle,
                end,
                fwd;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            fwd = this.selectionDirection === 'forward';
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
            this.selectionDirection = fwd ? 'forward' : 'backward';
        },
        'italic': function () {
            var val,
                sStart,
                sEnd,
                beginning,
                middle,
                end,
                on,
                fwd;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            fwd = this.selectionDirection === 'forward';
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
            this.selectionDirection = fwd ? 'forward' : 'backward';
        },
        'indent': function () {
            var fwd,
                i,
                val,
                sStart,
                sEnd,
                beginning,
                middle,
                end,
                lineStart,
                delta,
                firstR,
                firstN;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            fwd = this.selectionDirection === 'forward';
            
            lineStart = Math.max(val.lastIndexOf('\r', sStart - 1), val.lastIndexOf('\n', sStart - 1)) + 1;
            
            if (sStart === sEnd) {
                beginning = val.slice(0, sStart);
                middle = val.slice(sStart, sEnd);
                end = val.slice(sEnd);
                
                delta = sStart;
                delta -= lineStart;
                delta %= 4;
                delta = 4 - delta;
                
                for (i = 0; i < delta; i += 1) {
                    beginning += ' ';
                }
                
                sStart += delta;
            } else {
                //move `sStart` to just after last newline in `beginning`
                //if there isn't a newline, move to the beginning
                sStart = lineStart;
                
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
            }
            
            this.value = beginning + middle + end;
            this.selectionStart = sStart;
            this.selectionEnd = sStart + middle.length;
            this.selectionDirection = fwd ? 'forward' : 'backward';
        },
        'outdent': function () {
            var val,
                fwd,
                sStart,
                sEnd,
                beginning,
                middle,
                end,
                lineStart,
                i,
                delta,
                firstR,
                firstN;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            fwd = this.selectionDirection === 'forward';
            
            lineStart = Math.max(val.lastIndexOf('\r', sStart - 1), val.lastIndexOf('\n', sStart - 1)) + 1;
            
            if (sStart === sEnd) {
                beginning = val.slice(0, sStart);
                middle = val.slice(sStart, sEnd);
                end = val.slice(sEnd);
                
                delta = sStart;
                delta -= lineStart;
                delta %= 4;
                delta = delta || 4;
                
                for (i = 0; i < delta && beginning.charCodeAt(beginning.length - 1) === 32; i += 1) {
                    beginning = beginning.slice(0, -1);
                }
                
                sStart -= i;
            } else {
                //move `sStart` to just after last newline in `beginning`
                sStart = lineStart;
                
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
            }
            this.value = beginning + middle + end;
            this.selectionStart = sStart;
            this.selectionEnd = sStart + middle.length;
            this.selectionDirection = fwd ? 'forward' : 'backward';
        },
        'code': function () {
            var val,
                sStart,
                sEnd,
                fwd,
                beginning,
                middle,
                end;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            fwd = this.selectionDirection === 'forward';
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
            this.selectionDirection = fwd ? 'forward' : 'backward';
        },
        'code2': function () {
            var val,
                sStart,
                sEnd,
                fwd,
                beginning,
                middle,
                end;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            fwd = this.selectionDirection === 'forward';
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
            this.selectionDirection = fwd ? 'forward' : 'backward';
        },
        'home': function () {
            var val,
                sStart,
                fwd,
                lineStart,
                textStart;
            
            val = this.value;
            fwd = this.selectionDirection === 'forward';
            sStart = (fwd ? this.selectionEnd : this.selectionStart) || 0;
            
            //find the nearest newline before the cursor
            lineStart = Math.max(val.lastIndexOf('\r', sStart - 1), val.lastIndexOf('\n', sStart - 1)) + 1;
            
            //find the first non-space character (' ' and '\t') after lineStart
            //start at lineStart and add 1 every time the character is still a space or a tab
            for (textStart = lineStart; val.charCodeAt(textStart) === 32 || val.charCodeAt(textStart) === 9; textStart += 1);
            
            this.selectionStart = 
                this.selectionEnd = sStart === textStart ? lineStart : textStart;
        },
        'selecthome': function () {
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
                end,
                url,
                fwd;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            fwd = this.selectionDirection === 'forward';
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
            
            //escape the brackets in the selection
            //if the selection is surrounded as a link or image
            // remove the link/image
            //otherwise
            // ask for URL for new link
            
            url = prompt('Enter a URL');
            if (!url) {
                return;
            }
            
            middle = middle.replace(/[\[\]\\]/g, '\\$&');
            this.value = beginning + '[' + middle + '][1]' + end + '\n  [1]: ' + url;
            this.selectionStart = sStart + 1;
            this.selectionEnd = sStart + 1 + middle.length;
            this.selectionDirection = fwd ? 'forward' : 'backward';
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
        },
        'newline': function () {
            //console.log('newline');
            
            var val,
                sStart,
                sEnd,
                beginning,
                end,
                lineStart,
                lineText,
                newline;
            
            val = this.value;
            sStart = this.selectionStart || 0;
            sEnd = this.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            end = val.slice(sEnd);
            
            //find the nearest newline before the cursor
            lineStart = Math.max(val.lastIndexOf('\r', sStart - 1), val.lastIndexOf('\n', sStart - 1)) + 1;
            
            lineText = val.slice(lineStart, sStart);
            newline = '\n' + lineText.match(/^(?:[*> \t]|\d+\.)*/)[0];
            
            this.value = beginning + newline + end;
            this.selectionStart =
                this.selectionEnd = beginning.length + newline.length;
            this.selectionDirection = 'forward';
        }
    }, 'textarea').on('click', '.button', function (e) {
        $('textarea').trigger($(this).data('event'));
    });
}(this, this.jQuery));