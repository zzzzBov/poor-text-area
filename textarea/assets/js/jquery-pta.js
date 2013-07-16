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
            var event;
            event = $.Event('ptabold');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        italic: function () {
            //trigger the 'ptaitalic' event, if successful, italicize the text
            var event;
            event = $.Event('ptaitalic');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        outdent: function () {
            var event;
            event = $.Event('ptaoutdent');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        indent: function () {
            var event;
            event = $.Event('ptaindent');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        code: function () {
            var event;
            event = $.Event('ptacode');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        code2: function () {
            var event;
            event = $.Event('ptacode2');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        quote: function () {
            var event;
            event = $.Event('ptaquote');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        bulleted: function () {
            var event;
            event = $.Event('ptabulleted');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        numbered: function () {
            var event;
            event = $.Event('ptanumbered');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        link: function () {
            var event;
            event = $.Event('ptalink');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        image: function () {
            var event;
            event = $.Event('ptaimage');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        newline: function () {
            var event;
            event = $.Event('ptanewline');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        home: function () {
            var event;
            event = $.Event('ptahome');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        selecthome: function () {
            var event;
            event = $.Event('ptaselecthome');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
        },
        tabtoggle: function () {
            var event;
            event = $.Event('ptatabtoggle');
            this._element.trigger(event);
            if (event.isDefaultPrevented()) {
                return;
            }
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