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
        
        element.wrap('<span>');
        this._pta = $(element.parent());
        
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
            ]
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