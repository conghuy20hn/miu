/**
 * dungld5
 */
var dateFormat = require('dateformat');


const params = require('../config/params');
const obj = require('../lib/Obj');
const self = params.configStr;

exports.getCurrentTime = function (partten) {
    let now = new Date();
    let time = dateFormat(now, partten);
    return time;
}
exports.converDate = function (date, partten) {
    let datetime = new Date(date);
    let time = dateFormat(datetime, partten);
    return time;
}

exports.getMobileNumber = function (msisdn, type) {
    spcStr = "/[^0-9]+/";
    msisdn = this.str_replace(msisdn, spcStr, '');

    if (msisdn.length < 3) {
        return msisdn;
    }
    if (this.isEmpty(type))
        type = self.MOBILE_SIMPLE;
    switch (type) {
        case self.MOBILEGLOBAL:
            if (msisdn.charAt(0) == '0')
                return self.country + msisdn.substr(1, msisdn.length);
            else if (msisdn.substr(0, self.country.length) != self.country)
                return self.country.msisdn;
            else
                return msisdn;
            break;
        case self.MOBILESIMPLE:
            if (msisdn.charAt(0) != '0')
                return '0'.msisdn.substr(elf.country.length, msisdn.length);
            else
                return msisdn;
            break;
        default:
            return msisdn;
    }
}

exports.isEmpty = function (data) {
    if (typeof (data) === 'object') {
        if (JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') {
            return true;
        } else if (!data) {
            return true;
        }
        return false;
    } else if (typeof (data) === 'string') {
        if (!data.trim()) {
            return true;
        }
        return false;
    } else if (typeof (data) === 'undefined') {
        return true;
    } else {
        return false;
    }
}
module.exports.isset = function (param) {
    if (typeof param !== 'undefined') {
        return true;
    }
    return false;
}
exports.convertDay = function (day) {
    let arrTmp = day.split(' ');
    if (arrTmp.length == 2) {
        day = arrTmp[1];
    }
    switch (day.toUpperCase()) {
        case obj.DAY:
            return obj.getName(obj.DAY);
        case obj.WEEK:
            return obj.getName(obj.WEEK);
        case obj.MONTH:
            return obj.getName(obj.MONTH);
        default:
            return '';
    }
}

exports.replaceBulk = function (str, findArray, replaceArray) {
    var i, regex = [], map = {};
    for (i = 0; i < findArray.length; i++) {
        regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, '\\$1'));
        map[findArray[i]] = replaceArray[i];
    }
    regex = regex.join('|');
    str = str.replace(new RegExp(regex, 'g'), function (matched) {
        return map[matched];
    });
    return str;
}
exports.arrayColumn = function (array, columnName) {
    return array.map(function (value, index) {
        return value[columnName];
    })
}
exports.htmlspecialchars = function (string, quoteStyle, charset, doubleEncode) {
    //       discuss at: http://locutus.io/php/htmlspecialchars/
    //      original by: Mirek Slugen
    //      improved by: Kevin van Zonneveld (http://kvz.io)
    //      bugfixed by: Nathan
    //      bugfixed by: Arno
    //      bugfixed by: Brett Zamir (http://brett-zamir.me)
    //      bugfixed by: Brett Zamir (http://brett-zamir.me)
    //       revised by: Kevin van Zonneveld (http://kvz.io)
    //         input by: Ratheous
    //         input by: Mailfaker (http://www.weedem.fr/)
    //         input by: felix
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    //           note 1: charset argument not supported
    //        example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES')
    //        returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
    //        example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES'])
    //        returns 2: 'ab"c&#039;d'
    //        example 3: htmlspecialchars('my "&entity;" is still here', null, null, false)
    //        returns 3: 'my &quot;&entity;&quot; is still here'

    var optTemp = 0
    var i = 0
    var noquotes = false
    if (typeof quoteStyle === 'undefined' || quoteStyle === null) {
        quoteStyle = 2
    }
    string = string || ''
    string = string.toString()

    if (doubleEncode !== false) {
        // Put this first to avoid double-encoding
        string = string.replace(/&/g, '&amp;')
    }

    string = string
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    }
    if (quoteStyle === 0) {
        noquotes = true
    }
    if (typeof quoteStyle !== 'number') {
        // Allow for a single string or an array of string flags
        quoteStyle = [].concat(quoteStyle)
        for (i = 0; i < quoteStyle.length; i++) {
            // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
            if (OPTS[quoteStyle[i]] === 0) {
                noquotes = true
            } else if (OPTS[quoteStyle[i]]) {
                optTemp = optTemp | OPTS[quoteStyle[i]]
            }
        }
        quoteStyle = optTemp
    }
    if (quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/'/g, '&#039;')
    }
    if (!noquotes) {
        string = string.replace(/"/g, '&quot;')
    }

    return string
}
exports.array_values = function (input) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/array_values/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //   example 1: array_values( {firstname: 'Kevin', surname: 'van Zonneveld'} )
    //   returns 1: [ 'Kevin', 'van Zonneveld' ]

    var tmpArr = []
    var key = ''

    for (key in input) {
        tmpArr[tmpArr.length] = input[key]
    }

    return tmpArr
}
exports.array_keys = function (input, searchValue, argStrict) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/array_keys/
    // original by: Kevin van Zonneveld (http://kvz.io)
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: P
    // bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // improved by: jd
    // improved by: Brett Zamir (http://brett-zamir.me)
    //   example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} )
    //   returns 1: [ 'firstname', 'surname' ]

    var search = typeof searchValue !== 'undefined'
    var tmpArr = []
    var strict = !!argStrict
    var include = true
    var key = ''

    for (key in input) {
        if (input.hasOwnProperty(key)) {
            include = true
            if (search) {
                if (strict && input[key] !== searchValue) {
                    include = false
                } else if (input[key] !== searchValue) {
                    include = false
                }
            }

            if (include) {
                tmpArr[tmpArr.length] = key
            }
        }
    }

    return tmpArr
}
exports.str_replace = function (search, replace, subject, countObj) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/str_replace/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Gabriel Paderni
    // improved by: Philip Peterson
    // improved by: Simon Willison (http://simonwillison.net)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // bugfixed by: Anton Ongson
    // bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Oleg Eremeev
    // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
    // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
    //    input by: Onno Marsman (https://twitter.com/onnomarsman)
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: Oleg Eremeev
    //      note 1: The countObj parameter (optional) if used must be passed in as a
    //      note 1: object. The count will then be written by reference into it's `value` property
    //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld')
    //   returns 1: 'Kevin.van.Zonneveld'
    //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars')
    //   returns 2: 'hemmo, mars'
    //   example 3: str_replace(Array('S','F'),'x','ASDFASDF')
    //   returns 3: 'AxDxAxDx'
    //   example 4: var countObj = {}
    //   example 4: str_replace(['A','D'], ['x','y'] , 'ASDFASDF' , countObj)
    //   example 4: var $result = countObj.value
    //   returns 4: 4

    var i = 0
    var j = 0
    var temp = ''
    var repl = ''
    var sl = 0
    var fl = 0
    var f = [].concat(search)
    var r = [].concat(replace)
    var s = subject
    var ra = Object.prototype.toString.call(r) === '[object Array]'
    var sa = Object.prototype.toString.call(s) === '[object Array]'
    s = [].concat(s)

    var $global = (typeof window !== 'undefined' ? window : global)
    $global.$locutus = $global.$locutus || {}
    var $locutus = $global.$locutus
    $locutus.php = $locutus.php || {}

    if (typeof (search) === 'object' && typeof (replace) === 'string') {
        temp = replace
        replace = []
        for (i = 0; i < search.length; i += 1) {
            replace[i] = temp
        }
        temp = ''
        r = [].concat(replace)
        ra = Object.prototype.toString.call(r) === '[object Array]'
    }

    if (typeof countObj !== 'undefined') {
        countObj.value = 0
    }

    for (i = 0, sl = s.length; i < sl; i++) {
        if (s[i] === '') {
            continue
        }
        for (j = 0, fl = f.length; j < fl; j++) {
            temp = s[i] + ''
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0]
            s[i] = (temp).split(f[j]).join(repl)
            if (typeof countObj !== 'undefined') {
                countObj.value += ((temp.split(f[j])).length - 1)
            }
        }
    }
    return sa ? s : s[0]
}
exports.substr_replace = function (str, replace, start, length) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/substr_replace/
    // original by: Brett Zamir (http://brett-zamir.me)
    //   example 1: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', 0)
    //   returns 1: 'bob'
    //   example 2: var $var = 'ABCDEFGH:/MNRPQR/'
    //   example 2: substr_replace($var, 'bob', 0, $var.length)
    //   returns 2: 'bob'
    //   example 3: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', 0, 0)
    //   returns 3: 'bobABCDEFGH:/MNRPQR/'
    //   example 4: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', 10, -1)
    //   returns 4: 'ABCDEFGH:/bob/'
    //   example 5: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', -7, -1)
    //   returns 5: 'ABCDEFGH:/bob/'
    //   example 6: substr_replace('ABCDEFGH:/MNRPQR/', '', 10, -1)
    //   returns 6: 'ABCDEFGH://'

    if (start < 0) {
        // start position in str
        start = start + str.length
    }
    length = length !== undefined ? length : str.length
    if (length < 0) {
        length = length + str.length - start
    }

    return [
        str.slice(0, start),
        replace.substr(0, length),
        replace.slice(length),
        str.slice(start + length)
    ].join('')
}
exports.hideMsisdn = function (msisdn) {
    return this.substr_replace(this.getMobileNumber(msisdn, self.MOBILE_SIMPLE), "xxxxxx", -7, 6);
}
exports.wordwrap = function (str, intWidth, strBreak, cut) {
    //  discuss at: http://locutus.io/php/wordwrap/
    // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // improved by: Nick Callen
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Sakimori
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // bugfixed by: Michael Grier
    // bugfixed by: Feras ALHAEK
    // improved by: Rafał Kukawski (http://kukawski.net)
    //   example 1: wordwrap('Kevin van Zonneveld', 6, '|', true)
    //   returns 1: 'Kevin|van|Zonnev|eld'
    //   example 2: wordwrap('The quick brown fox jumped over the lazy dog.', 20, '<br />\n')
    //   returns 2: 'The quick brown fox<br />\njumped over the lazy<br />\ndog.'
    //   example 3: wordwrap('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
    //   returns 3: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\nveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\ncommodo consequat.'

    intWidth = arguments.length >= 2 ? +intWidth : 75
    strBreak = arguments.length >= 3 ? '' + strBreak : '\n'
    cut = arguments.length >= 4 ? !!cut : false

    var i, j, line

    str += ''

    if (intWidth < 1) {
        return str
    }

    var reLineBreaks = /\r\n|\n|\r/
    var reBeginningUntilFirstWhitespace = /^\S*/
    var reLastCharsWithOptionalTrailingWhitespace = /\S*(\s)?$/

    var lines = str.split(reLineBreaks)
    var l = lines.length
    var match

    // for each line of text
    for (i = 0; i < l; lines[i++] += line) {
        line = lines[i]
        lines[i] = ''

        while (line.length > intWidth) {
            // get slice of length one char above limit
            var slice = line.slice(0, intWidth + 1)

            // remove leading whitespace from rest of line to parse
            var ltrim = 0
            // remove trailing whitespace from new line content
            var rtrim = 0

            match = slice.match(reLastCharsWithOptionalTrailingWhitespace)

            // if the slice ends with whitespace
            if (match[1]) {
                // then perfect moment to cut the line
                j = intWidth
                ltrim = 1
            } else {
                // otherwise cut at previous whitespace
                j = slice.length - match[0].length

                if (j) {
                    rtrim = 1
                }

                // but if there is no previous whitespace
                // and cut is forced
                // cut just at the defined limit
                if (!j && cut && intWidth) {
                    j = intWidth
                }

                // if cut wasn't forced
                // cut at next possible whitespace after the limit
                if (!j) {
                    var charsUntilNextWhitespace = (line.slice(intWidth).match(reBeginningUntilFirstWhitespace) || [''])[0]

                    j = slice.length + charsUntilNextWhitespace.length
                }
            }

            lines[i] += line.slice(0, j - rtrim)
            line = line.slice(j + ltrim)
            lines[i] += line.length ? strBreak : ''
        }
    }

    return lines.join('\n')
}
exports.strpos = function (haystack, needle, offset) {
    //  discuss at: http://locutus.io/php/strpos/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Daniel Esteban
    //   example 1: strpos('Kevin van Zonneveld', 'e', 5)
    //   returns 1: 14

    var i = (haystack + '')
        .indexOf(needle, (offset || 0))
    return i === -1 ? false : i
}
exports.number_format = function (number, decimals, decPoint, thousandsSep) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/number_format/
    // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: davook
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Theriault (https://github.com/Theriault)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Michael White (http://getsprink.com)
    // bugfixed by: Benjamin Lupton
    // bugfixed by: Allan Jensen (http://www.winternet.no)
    // bugfixed by: Howard Yeend
    // bugfixed by: Diogo Resende
    // bugfixed by: Rival
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    //  revised by: Luke Smith (http://lucassmith.name)
    //    input by: Kheang Hok Chin (http://www.distantia.ca/)
    //    input by: Jay Klehr
    //    input by: Amir Habibi (http://www.residence-mixte.com/)
    //    input by: Amirouche
    //   example 1: number_format(1234.56)
    //   returns 1: '1,235'
    //   example 2: number_format(1234.56, 2, ',', ' ')
    //   returns 2: '1 234,56'
    //   example 3: number_format(1234.5678, 2, '.', '')
    //   returns 3: '1234.57'
    //   example 4: number_format(67, 2, ',', '.')
    //   returns 4: '67,00'
    //   example 5: number_format(1000)
    //   returns 5: '1,000'
    //   example 6: number_format(67.311, 2)
    //   returns 6: '67.31'
    //   example 7: number_format(1000.55, 1)
    //   returns 7: '1,000.6'
    //   example 8: number_format(67000, 5, ',', '.')
    //   returns 8: '67.000,00000'
    //   example 9: number_format(0.9, 0)
    //   returns 9: '1'
    //  example 10: number_format('1.20', 2)
    //  returns 10: '1.20'
    //  example 11: number_format('1.20', 4)
    //  returns 11: '1.2000'
    //  example 12: number_format('1.2000', 3)
    //  returns 12: '1.200'
    //  example 13: number_format('1 000,50', 2, '.', ' ')
    //  returns 13: '100 050.00'
    //  example 14: number_format(1e-8, 8, '.', '')
    //  returns 14: '0.00000001'

    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    var s = ''

    var toFixedFix = function (n, prec) {
        if (('' + n).indexOf('e') === -1) {
            return +(Math.round(n + 'e+' + prec) + 'e-' + prec)
        } else {
            var arr = ('' + n).split('e')
            var sig = ''
            if (+arr[1] + prec > 0) {
                sig = '+'
            }
            return (+(Math.round(+arr[0] + 'e' + sig + (+arr[1] + prec)) + 'e-' + prec)).toFixed(prec)
        }
    }

    // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec).toString() : '' + Math.round(n)).split('.')
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }

    return s.join(dec)
}
exports.array_unique = function (inputArr) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/array_unique/
    // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    //    input by: duncan
    //    input by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Nate
    // bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // improved by: Michael Grier
    //      note 1: The second argument, sort_flags is not implemented;
    //      note 1: also should be sorted (asort?) first according to docs
    //   example 1: array_unique(['Kevin','Kevin','van','Zonneveld','Kevin'])
    //   returns 1: {0: 'Kevin', 2: 'van', 3: 'Zonneveld'}
    //   example 2: array_unique({'a': 'green', 0: 'red', 'b': 'green', 1: 'blue', 2: 'red'})
    //   returns 2: {a: 'green', 0: 'red', 1: 'blue'}

    var key = ''
    var tmpArr2 = {}
    var val = ''

    var _arraySearch = function (needle, haystack) {
        var fkey = ''
        for (fkey in haystack) {
            if (haystack.hasOwnProperty(fkey)) {
                if ((haystack[fkey] + '') === (needle + '')) {
                    return fkey
                }
            }
        }
        return false
    }

    for (key in inputArr) {
        if (inputArr.hasOwnProperty(key)) {
            val = inputArr[key]
            if (_arraySearch(val, tmpArr2) === false) {
                tmpArr2[key] = val
            }
        }
    }

    return tmpArr2
}
exports.truncateWords = function (str, len, withDot = true) {
    let strTmp = str;
    if (!this.isEmpty(str) && str.length > len) {
        strTmp = this.wordwrap(str, len);
        $strTmp = str.substr(0, this.strpos(strTmp, "\n"));

        if (withDot) {
            strTmp = strTmp + "...";
        }
    }

    return strTmp;
}
exports.strrpos = function (haystack, needle, offset) {
    //  discuss at: http://locutus.io/php/strrpos/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //    input by: saulius
    //   example 1: strrpos('Kevin van Zonneveld', 'e')
    //   returns 1: 16
    //   example 2: strrpos('somepage.com', '.', false)
    //   returns 2: 8
    //   example 3: strrpos('baa', 'a', 3)
    //   returns 3: false
    //   example 4: strrpos('baa', 'a', 2)
    //   returns 4: 2

    var i = -1
    if (offset) {
        i = (haystack + '')
            .slice(offset)
            .lastIndexOf(needle) // strrpos' offset indicates starting point of range till end,
        // while lastIndexOf's optional 2nd argument indicates ending point of range from the beginning
        if (i !== -1) {
            i += offset
        }
    } else {
        i = (haystack + '')
            .lastIndexOf(needle)
    }
    return i >= 0 ? i : false
}
exports.gmdate = function (format, timestamp) {
    //  discuss at: http://locutus.io/php/gmdate/
    // original by: Brett Zamir (http://brett-zamir.me)
    //    input by: Alex
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: gmdate('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400); // Return will depend on your timezone
    //   returns 1: '07:09:40 m is month'

    var date = require('../datetime/date')

    var dt = typeof timestamp === 'undefined' ? new Date() // Not provided
        : timestamp instanceof Date ? new Date(timestamp) // Javascript Date()
            : new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)

    timestamp = Date.parse(dt.toUTCString().slice(0, -4)) / 1000

    return date(format, timestamp)
}
exports.durationToStr = function (duration) {
    if (!this.isEmpty(duration)) {
        arrStr = this.gmdate("H:i:s", duration).split(":");

        if (arrStr[0] > 0) {
            return intval(duration / 3600) + ":" + arrStr[1] + ":" + arrStr[2];
        } else {
            return arrStr[1] + ":" + arrStr[2];
        }
    } else {
        return duration;
    }
}
exports.convertPlayTimes = function convertPlayTimes(count) {
    if (count < 1000)
        return this.number_format($count, 0, ',', '.');
    if (count < 1000000 && count >= 1000)
        return intval(count / 1000) + "K";
    if (count >= 1000000)
        return this.number_format(Math.floor(count / 1000000), 0, ',', '.') + "tr";
}
exports.timeElapsedString = function (datetime) {
    return datetime;
}
exports.removeSignOnly = function (str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.trim;
    return str;
}
exports.in_array = function (needle, haystack, argStrict) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/in_array/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: vlado houba
    // improved by: Jonas Sciangula Street (Joni2Back)
    //    input by: Billy
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: in_array('van', ['Kevin', 'van', 'Zonneveld'])
    //   returns 1: true
    //   example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'})
    //   returns 2: false
    //   example 3: in_array(1, ['1', '2', '3'])
    //   example 3: in_array(1, ['1', '2', '3'], false)
    //   returns 3: true
    //   returns 3: true
    //   example 4: in_array(1, ['1', '2', '3'], true)
    //   returns 4: false

    var key = ''
    var strict = !!argStrict

    // we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] === ndl)
    // in just one for, in order to improve the performance
    // deciding wich type of comparation will do before walk array
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) { // eslint-disable-line eqeqeq
                return true
            }
        }
    }

    return false
}
exports.is_array = function (mixedVar) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/is_array/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Legaev Andrey
    // improved by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Nathan Sepulveda
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Cord
    // bugfixed by: Manish
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //      note 1: In Locutus, javascript objects are like php associative arrays,
    //      note 1: thus JavaScript objects will also
    //      note 1: return true in this function (except for objects which inherit properties,
    //      note 1: being thus used as objects),
    //      note 1: unless you do ini_set('locutus.objectsAsArrays', 0),
    //      note 1: in which case only genuine JavaScript arrays
    //      note 1: will return true
    //   example 1: is_array(['Kevin', 'van', 'Zonneveld'])
    //   returns 1: true
    //   example 2: is_array('Kevin van Zonneveld')
    //   returns 2: false
    //   example 3: is_array({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
    //   returns 3: true
    //   example 4: ini_set('locutus.objectsAsArrays', 0)
    //   example 4: is_array({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
    //   returns 4: false
    //   example 5: is_array(function tmp_a (){ this.name = 'Kevin' })
    //   returns 5: false

    var _getFuncName = function (fn) {
        var name = (/\W*function\s+([\w$]+)\s*\(/).exec(fn)
        if (!name) {
            return '(Anonymous)'
        }
        return name[1]
    }
    var _isArray = function (mixedVar) {
        // return Object.prototype.toString.call(mixedVar) === '[object Array]';
        // The above works, but let's do the even more stringent approach:
        // (since Object.prototype.toString could be overridden)
        // Null, Not an object, no length property so couldn't be an Array (or String)
        if (!mixedVar || typeof mixedVar !== 'object' || typeof mixedVar.length !== 'number') {
            return false
        }
        var len = mixedVar.length
        mixedVar[mixedVar.length] = 'bogus'
        // The only way I can think of to get around this (or where there would be trouble)
        // would be to have an object defined
        // with a custom "length" getter which changed behavior on each call
        // (or a setter to mess up the following below) or a custom
        // setter for numeric properties, but even that would need to listen for
        // specific indexes; but there should be no false negatives
        // and such a false positive would need to rely on later JavaScript
        // innovations like __defineSetter__
        if (len !== mixedVar.length) {
            // We know it's an array since length auto-changed with the addition of a
            // numeric property at its length end, so safely get rid of our bogus element
            mixedVar.length -= 1
            return true
        }
        // Get rid of the property we added onto a non-array object; only possible
        // side-effect is if the user adds back the property later, it will iterate
        // this property in the older order placement in IE (an order which should not
        // be depended on anyways)
        delete mixedVar[mixedVar.length]
        return false
    }

    if (!mixedVar || typeof mixedVar !== 'object') {
        return false
    }

    var isArray = _isArray(mixedVar)

    if (isArray) {
        return true
    }

    var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.objectsAsArrays') : undefined) || 'on'
    if (iniVal === 'on') {
        var asString = Object.prototype.toString.call(mixedVar)
        var asFunc = _getFuncName(mixedVar.constructor)

        if (asString === '[object Object]' && asFunc === 'Object') {
            // Most likely a literal and intended as assoc. array
            return true
        }
    }

    return false
}
exports.hideISDNComment = function (msisdn) {
    return msisdn.substr(0, 3) + 'xxx';
}
exports.ksort = function (inputArr, sortFlags) {
    //  discuss at: http://locutus.io/php/ksort/
    // original by: GeekFG (http://geekfg.blogspot.com)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //      note 1: This function deviates from PHP in returning a copy of the array instead
    //      note 1: of acting by reference and returning true; this was necessary because
    //      note 1: IE does not allow deleting and re-adding of properties without caching
    //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
    //      note 1: get the PHP behavior, but use this only if you are in an environment
    //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
    //      note 1: property deletion is supported. Note that we intend to implement the PHP
    //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
    //      note 1: is by reference in PHP anyways
    //      note 1: Since JS objects' keys are always strings, and (the
    //      note 1: default) SORT_REGULAR flag distinguishes by key type,
    //      note 1: if the content is a numeric string, we treat the
    //      note 1: "original type" as numeric.
    //   example 1: var $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
    //   example 1: ksort($data)
    //   example 1: var $result = $data
    //   returns 1: {a: 'orange', b: 'banana', c: 'apple', d: 'lemon'}
    //   example 2: ini_set('locutus.sortByReference', true)
    //   example 2: var $data = {2: 'van', 3: 'Zonneveld', 1: 'Kevin'}
    //   example 2: ksort($data)
    //   example 2: var $result = $data
    //   returns 2: {1: 'Kevin', 2: 'van', 3: 'Zonneveld'}

    var i18nlgd = require('../i18n/i18n_loc_get_default')
    var strnatcmp = require('../strings/strnatcmp')

    var tmpArr = {}
    var keys = []
    var sorter
    var i
    var k
    var sortByReference = false
    var populateArr = {}

    var $global = (typeof window !== 'undefined' ? window : global)
    $global.$locutus = $global.$locutus || {}
    var $locutus = $global.$locutus
    $locutus.php = $locutus.php || {}
    $locutus.php.locales = $locutus.php.locales || {}

    switch (sortFlags) {
        case 'SORT_STRING':
            // compare items as strings
            sorter = function (a, b) {
                return strnatcmp(b, a)
            }
            break
        case 'SORT_LOCALE_STRING':
            // compare items as strings, based on the current locale
            // (set with i18n_loc_set_default() as of PHP6)
            var loc = i18nlgd()
            sorter = $locutus.locales[loc].sorting
            break
        case 'SORT_NUMERIC':
            // compare items numerically
            sorter = function (a, b) {
                return ((a + 0) - (b + 0))
            }
            break
        default:
            // case 'SORT_REGULAR': // compare items normally (don't change types)
            sorter = function (a, b) {
                var aFloat = parseFloat(a)
                var bFloat = parseFloat(b)
                var aNumeric = aFloat + '' === a
                var bNumeric = bFloat + '' === b
                if (aNumeric && bNumeric) {
                    return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0
                } else if (aNumeric && !bNumeric) {
                    return 1
                } else if (!aNumeric && bNumeric) {
                    return -1
                }
                return a > b ? 1 : a < b ? -1 : 0
            }
            break
    }

    // Make a list of key names
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            keys.push(k)
        }
    }
    keys.sort(sorter)

    var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
    sortByReference = iniVal === 'on'
    populateArr = sortByReference ? inputArr : populateArr

    // Rebuild array with sorted key names
    for (i = 0; i < keys.length; i++) {
        k = keys[i]
        tmpArr[k] = inputArr[k]
        if (sortByReference) {
            delete inputArr[k]
        }
    }
    for (i in tmpArr) {
        if (tmpArr.hasOwnProperty(i)) {
            populateArr[i] = tmpArr[i]
        }
    }

    return sortByReference || populateArr
}
exports.array_slice = function (arr, offst, lgth, preserveKeys) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/array_slice/
    // original by: Brett Zamir (http://brett-zamir.me)
    //    input by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Kevin van Zonneveld (http://kvz.io)
    //      note 1: Relies on is_int because !isNaN accepts floats
    //   example 1: array_slice(["a", "b", "c", "d", "e"], 2, -1)
    //   returns 1: [ 'c', 'd' ]
    //   example 2: array_slice(["a", "b", "c", "d", "e"], 2, -1, true)
    //   returns 2: {2: 'c', 3: 'd'}

    var isInt = require('../var/is_int')

    /*
      if ('callee' in arr && 'length' in arr) {
        arr = Array.prototype.slice.call(arr);
      }
    */

    var key = ''

    if (Object.prototype.toString.call(arr) !== '[object Array]' || (preserveKeys && offst !== 0)) {
        // Assoc. array as input or if required as output
        var lgt = 0
        var newAssoc = {}
        for (key in arr) {
            lgt += 1
            newAssoc[key] = arr[key]
        }
        arr = newAssoc

        offst = (offst < 0) ? lgt + offst : offst
        lgth = lgth === undefined ? lgt : (lgth < 0) ? lgt + lgth - offst : lgth

        var assoc = {}
        var start = false
        var it = -1
        var arrlgth = 0
        var noPkIdx = 0

        for (key in arr) {
            ++it
            if (arrlgth >= lgth) {
                break
            }
            if (it === offst) {
                start = true
            }
            if (!start) {
                continue
            } ++arrlgth
            if (isInt(key) && !preserveKeys) {
                assoc[noPkIdx++] = arr[key]
            } else {
                assoc[key] = arr[key]
            }
        }
        // Make as array-like object (though length will not be dynamic)
        // assoc.length = arrlgth;
        return assoc
    }

    if (lgth === undefined) {
        return arr.slice(offst)
    } else if (lgth >= 0) {
        return arr.slice(offst, offst + lgth)
    } else {
        return arr.slice(offst, lgth)
    }
}
exports.array_filter = function (arr, func) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/array_filter/
    // original by: Brett Zamir (http://brett-zamir.me)
    //    input by: max4ever
    // improved by: Brett Zamir (http://brett-zamir.me)
    //      note 1: Takes a function as an argument, not a function's name
    //   example 1: var odd = function (num) {return (num & 1);}
    //   example 1: array_filter({"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}, odd)
    //   returns 1: {"a": 1, "c": 3, "e": 5}
    //   example 2: var even = function (num) {return (!(num & 1));}
    //   example 2: array_filter([6, 7, 8, 9, 10, 11, 12], even)
    //   returns 2: [ 6, , 8, , 10, , 12 ]
    //   example 3: array_filter({"a": 1, "b": false, "c": -1, "d": 0, "e": null, "f":'', "g":undefined})
    //   returns 3: {"a":1, "c":-1}

    var retObj = {}
    var k

    func = func || function (v) {
        return v
    }

    // @todo: Issue #73
    if (Object.prototype.toString.call(arr) === '[object Array]') {
        retObj = []
    }

    for (k in arr) {
        if (func(arr[k])) {
            retObj[k] = arr[k]
        }
    }

    return retObj
}
exports.currentCacheTime = function () {
    let now = new Date();
    let dateNow = dateFormat(now, "yyyy-mm-dd HH:");
    let minute = (now.getMinutes());
    let cacheMinute = Math.floor(minute / 5) * 5;
    if (cacheMinute < 10) {
        cacheMinute = '0' + cacheMinute;
    }
    return dateNow + cacheMinute + ":00";
}