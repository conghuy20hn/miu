/**
 * Created by HoangL on 12/5/2015.
 */
var rtimeResizeend;
var timeoutResizeend = false;
var deltaResizeend = 200;
var isWindowResized = false;

function resizeend() {
    if (new Date() - rtimeResizeend < deltaResizeend) {
        setTimeout(resizeend, deltaResizeend);
    } else {
        timeoutResizeend = false;
        isWindowResized = true;
        //set width, height
        winWidth = $(window).width();
        winHeight = $(window).height();
        modifiedWidth();
        //loadMenuTop();
        prettyPage();
    }
}

function modifiedWidth() {
    $('.inner-scroll-hoz .width-modified').each(function () {
        var self = $(this);
        var childs = self.children();
        var totalWidth = 0;
        var marginItem = self.data('margin-item');
        var paddingItem = self.data('padding-item');
        marginItem = marginItem ? marginItem : 0;
        paddingItem = paddingItem ? paddingItem : 0;
        self.show();
        $.each(childs, function (index, value) {
            if (marginItem) {
                if (index == 0) {
                    $(value).css('margin-right', marginItem);
                } else if (index == childs.length - 1) {
                    $(value).css('margin-left', marginItem);
                } else {
                    $(value).css('margin-left', marginItem)
                        .css('margin-right', marginItem);
                }

            }
            if (paddingItem) {
                $(value).css('padding', paddingItem);
            }
            totalWidth += $(value).outerWidth() + marginItem * 2;
        });
        if (totalWidth < winWidth) {
            marginItem += Math.floor((winWidth - totalWidth) / childs.length / 2);
        }
        if (marginItem > self.data('margin-item')) {
            $.each(childs, function (index, value) {
                if (index == 0) {
                    $(value).css('margin-right', marginItem);
                } else if (index == childs.length - 1) {
                    $(value).css('margin-left', marginItem);
                } else {
                    $(value).css('margin-left', marginItem)
                        .css('margin-right', marginItem);
                }
                totalWidth += $(value).outerWidth() + marginItem * 2;
            });
        }
        totalWidth += 2;
        self.css('width', totalWidth);
        self.parent().css('width', winWidth - self.data('padding'));
    });
}

var TemplateEngine = function (html, options) {
    var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0, match;
    var add = function (line, js) {
        js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    };
    while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
};


function lazyLoadAjax() {
    $('.ajaxLazyLoad').each(function () {
        var urlPajax = $(this).data('url-ajax');
        var callback1 = $(this).data('callback-ajax1');
        var callback2 = $(this).data('callback-ajax2');
        var container = $(this).attr('id');
        if (container && urlPajax) {
            $.ajax({
                method: "GET",
                url: urlPajax
            }).done(function (data) {
                if (data) {
                    $('#' + container).html(data);
                }
            }).always(function () {
                callFunctionName(callback1);
                callFunctionName(callback2);
            });
        }
        // Remove data
        $(this).removeAttr('data-url-ajax');
        $(this).removeAttr('data-callback-ajax1');
        $(this).removeAttr('data-callback-ajax2');
        $(this).removeClass('ajaxLazyLoad');
    });
}

function callFunctionName(functionName) {
    if (functionName) {
        var funcfunctionName = window[functionName];
        if (typeof funcfunctionName === 'function') {
            funcfunctionName();
        }
    }
}

(function ($) {
    if ($.fn.style) {
        return;
    }

    // Escape regex chars with \
    var escape = function (text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    // For those who need them (< IE 9), add support for CSS functions
    var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
    if (!isStyleFuncSupported) {
        CSSStyleDeclaration.prototype.getPropertyValue = function (a) {
            return this.getAttribute(a);
        };
        CSSStyleDeclaration.prototype.setProperty = function (styleName, value, priority) {
            this.setAttribute(styleName, value);
            var priority = typeof priority != 'undefined' ? priority : '';
            if (priority != '') {
                // Add priority manually
                var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
                    '(\\s*;)?', 'gmi');
                this.cssText =
                    this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
            }
        };
        CSSStyleDeclaration.prototype.removeProperty = function (a) {
            return this.removeAttribute(a);
        };
        CSSStyleDeclaration.prototype.getPropertyPriority = function (styleName) {
            var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
                'gmi');
            return rule.test(this.cssText) ? 'important' : '';
        }
    }

    // The style function
    $.fn.style = function (styleName, value, priority) {
        // DOM node
        var node = this.get(0);
        // Ensure we have a DOM node
        if (typeof node == 'undefined') {
            return this;
        }
        // CSSStyleDeclaration
        var style = this.get(0).style;
        // Getter/Setter
        if (typeof styleName != 'undefined') {
            if (typeof value != 'undefined') {
                // Set style property
                priority = typeof priority != 'undefined' ? priority : '';
                style.setProperty(styleName, value, priority);
                return this;
            } else {
                // Get style property
                return style.getPropertyValue(styleName);
            }
        } else {
            // Get CSSStyleDeclaration
            return style;
        }
    };
})(jQuery);