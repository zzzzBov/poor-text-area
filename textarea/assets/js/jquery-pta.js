/**
 * jquery-pta.js
 * 
 * Generated using jQuery Widget Template
 * Copyright (c) zzzzBov 2012
 */
(function ($, widget) {
    "use strict";
    function Control(type) {
        this['class'] = 'poor-text-area__control-bar__control--' + type,
        this.contents = '<img src="assets/images/icons/' + type + '.png" alt="' + type + '" width="20" height="20" />';
        this.event = type;
    }
    
    function Info(type, label, value) {
        this['class'] = 'poor-text-area__info-bar__info--' + type;
        this.labelClass = 'poor-text-area__info-bar__info--' + type + '__label';
        this.valueClass = 'poor-text-area__info-bar__info--' + type + '__value';
        this.info = type;
        this.label = label;
        this.value = value;
    }
    
    $[widget] = function (element, opts) {
        if (!(this instanceof $[widget])) {
            return new $[widget](element, opts);
        }
        this._element = element;
        this._options = opts;
        
        element.wrap('<span>').on('keydown', $.proxy(this, '_keydownHandler'));
        this._pta = $(element.parent()).on('click keydown', '[data-event]', $.proxy(this, '_controlBarClickHandler'));
        
        this._controlBar = $('<span>').insertBefore(this._element);
        this._statusBar = $('<span>').insertAfter(this._element);
        this._infoBar = $('<span>').insertAfter(this._element);
    };
    $[widget].prototype = {
        _options: {
            'classes': {
                wrapper: 'poor-text-area',
                controlBar: 'poor-text-area__control-bar',
                controlBarControl: 'poor-text-area__control-bar__control',
                controlBarFirstControl: 'poor-text-area__control-bar__control--first',
                controlBarLastControl: 'poor-text-area__control-bar__control--last',
                infoBar: 'poor-text-area__info-bar',
                infoBarInfo: 'poor-text-area__info-bar__info',
                infoBarInfoLabel: 'poor-text-area__info-bar__info__label',
                infoBarInfoValue: 'poor-text-area__info-bar__info__value',
                statusBar: 'poor-text-area__status-bar'
            },
            'controls': [
                new Control('bold'),
                new Control('italic'),
                new Control('outdent'),
                new Control('indent'),
                new Control('code'),
                new Control('quote'),
                new Control('bulleted'),
                new Control('numbered'),
                new Control('link'),
                new Control('image')
            ],
            'info': [
                new Info('length', 'len:', 0),
                new Info('line', 'ln:', 1),
                new Info('column', 'col:', 1)
            ],
            'keys': {
                '000.9':    'indent',       //tab
                '010.9':    'outdent',      //shift+tab
                '000.13':   'newline',      //enter
                '000.36':   'home',         //home
                '010.36':   'selecthome',   //shift+home
                '001.66':   'bold',         //ctrl+b
                '001.71':   'image',        //ctrl+g
                '001.73':   'italic',       //ctrl+i
                '001.75':   'code',         //ctrl+k
                '011.75':   'code2',        //ctrl+shift+k
                '001.76':   'link',         //ctrl+l
                '001.77':   'tabtoggle',    //ctrl+m       ref: http://www.w3.org/TR/wai-aria-practices/#richtext
                '001.79':   'numbered',     //ctrl+o
                '001.81':   'quote',        //ctrl+q
                '001.85':   'bulleted',     //ctrl+u
                '000.122':  'fullscreen'    //F11
            }
        },
        _init: function () {
            var options,
                $controlBar,
                $statusBar,
                $infoBar,
                $len,
                $lin,
                $col;
            
            options = this._options;
            
            this._pta.attr('class', '').addClass(options.classes.wrapper);
            $controlBar = this._controlBar.attr('class', '').addClass(options.classes.controlBar).empty();
            $statusBar = this._statusBar.attr('class', '').addClass(options.classes.statusBar).empty();
            $infoBar = this._infoBar.attr('class', '').addClass(options.classes.infoBar).empty();
            
            $.each(options.controls, function (i) {
                var $ctrl,
                    first,
                    last;
                
                first = !i;
                last = (i + 1) === options.controls.length;
                
                $ctrl = $('<span>').attr({
                    'class': this['class'],
                    'data-event': this.event,
                    'role': 'button',
                    'tabindex': 0
                }).addClass(options.classes.controlBarControl)
                    .toggleClass(options.classes.controlBarFirstControl, first)
                    .toggleClass(options.classes.controlBarLastControl, last);
                $ctrl.append(this.contents).appendTo($controlBar);
            });
            
            $.each(options.info, function (i) {
                var $info,
                    $label,
                    $value;
                
                $info = $('<span>').addClass(options.classes.infoBarInfo).addClass(this['class']);
                $label = $('<span>').addClass(options.classes.infoBarInfoLabel).addClass(this.labelClass).text(this.label);
                $value = $('<span>').addClass(options.classes.infoBarInfoValue).addClass(this.valueClass).text(this.value).attr('data-info', this.info);
                $info.append($label).append($value).appendTo($infoBar);
            });
        },
        destroy: function () {
            this._controlBar.remove();
            this._statusBar.remove();
            this._infoBar.remove();
            this._element.unwrap();
        },
        _setOption: function (name, value) {
            //custom mutator code here
            this._options[name] = value;
        },
        _getOption: function (name) {
            //custom accessor code here
            return this._options[name];
        },
        option: function (name, value) {
            switch (arguments.length) {
            case 0:
                throw new Error('"option" must be called with at least one parameter.');
            case 1:
                return this._getOption(name);
            default:
                this._setOption(name, value);
            }
        },
        options: function (map) {
            var i;
            if (!arguments.length) {
                throw new Error('"options" must be called with at least one parameter.');
            }
            map = Object(map);
            for (i in map) {
                this._setOption(i, map[i]);
            }
        },
        _controlBarClickHandler: function (e) {
            var event;
            if (e.type !== 'click' && e.which !== 13 && e.which !== 32) {
                return;
            }
            
            event = $(e.currentTarget).data('event');
            if ($.isFunction(this[event])) {
                this[event]();
            }
        },
        _keydownHandler: function (e) {
            var key;
            key = '' + (+e.altKey) + (+e.shiftKey) + (+e.ctrlKey) + '.' + e.which;
            
            if (this._options.keys.hasOwnProperty(key) && $.isFunction(this[this._options.keys[key]])) {
                this[this._options.keys[key]]();
                e.preventDefault();
            }
        },
        bold: function () {
            //trigger the 'ptabold' event, if successful, embolden the text
            var event,
                elem,
                val,
                sStart,
                sEnd,
                beginning,
                middle,
                end,
                fwd;
            
            event = $.Event('ptabold');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            sStart = elem.selectionStart || 0;
            sEnd = elem.selectionEnd || 0;
            fwd = elem.selectionDirection === 'forward';
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
            
            if (//`beginning` ends with '**' and `end` starts with '**'
                /\*\*$/.test(beginning) &&
                /^\*\*/.test(end)) {
                //toggle bold off
                elem.value = beginning.slice(0, -2) + middle + end.slice(2);
                elem.selectionStart = sStart - 2;
                elem.selectionEnd = sEnd - 2;
            } else {
                //toggle bold on
                elem.value = beginning + '**' + middle + '**' + end;
                elem.selectionStart = sStart + 2;
                elem.selectionEnd = sEnd + 2;
            }
            elem.selectionDirection = fwd ? 'forward' : 'backward';
        },
        italic: function () {
            //trigger the 'ptaitalic' event, if successful, italicize the text
            var event,
                elem,
                val,
                sStart,
                sEnd,
                beginning,
                middle,
                end,
                on,
                fwd;
            event = $.Event('ptaitalic');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            sStart = elem.selectionStart || 0;
            sEnd = elem.selectionEnd || 0;
            fwd = elem.selectionDirection === 'forward';
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
                elem.value = beginning + '*' + middle + '*' + end;
                elem.selectionStart = sStart + 1;
                elem.selectionEnd = sEnd + 1;
            } else {
                elem.value = beginning.slice(0, -1) + middle + end.slice(1);
                elem.selectionStart = sStart - 1;
                elem.selectionEnd = sEnd - 1;
            }
            elem.selectionDirection = fwd ? 'forward' : 'backward';
        },
        outdent: function () {
            var event,
                elem,
                val,
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
            event = $.Event('ptaoutdent');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            sStart = elem.selectionStart || 0;
            sEnd = elem.selectionEnd || 0;
            fwd = elem.selectionDirection === 'forward';
            
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
            elem.value = beginning + middle + end;
            elem.selectionStart = sStart;
            elem.selectionEnd = sStart + middle.length;
            elem.selectionDirection = fwd ? 'forward' : 'backward';
        },
        indent: function () {
            var event,
                elem,
                fwd,
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
            
            event = $.Event('ptaindent');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            sStart = elem.selectionStart || 0;
            sEnd = elem.selectionEnd || 0;
            fwd = elem.selectionDirection === 'forward';
            
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
            
            elem.value = beginning + middle + end;
            elem.selectionStart = sStart;
            elem.selectionEnd = sStart + middle.length;
            elem.selectionDirection = fwd ? 'forward' : 'backward';
        },
        code: function () {
            var val,
                event,
                elem,
                sStart,
                sEnd,
                fwd,
                beginning,
                middle,
                end;
            
            event = $.Event('ptacode');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            sStart = elem.selectionStart || 0;
            sEnd = elem.selectionEnd || 0;
            fwd = elem.selectionDirection === 'forward';
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
            
            if (//`beginning` ends with '`' and `end` starts with '`'
                /`$/.test(beginning) &&
                /^`/.test(end)) {
                elem.value = beginning.slice(0, -1) + middle + end.slice(1);
                elem.selectionStart = sStart - 1;
                elem.selectionEnd = sEnd - 1;
            } else {
                elem.value = beginning + '`' + middle + '`' + end;
                elem.selectionStart = sStart + 1;
                elem.selectionEnd = sEnd + 1;
            }
            elem.selectionDirection = fwd ? 'forward' : 'backward';
        },
        code2: function () {
            var event,
                elem,
                val,
                sStart,
                sEnd,
                fwd,
                beginning,
                middle,
                end;
            
            event = $.Event('ptacode2');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            sStart = elem.selectionStart || 0;
            sEnd = elem.selectionEnd || 0;
            fwd = elem.selectionDirection === 'forward';
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
            
            if (//`beginning` ends with '``' and `end` starts with '``'
                /``$/.test(beginning) &&
                /^``/.test(end)) {
                elem.value = beginning.slice(0, -2) + middle + end.slice(2);
                elem.selectionStart = sStart - 2;
                elem.selectionEnd = sEnd - 2;
            } else if (//`beginning` ends with '`' and `end` starts with '`'
                /`$/.test(beginning) &&
                /^`/.test(end)) {
                elem.value = beginning + '`' + middle + '`' + end;
                elem.selectionStart = sStart + 1;
                elem.selectionEnd = sEnd + 1;
            } else {
                elem.value = beginning + '``' + middle + '``' + end;
                elem.selectionStart = sStart + 2;
                elem.selectionEnd = sEnd + 2;
            }
            elem.selectionDirection = fwd ? 'forward' : 'backward';
        },
        quote: function () {
            var event,
                elem,
                val,
                sStart,
                sEnd,
                beginning,
                middle,
                end;
            event = $.Event('ptaquote');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            sStart = elem.selectionStart || 0;
            sEnd = elem.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
        },
        bulleted: function () {
            var event,
                elem,
                val,
                sStart,
                sEnd,
                beginning,
                middle,
                end;
            event = $.Event('ptabulleted');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            sStart = elem.selectionStart || 0;
            sEnd = elem.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
        },
        numbered: function () {
            var event,
                elem,
                val,
                sStart,
                sEnd,
                beginning,
                middle,
                end;
            event = $.Event('ptanumbered');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            sStart = elem.selectionStart || 0;
            sEnd = elem.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
        },
        link: function () {
            var event,
                elem,
                i,
                val,
                sStart,
                sEnd,
                beginning,
                middle,
                end,
                url,
                fwd;
            event = $.Event('ptalink');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            sStart = elem.selectionStart || 0;
            sEnd = elem.selectionEnd || 0;
            fwd = elem.selectionDirection === 'forward';
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
            
            if (/\[$/.test(beginning) && /^\]\[[^\]]+\]/.test(end)) {
                //if the selection is surrounded as a link or image
                //remove the link/image
                
                beginning = beginning.replace(/!?\[$/, '');
                end = end.replace(/^\]\[[^\]]+\]/, '');
                elem.value = beginning + middle + end;
                elem.selectionStart = beginning.length;
                elem.selectionEnd = beginning.length + middle.length;
                elem.selectionDirection = fwd ? 'forward' : 'backward';
            } else {
                //otherwise
                //ask for URL for new link
                
                url = prompt('Enter a URL');
                if (!url) {
                    return;
                }
                //find the first unused numeric key starting at 1
                for (i = 1; ~val.indexOf('[' + i + ']'); i += 1);
                
                //escape the brackets in the selection
                middle = middle.replace(/[\[\]\\]/g, '\\$&');
                elem.value = beginning + '[' + middle + '][' + i + ']' + end + '\n  [' + i + ']: ' + url;
                elem.selectionStart = sStart + 1;
                elem.selectionEnd = sStart + 1 + middle.length;
                elem.selectionDirection = fwd ? 'forward' : 'backward';
            }
        },
        image: function () {
            var event,
                elem,
                val,
                sStart,
                sEnd,
                beginning,
                middle,
                end;
            
            event = $.Event('ptaimage');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            sStart = elem.selectionStart || 0;
            sEnd = elem.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            middle = val.slice(sStart, sEnd);
            end = val.slice(sEnd);
        },
        newline: function () {
            var event,
                elem,
                val,
                sStart,
                sEnd,
                beginning,
                end,
                lineStart,
                lineText,
                newline;
            
            event = $.Event('ptanewline');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            sStart = elem.selectionStart || 0;
            sEnd = elem.selectionEnd || 0;
            beginning = val.slice(0, sStart);
            end = val.slice(sEnd);
            
            //find the nearest newline before the cursor
            lineStart = Math.max(val.lastIndexOf('\r', sStart - 1), val.lastIndexOf('\n', sStart - 1)) + 1;
            
            lineText = val.slice(lineStart, sStart);
            newline = '\n' + lineText.match(/^(?:[*> \t]|\d+\.)*/)[0];
            
            elem.value = beginning + newline + end;
            elem.selectionStart =
                elem.selectionEnd = beginning.length + newline.length;
            elem.selectionDirection = 'forward';
        },
        home: function () {
            var event,
                elem,
                val,
                sStart,
                fwd,
                lineStart,
                textStart;
            event = $.Event('ptahome');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            fwd = elem.selectionDirection === 'forward';
            sStart = (fwd ? elem.selectionEnd : elem.selectionStart) || 0;
            
            //find the nearest newline before the cursor
            lineStart = Math.max(val.lastIndexOf('\r', sStart - 1), val.lastIndexOf('\n', sStart - 1)) + 1;
            
            //find the first non-space character (' ' and '\t') after lineStart
            //start at lineStart and add 1 every time the character is still a space or a tab
            for (textStart = lineStart; val.charCodeAt(textStart) === 32 || val.charCodeAt(textStart) === 9; textStart += 1);
            
            elem.selectionStart = 
                elem.selectionEnd = sStart === textStart ? lineStart : textStart;
        },
        selecthome: function () {
            var event,
                elem,
                val,
                sStart,
                sEnd,
                head,
                tail,
                lineStart,
                textStart,
                fwd;
            event = $.Event('ptaselecthome');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            elem = this._element.get(0);
            val = elem.value;
            sStart = elem.selectionStart || 0;
            sEnd = elem.selectionEnd || 0;
            fwd = elem.selectionDirection === 'forward';
            
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
                elem.selectionStart = head;
                elem.selectionEnd = tail;
                elem.selectionDirection = 'backward';
            } else {
                elem.selectionStart = tail;
                elem.selectionEnd = head;
                elem.selectionDirection = 'forward';
            }
        },
        tabtoggle: function () {
            var event;
            event = $.Event('ptatabtoggle');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            /*
            if (shortcuts.hasOwnProperty('000.9')) {
                delete shortcuts['000.9'];
                delete shortcuts['010.9'];
                
                $(this).closest('.poor-text-area').find('.poor-text-area__status-bar__item--tab').removeClass('on').find('.poor-text-area__status-bar__item--tab__value').text('OFF');
            } else {
                shortcuts['000.9'] = 'indent';
                shortcuts['010.9'] = 'outdent';
                
                $(this).closest('.poor-text-area').find('.poor-text-area__status-bar__item--tab').addClass('on').find('.poor-text-area__status-bar__item--tab__value').text('ON');
            }
            */
        },
        fullscreen: function () {
            var event,
                pta;
            event = $.Event('ptafullscreen');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            
            pta = this._pta.get(0);
            
            if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            } else {
                if (pta.requestFullscreen) {
                    pta.requestFullscreen();
                } else if (pta.mozRequestFullScreen) {
                    pta.mozRequestFullScreen();
                } else if (pta.webkitRequestFullScreen) {
                    pta.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (pta.webkitRequestFullscreen) {
                    pta.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            }
        }
    };
    /**
     * $(...).widget();
     *       .widget(obj options);
     *       .widget(str method);
     *       .widget(str method, args...);
     */
    $.fn[widget] = function () {
        var args,
            ret;
        args = arguments;
        this.filter("input:text, textarea").each(function (i, ele) {
            var $this,
                wgt,
                fn,
                res;
            $this = $(this);
            if (!$this.is(':' + widget)) {
                wgt = new $[widget]($this, $.extend({}, args[0] || {}, $[widget].prototype._options));
                $this.data(widget, wgt);
                wgt._init();
                return;
            }
            wgt = $this.data(widget);
            if (!args.length) {
                wgt._init();
                return;
            }
            fn = ''+args[0];
            if (/^_/.test(fn)) {
                throw new Error('Methods beginning with "_" are considered private and should not be called.');
            }
            if (!$.isFunction(wgt[fn])) {
                throw new Error('"' + fn + '" is not a function and cannot be called.');
            }
            res = wgt[fn].apply(wgt, Array.prototype.slice.call(args, 1));
            if (ret === undefined) {
                ret = res;
            }
            if (/^destroy$/.test(fn)) {
                delete $this.data()[widget];
            }
        });
        if (ret === undefined) {
            ret = this;
        }
        return ret;
    };
    $.expr[':'][widget] = function (ele) {
        return $(ele).data(widget) instanceof $[widget];
    };
}(jQuery, "pta"));