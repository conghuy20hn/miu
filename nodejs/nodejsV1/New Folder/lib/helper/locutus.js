const reSpace = '[ \\t]+'
const reSpaceOpt = '[ \\t]*'
const reMeridian = '(?:([ap])\\.?m\\.?([\\t ]|$))'
const reHour24 = '(2[0-4]|[01]?[0-9])'
const reHour24lz = '([01][0-9]|2[0-4])'
const reHour12 = '(0?[1-9]|1[0-2])'
const reMinute = '([0-5]?[0-9])'
const reMinutelz = '([0-5][0-9])'
const reSecond = '(60|[0-5]?[0-9])'
const reSecondlz = '(60|[0-5][0-9])'
const reFrac = '(?:\\.([0-9]+))'

const reDayfull = 'sunday|monday|tuesday|wednesday|thursday|friday|saturday'
const reDayabbr = 'sun|mon|tue|wed|thu|fri|sat'
const reDaytext = reDayfull + '|' + reDayabbr + '|weekdays?'

const reReltextnumber = 'first|second|third|fourth|fifth|sixth|seventh|eighth?|ninth|tenth|eleventh|twelfth'
const reReltexttext = 'next|last|previous|this'
const reReltextunit = '(?:second|sec|minute|min|hour|day|fortnight|forthnight|month|year)s?|weeks|' + reDaytext

const reYear = '([0-9]{1,4})'
const reYear2 = '([0-9]{2})'
const reYear4 = '([0-9]{4})'
const reYear4withSign = '([+-]?[0-9]{4})'
const reMonth = '(1[0-2]|0?[0-9])'
const reMonthlz = '(0[0-9]|1[0-2])'
const reDay = '(?:(3[01]|[0-2]?[0-9])(?:st|nd|rd|th)?)'
const reDaylz = '(0[0-9]|[1-2][0-9]|3[01])'

const reMonthFull = 'january|february|march|april|may|june|july|august|september|october|november|december'
const reMonthAbbr = 'jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec'
const reMonthroman = 'i[vx]|vi{0,3}|xi{0,2}|i{1,3}'
const reMonthText = '(' + reMonthFull + '|' + reMonthAbbr + '|' + reMonthroman + ')'

const reTzCorrection = '((?:GMT)?([+-])' + reHour24 + ':?' + reMinute + '?)'
const reDayOfYear = '(00[1-9]|0[1-9][0-9]|[12][0-9][0-9]|3[0-5][0-9]|36[0-6])'
const reWeekOfYear = '(0[1-9]|[1-4][0-9]|5[0-3])'

function processMeridian(hour, meridian) {
    meridian = meridian && meridian.toLowerCase()

    switch (meridian) {
        case 'a':
            hour += hour === 12 ? -12 : 0
            break
        case 'p':
            hour += hour !== 12 ? 12 : 0
            break
    }

    return hour
}

function processYear(yearStr) {
    let year = +yearStr

    if (yearStr.length < 4 && year < 100) {
        year += year < 70 ? 2000 : 1900
    }

    return year
}

function lookupMonth(monthStr) {
    return {
        jan: 0,
        january: 0,
        i: 0,
        feb: 1,
        february: 1,
        ii: 1,
        mar: 2,
        march: 2,
        iii: 2,
        apr: 3,
        april: 3,
        iv: 3,
        may: 4,
        v: 4,
        jun: 5,
        june: 5,
        vi: 5,
        jul: 6,
        july: 6,
        vii: 6,
        aug: 7,
        august: 7,
        viii: 7,
        sep: 8,
        sept: 8,
        september: 8,
        ix: 8,
        oct: 9,
        october: 9,
        x: 9,
        nov: 10,
        november: 10,
        xi: 10,
        dec: 11,
        december: 11,
        xii: 11
    }[monthStr.toLowerCase()]
}

function lookupWeekday(dayStr, desiredSundayNumber = 0) {
    const dayNumbers = {
        mon: 1,
        monday: 1,
        tue: 2,
        tuesday: 2,
        wed: 3,
        wednesday: 3,
        thu: 4,
        thursday: 4,
        fri: 5,
        friday: 5,
        sat: 6,
        saturday: 6,
        sun: 0,
        sunday: 0
    }

    return dayNumbers[dayStr.toLowerCase()] || desiredSundayNumber
}

function lookupRelative(relText) {
    const relativeNumbers = {
        last: -1,
        previous: -1,
        this: 0,
        first: 1,
        next: 1,
        second: 2,
        third: 3,
        fourth: 4,
        fifth: 5,
        sixth: 6,
        seventh: 7,
        eight: 8,
        eighth: 8,
        ninth: 9,
        tenth: 10,
        eleventh: 11,
        twelfth: 12
    }

    const relativeBehavior = {
        this: 1
    }

    const relTextLower = relText.toLowerCase()

    return {
        amount: relativeNumbers[relTextLower],
        behavior: relativeBehavior[relTextLower] || 0
    }
}

function processTzCorrection(tzOffset, oldValue) {
    const reTzCorrectionLoose = /(?:GMT)?([+-])(\d+)(:?)(\d{0,2})/i
    tzOffset = tzOffset && tzOffset.match(reTzCorrectionLoose)

    if (!tzOffset) {
        return oldValue
    }

    let sign = tzOffset[1] === '-' ? 1 : -1
    let hours = +tzOffset[2]
    let minutes = +tzOffset[4]

    if (!tzOffset[4] && !tzOffset[3]) {
        minutes = Math.floor(hours % 100)
        hours = Math.floor(hours / 100)
    }

    return sign * (hours * 60 + minutes)
}

const formats = {
    yesterday: {
        regex: /^yesterday/i,
        name: 'yesterday',
        callback() {
            this.rd -= 1
            return this.resetTime()
        }
    },

    now: {
        regex: /^now/i,
        name: 'now'
        // do nothing
    },

    noon: {
        regex: /^noon/i,
        name: 'noon',
        callback() {
            return this.resetTime() && this.time(12, 0, 0, 0)
        }
    },

    midnightOrToday: {
        regex: /^(midnight|today)/i,
        name: 'midnight | today',
        callback() {
            return this.resetTime()
        }
    },

    tomorrow: {
        regex: /^tomorrow/i,
        name: 'tomorrow',
        callback() {
            this.rd += 1
            return this.resetTime()
        }
    },

    timestamp: {
        regex: /^@(-?\d+)/i,
        name: 'timestamp',
        callback(match, timestamp) {
            this.rs += +timestamp
            this.y = 1970
            this.m = 0
            this.d = 1
            this.dates = 0

            return this.resetTime() && this.zone(0)
        }
    },

    firstOrLastDay: {
        regex: /^(first|last) day of/i,
        name: 'firstdayof | lastdayof',
        callback(match, day) {
            if (day.toLowerCase() === 'first') {
                this.firstOrLastDayOfMonth = 1
            } else {
                this.firstOrLastDayOfMonth = -1
            }
        }
    },

    backOrFrontOf: {
        regex: RegExp('^(back|front) of ' + reHour24 + reSpaceOpt + reMeridian + '?', 'i'),
        name: 'backof | frontof',
        callback(match, side, hours, meridian) {
            let back = side.toLowerCase() === 'back'
            let hour = +hours
            let minute = 15

            if (!back) {
                hour -= 1
                minute = 45
            }

            hour = processMeridian(hour, meridian)

            return this.resetTime() && this.time(hour, minute, 0, 0)
        }
    },

    weekdayOf: {
        regex: RegExp('^(' + reReltextnumber + '|' + reReltexttext + ')' + reSpace + '(' + reDayfull + '|' + reDayabbr + ')' + reSpace + 'of', 'i'),
        name: 'weekdayof'
        // todo
    },

    mssqltime: {
        regex: RegExp('^' + reHour12 + ':' + reMinutelz + ':' + reSecondlz + '[:.]([0-9]+)' + reMeridian, 'i'),
        name: 'mssqltime',
        callback(match, hour, minute, second, frac, meridian) {
            return this.time(processMeridian(+hour, meridian), +minute, +second, +frac.substr(0, 3))
        }
    },

    timeLong12: {
        regex: RegExp('^' + reHour12 + '[:.]' + reMinute + '[:.]' + reSecondlz + reSpaceOpt + reMeridian, 'i'),
        name: 'timelong12',
        callback(match, hour, minute, second, meridian) {
            return this.time(processMeridian(+hour, meridian), +minute, +second, 0)
        }
    },

    timeShort12: {
        regex: RegExp('^' + reHour12 + '[:.]' + reMinutelz + reSpaceOpt + reMeridian, 'i'),
        name: 'timeshort12',
        callback(match, hour, minute, meridian) {
            return this.time(processMeridian(+hour, meridian), +minute, 0, 0)
        }
    },

    timeTiny12: {
        regex: RegExp('^' + reHour12 + reSpaceOpt + reMeridian, 'i'),
        name: 'timetiny12',
        callback(match, hour, meridian) {
            return this.time(processMeridian(+hour, meridian), 0, 0, 0)
        }
    },

    soap: {
        regex: RegExp('^' + reYear4 + '-' + reMonthlz + '-' + reDaylz + 'T' + reHour24lz + ':' + reMinutelz + ':' + reSecondlz + reFrac + reTzCorrection + '?', 'i'),
        name: 'soap',
        callback(match, year, month, day, hour, minute, second, frac, tzCorrection) {
            return this.ymd(+year, month - 1, +day) &&
                this.time(+hour, +minute, +second, +frac.substr(0, 3)) &&
                this.zone(processTzCorrection(tzCorrection))
        }
    },

    wddx: {
        regex: RegExp('^' + reYear4 + '-' + reMonth + '-' + reDay + 'T' + reHour24 + ':' + reMinute + ':' + reSecond),
        name: 'wddx',
        callback(match, year, month, day, hour, minute, second) {
            return this.ymd(+year, month - 1, +day) && this.time(+hour, +minute, +second, 0)
        }
    },

    exif: {
        regex: RegExp('^' + reYear4 + ':' + reMonthlz + ':' + reDaylz + ' ' + reHour24lz + ':' + reMinutelz + ':' + reSecondlz, 'i'),
        name: 'exif',
        callback(match, year, month, day, hour, minute, second) {
            return this.ymd(+year, month - 1, +day) && this.time(+hour, +minute, +second, 0)
        }
    },

    xmlRpc: {
        regex: RegExp('^' + reYear4 + reMonthlz + reDaylz + 'T' + reHour24 + ':' + reMinutelz + ':' + reSecondlz),
        name: 'xmlrpc',
        callback(match, year, month, day, hour, minute, second) {
            return this.ymd(+year, month - 1, +day) && this.time(+hour, +minute, +second, 0)
        }
    },

    xmlRpcNoColon: {
        regex: RegExp('^' + reYear4 + reMonthlz + reDaylz + '[Tt]' + reHour24 + reMinutelz + reSecondlz),
        name: 'xmlrpcnocolon',
        callback(match, year, month, day, hour, minute, second) {
            return this.ymd(+year, month - 1, +day) && this.time(+hour, +minute, +second, 0)
        }
    },

    clf: {
        regex: RegExp('^' + reDay + '/(' + reMonthAbbr + ')/' + reYear4 + ':' + reHour24lz + ':' + reMinutelz + ':' + reSecondlz + reSpace + reTzCorrection, 'i'),
        name: 'clf',
        callback(match, day, month, year, hour, minute, second, tzCorrection) {
            return this.ymd(+year, lookupMonth(month), +day) &&
                this.time(+hour, +minute, +second, 0) &&
                this.zone(processTzCorrection(tzCorrection))
        }
    },

    iso8601long: {
        regex: RegExp('^t?' + reHour24 + '[:.]' + reMinute + '[:.]' + reSecond + reFrac, 'i'),
        name: 'iso8601long',
        callback(match, hour, minute, second, frac) {
            return this.time(+hour, +minute, +second, +frac.substr(0, 3))
        }
    },

    dateTextual: {
        regex: RegExp('^' + reMonthText + '[ .\\t-]*' + reDay + '[,.stndrh\\t ]+' + reYear, 'i'),
        name: 'datetextual',
        callback(match, month, day, year) {
            return this.ymd(processYear(year), lookupMonth(month), +day)
        }
    },

    pointedDate4: {
        regex: RegExp('^' + reDay + '[.\\t-]' + reMonth + '[.-]' + reYear4),
        name: 'pointeddate4',
        callback(match, day, month, year) {
            return this.ymd(+year, month - 1, +day)
        }
    },

    pointedDate2: {
        regex: RegExp('^' + reDay + '[.\\t]' + reMonth + '\\.' + reYear2),
        name: 'pointeddate2',
        callback(match, day, month, year) {
            return this.ymd(processYear(year), month - 1, +day)
        }
    },

    timeLong24: {
        regex: RegExp('^t?' + reHour24 + '[:.]' + reMinute + '[:.]' + reSecond),
        name: 'timelong24',
        callback(match, hour, minute, second) {
            return this.time(+hour, +minute, +second, 0)
        }
    },

    dateNoColon: {
        regex: RegExp('^' + reYear4 + reMonthlz + reDaylz),
        name: 'datenocolon',
        callback(match, year, month, day) {
            return this.ymd(+year, month - 1, +day)
        }
    },

    pgydotd: {
        regex: RegExp('^' + reYear4 + '\\.?' + reDayOfYear),
        name: 'pgydotd',
        callback(match, year, day) {
            return this.ymd(+year, 0, +day)
        }
    },

    timeShort24: {
        regex: RegExp('^t?' + reHour24 + '[:.]' + reMinute, 'i'),
        name: 'timeshort24',
        callback(match, hour, minute) {
            return this.time(+hour, +minute, 0, 0)
        }
    },

    iso8601noColon: {
        regex: RegExp('^t?' + reHour24lz + reMinutelz + reSecondlz, 'i'),
        name: 'iso8601nocolon',
        callback(match, hour, minute, second) {
            return this.time(+hour, +minute, +second, 0)
        }
    },

    iso8601dateSlash: {
        // eventhough the trailing slash is optional in PHP
        // here it's mandatory and inputs without the slash
        // are handled by dateslash
        regex: RegExp('^' + reYear4 + '/' + reMonthlz + '/' + reDaylz + '/'),
        name: 'iso8601dateslash',
        callback(match, year, month, day) {
            return this.ymd(+year, month - 1, +day)
        }
    },

    dateSlash: {
        regex: RegExp('^' + reYear4 + '/' + reMonth + '/' + reDay),
        name: 'dateslash',
        callback(match, year, month, day) {
            return this.ymd(+year, month - 1, +day)
        }
    },

    american: {
        regex: RegExp('^' + reMonth + '/' + reDay + '/' + reYear),
        name: 'american',
        callback(match, month, day, year) {
            return this.ymd(processYear(year), month - 1, +day)
        }
    },

    americanShort: {
        regex: RegExp('^' + reMonth + '/' + reDay),
        name: 'americanshort',
        callback(match, month, day) {
            return this.ymd(this.y, month - 1, +day)
        }
    },

    gnuDateShortOrIso8601date2: {
        // iso8601date2 is complete subset of gnudateshort
        regex: RegExp('^' + reYear + '-' + reMonth + '-' + reDay),
        name: 'gnudateshort | iso8601date2',
        callback(match, year, month, day) {
            return this.ymd(processYear(year), month - 1, +day)
        }
    },

    iso8601date4: {
        regex: RegExp('^' + reYear4withSign + '-' + reMonthlz + '-' + reDaylz),
        name: 'iso8601date4',
        callback(match, year, month, day) {
            return this.ymd(+year, month - 1, +day)
        }
    },

    gnuNoColon: {
        regex: RegExp('^t' + reHour24lz + reMinutelz, 'i'),
        name: 'gnunocolon',
        callback(match, hour, minute) {
            return this.time(+hour, +minute, 0, this.f)
        }
    },

    gnuDateShorter: {
        regex: RegExp('^' + reYear4 + '-' + reMonth),
        name: 'gnudateshorter',
        callback(match, year, month) {
            return this.ymd(+year, month - 1, 1)
        }
    },

    pgTextReverse: {
        // note: allowed years are from 32-9999
        // years below 32 should be treated as days in datefull
        regex: RegExp('^' + '(\\d{3,4}|[4-9]\\d|3[2-9])-(' + reMonthAbbr + ')-' + reDaylz, 'i'),
        name: 'pgtextreverse',
        callback(match, year, month, day) {
            return this.ymd(processYear(year), lookupMonth(month), +day)
        }
    },

    dateFull: {
        regex: RegExp('^' + reDay + '[ \\t.-]*' + reMonthText + '[ \\t.-]*' + reYear, 'i'),
        name: 'datefull',
        callback(match, day, month, year) {
            return this.ymd(processYear(year), lookupMonth(month), +day)
        }
    },

    dateNoDay: {
        regex: RegExp('^' + reMonthText + '[ .\\t-]*' + reYear4, 'i'),
        name: 'datenoday',
        callback(match, month, year) {
            return this.ymd(+year, lookupMonth(month), 1)
        }
    },

    dateNoDayRev: {
        regex: RegExp('^' + reYear4 + '[ .\\t-]*' + reMonthText, 'i'),
        name: 'datenodayrev',
        callback(match, year, month) {
            return this.ymd(+year, lookupMonth(month), 1)
        }
    },

    pgTextShort: {
        regex: RegExp('^(' + reMonthAbbr + ')-' + reDaylz + '-' + reYear, 'i'),
        name: 'pgtextshort',
        callback(match, month, day, year) {
            return this.ymd(processYear(year), lookupMonth(month), +day)
        }
    },

    dateNoYear: {
        regex: RegExp('^' + reMonthText + '[ .\\t-]*' + reDay + '[,.stndrh\\t ]*', 'i'),
        name: 'datenoyear',
        callback(match, month, day) {
            return this.ymd(this.y, lookupMonth(month), +day)
        }
    },

    dateNoYearRev: {
        regex: RegExp('^' + reDay + '[ .\\t-]*' + reMonthText, 'i'),
        name: 'datenoyearrev',
        callback(match, day, month) {
            return this.ymd(this.y, lookupMonth(month), +day)
        }
    },

    isoWeekDay: {
        regex: RegExp('^' + reYear4 + '-?W' + reWeekOfYear + '(?:-?([0-7]))?'),
        name: 'isoweekday | isoweek',
        callback(match, year, week, day) {
            day = day ? +day : 1

            if (!this.ymd(+year, 0, 1)) {
                return false
            }

            // get day of week for Jan 1st
            let dayOfWeek = new Date(this.y, this.m, this.d).getDay()

            // and use the day to figure out the offset for day 1 of week 1
            dayOfWeek = 0 - (dayOfWeek > 4 ? dayOfWeek - 7 : dayOfWeek)

            this.rd += dayOfWeek + ((week - 1) * 7) + day
        }
    },

    relativeText: {
        regex: RegExp('^(' + reReltextnumber + '|' + reReltexttext + ')' + reSpace + '(' + reReltextunit + ')', 'i'),
        name: 'relativetext',
        callback(match, relValue, relUnit) {
            // todo: implement handling of 'this time-unit'
            // eslint-disable-next-line no-unused-vars
            const { amount, behavior } = lookupRelative(relValue)

            switch (relUnit.toLowerCase()) {
                case 'sec':
                case 'secs':
                case 'second':
                case 'seconds':
                    this.rs += amount
                    break
                case 'min':
                case 'mins':
                case 'minute':
                case 'minutes':
                    this.ri += amount
                    break
                case 'hour':
                case 'hours':
                    this.rh += amount
                    break
                case 'day':
                case 'days':
                    this.rd += amount
                    break
                case 'fortnight':
                case 'fortnights':
                case 'forthnight':
                case 'forthnights':
                    this.rd += amount * 14
                    break
                case 'week':
                case 'weeks':
                    this.rd += amount * 7
                    break
                case 'month':
                case 'months':
                    this.rm += amount
                    break
                case 'year':
                case 'years':
                    this.ry += amount
                    break
                case 'mon': case 'monday':
                case 'tue': case 'tuesday':
                case 'wed': case 'wednesday':
                case 'thu': case 'thursday':
                case 'fri': case 'friday':
                case 'sat': case 'saturday':
                case 'sun': case 'sunday':
                    this.resetTime()
                    this.weekday = lookupWeekday(relUnit, 7)
                    this.weekdayBehavior = 1
                    this.rd += (amount > 0 ? amount - 1 : amount) * 7
                    break
                case 'weekday':
                case 'weekdays':
                    // todo
                    break
            }
        }
    },

    relative: {
        regex: RegExp('^([+-]*)[ \\t]*(\\d+)' + reSpaceOpt + '(' + reReltextunit + '|week)', 'i'),
        name: 'relative',
        callback(match, signs, relValue, relUnit) {
            const minuses = signs.replace(/[^-]/g, '').length

            let amount = +relValue * Math.pow(-1, minuses)

            switch (relUnit.toLowerCase()) {
                case 'sec':
                case 'secs':
                case 'second':
                case 'seconds':
                    this.rs += amount
                    break
                case 'min':
                case 'mins':
                case 'minute':
                case 'minutes':
                    this.ri += amount
                    break
                case 'hour':
                case 'hours':
                    this.rh += amount
                    break
                case 'day':
                case 'days':
                    this.rd += amount
                    break
                case 'fortnight':
                case 'fortnights':
                case 'forthnight':
                case 'forthnights':
                    this.rd += amount * 14
                    break
                case 'week':
                case 'weeks':
                    this.rd += amount * 7
                    break
                case 'month':
                case 'months':
                    this.rm += amount
                    break
                case 'year':
                case 'years':
                    this.ry += amount
                    break
                case 'mon': case 'monday':
                case 'tue': case 'tuesday':
                case 'wed': case 'wednesday':
                case 'thu': case 'thursday':
                case 'fri': case 'friday':
                case 'sat': case 'saturday':
                case 'sun': case 'sunday':
                    this.resetTime()
                    this.weekday = lookupWeekday(relUnit, 7)
                    this.weekdayBehavior = 1
                    this.rd += (amount > 0 ? amount - 1 : amount) * 7
                    break
                case 'weekday':
                case 'weekdays':
                    // todo
                    break
            }
        }
    },

    dayText: {
        regex: RegExp('^(' + reDaytext + ')', 'i'),
        name: 'daytext',
        callback(match, dayText) {
            this.resetTime()
            this.weekday = lookupWeekday(dayText, 0)

            if (this.weekdayBehavior !== 2) {
                this.weekdayBehavior = 1
            }
        }
    },

    relativeTextWeek: {
        regex: RegExp('^(' + reReltexttext + ')' + reSpace + 'week', 'i'),
        name: 'relativetextweek',
        callback(match, relText) {
            this.weekdayBehavior = 2

            switch (relText.toLowerCase()) {
                case 'this':
                    this.rd += 0
                    break
                case 'next':
                    this.rd += 7
                    break
                case 'last':
                case 'previous':
                    this.rd -= 7
                    break
            }

            if (isNaN(this.weekday)) {
                this.weekday = 1
            }
        }
    },

    monthFullOrMonthAbbr: {
        regex: RegExp('^(' + reMonthFull + '|' + reMonthAbbr + ')', 'i'),
        name: 'monthfull | monthabbr',
        callback(match, month) {
            return this.ymd(this.y, lookupMonth(month), this.d)
        }
    },

    tzCorrection: {
        regex: RegExp('^' + reTzCorrection, 'i'),
        name: 'tzcorrection',
        callback(tzCorrection) {
            return this.zone(processTzCorrection(tzCorrection))
        }
    },

    ago: {
        regex: /^ago/i,
        name: 'ago',
        callback() {
            this.ry = -this.ry
            this.rm = -this.rm
            this.rd = -this.rd
            this.rh = -this.rh
            this.ri = -this.ri
            this.rs = -this.rs
            this.rf = -this.rf
        }
    },

    gnuNoColon2: {
        // second instance of gnunocolon, without leading 't'
        // it's down here, because it is very generic (4 digits in a row)
        // thus conflicts with many rules above
        // only year4 should come afterwards
        regex: RegExp('^' + reHour24lz + reMinutelz, 'i'),
        name: 'gnunocolon',
        callback(match, hour, minute) {
            return this.time(+hour, +minute, 0, this.f)
        }
    },

    year4: {
        regex: RegExp('^' + reYear4),
        name: 'year4',
        callback(match, year) {
            this.y = +year
            return true
        }
    },

    whitespace: {
        regex: /^[ .,\t]+/,
        name: 'whitespace'
        // do nothing
    },

    any: {
        regex: /^[\s\S]+/,
        name: 'any',
        callback() {
            return false
        }
    }
}

let resultProto = {
    // date
    y: NaN,
    m: NaN,
    d: NaN,
    // time
    h: NaN,
    i: NaN,
    s: NaN,
    f: NaN,

    // relative shifts
    ry: 0,
    rm: 0,
    rd: 0,
    rh: 0,
    ri: 0,
    rs: 0,
    rf: 0,

    // weekday related shifts
    weekday: NaN,
    weekdayBehavior: 0,

    // first or last day of month
    // 0 none, 1 first, -1 last
    firstOrLastDayOfMonth: 0,

    // timezone correction in minutes
    z: NaN,

    // counters
    dates: 0,
    times: 0,
    zones: 0,

    // helper functions
    ymd(y, m, d) {
        if (this.dates > 0) {
            return false
        }

        this.dates++
        this.y = y
        this.m = m
        this.d = d
        return true
    },

    time(h, i, s, f) {
        if (this.times > 0) {
            return false
        }

        this.times++
        this.h = h
        this.i = i
        this.s = s
        this.f = f

        return true
    },

    resetTime() {
        this.h = 0
        this.i = 0
        this.s = 0
        this.f = 0
        this.times = 0

        return true
    },

    zone(minutes) {
        if (this.zones <= 1) {
            this.zones++
            this.z = minutes
            return true
        }

        return false
    },

    toDate(relativeTo) {
        if (this.dates && !this.times) {
            this.h = this.i = this.s = this.f = 0
        }

        // fill holes
        if (isNaN(this.y)) {
            this.y = relativeTo.getFullYear()
        }

        if (isNaN(this.m)) {
            this.m = relativeTo.getMonth()
        }

        if (isNaN(this.d)) {
            this.d = relativeTo.getDate()
        }

        if (isNaN(this.h)) {
            this.h = relativeTo.getHours()
        }

        if (isNaN(this.i)) {
            this.i = relativeTo.getMinutes()
        }

        if (isNaN(this.s)) {
            this.s = relativeTo.getSeconds()
        }

        if (isNaN(this.f)) {
            this.f = relativeTo.getMilliseconds()
        }

        // adjust special early
        switch (this.firstOrLastDayOfMonth) {
            case 1:
                this.d = 1
                break
            case -1:
                this.d = 0
                this.m += 1
                break
        }

        if (!isNaN(this.weekday)) {
            var date = new Date(relativeTo.getTime())
            date.setFullYear(this.y, this.m, this.d)
            date.setHours(this.h, this.i, this.s, this.f)

            var dow = date.getDay()

            if (this.weekdayBehavior === 2) {
                // To make "this week" work, where the current day of week is a "sunday"
                if (dow === 0 && this.weekday !== 0) {
                    this.weekday = -6
                }

                // To make "sunday this week" work, where the current day of week is not a "sunday"
                if (this.weekday === 0 && dow !== 0) {
                    this.weekday = 7
                }

                this.d -= dow
                this.d += this.weekday
            } else {
                var diff = this.weekday - dow

                // some PHP magic
                if ((this.rd < 0 && diff < 0) || (this.rd >= 0 && diff <= -this.weekdayBehavior)) {
                    diff += 7
                }

                if (this.weekday >= 0) {
                    this.d += diff
                } else {
                    this.d -= (7 - (Math.abs(this.weekday) - dow))
                }

                this.weekday = NaN
            }
        }

        // adjust relative
        this.y += this.ry
        this.m += this.rm
        this.d += this.rd

        this.h += this.rh
        this.i += this.ri
        this.s += this.rs
        this.f += this.rf

        this.ry = this.rm = this.rd = 0
        this.rh = this.ri = this.rs = this.rf = 0

        let result = new Date(relativeTo.getTime())
        // since Date constructor treats years <= 99 as 1900+
        // it can't be used, thus this weird way
        result.setFullYear(this.y, this.m, this.d)
        result.setHours(this.h, this.i, this.s, this.f)

        // note: this is done twice in PHP
        // early when processing special relatives
        // and late
        // todo: check if the logic can be reduced
        // to just one time action
        switch (this.firstOrLastDayOfMonth) {
            case 1:
                result.setDate(1)
                break
            case -1:
                result.setMonth(result.getMonth() + 1, 0)
                break
        }

        // adjust timezone
        if (!isNaN(this.z) && result.getTimezoneOffset() !== this.z) {
            result.setUTCFullYear(
                result.getFullYear(),
                result.getMonth(),
                result.getDate())

            result.setUTCHours(
                result.getHours(),
                result.getMinutes() + this.z,
                result.getSeconds(),
                result.getMilliseconds())
        }

        return result
    }
}

exports.strtotime = function (str, now) {
    //       discuss at: http://locutus.io/php/strtotime/
    //      original by: Caio Ariede (http://caioariede.com)
    //      improved by: Kevin van Zonneveld (http://kvz.io)
    //      improved by: Caio Ariede (http://caioariede.com)
    //      improved by: A. Matías Quezada (http://amatiasq.com)
    //      improved by: preuter
    //      improved by: Brett Zamir (http://brett-zamir.me)
    //      improved by: Mirko Faber
    //         input by: David
    //      bugfixed by: Wagner B. Soares
    //      bugfixed by: Artur Tchernychev
    //      bugfixed by: Stephan Bösch-Plepelits (http://github.com/plepe)
    // reimplemented by: Rafał Kukawski
    //           note 1: Examples all have a fixed timestamp to prevent
    //           note 1: tests to fail because of variable time(zones)
    //        example 1: strtotime('+1 day', 1129633200)
    //        returns 1: 1129719600
    //        example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200)
    //        returns 2: 1130425202
    //        example 3: strtotime('last month', 1129633200)
    //        returns 3: 1127041200
    //        example 4: strtotime('2009-05-04 08:30:00+00')
    //        returns 4: 1241425800
    //        example 5: strtotime('2009-05-04 08:30:00+02:00')
    //        returns 5: 1241418600
    if (now == null) {
        now = Math.floor(Date.now() / 1000)
    }

    // the rule order is very fragile
    // as many formats are similar to others
    // so small change can cause
    // input misinterpretation
    const rules = [
        formats.yesterday,
        formats.now,
        formats.noon,
        formats.midnightOrToday,
        formats.tomorrow,
        formats.timestamp,
        formats.firstOrLastDay,
        formats.backOrFrontOf,
        // formats.weekdayOf, // not yet implemented
        formats.mssqltime,
        formats.timeLong12,
        formats.timeShort12,
        formats.timeTiny12,
        formats.soap,
        formats.wddx,
        formats.exif,
        formats.xmlRpc,
        formats.xmlRpcNoColon,
        formats.clf,
        formats.iso8601long,
        formats.dateTextual,
        formats.pointedDate4,
        formats.pointedDate2,
        formats.timeLong24,
        formats.dateNoColon,
        formats.pgydotd,
        formats.timeShort24,
        formats.iso8601noColon,
        // iso8601dateSlash needs to come before dateSlash
        formats.iso8601dateSlash,
        formats.dateSlash,
        formats.american,
        formats.americanShort,
        formats.gnuDateShortOrIso8601date2,
        formats.iso8601date4,
        formats.gnuNoColon,
        formats.gnuDateShorter,
        formats.pgTextReverse,
        formats.dateFull,
        formats.dateNoDay,
        formats.dateNoDayRev,
        formats.pgTextShort,
        formats.dateNoYear,
        formats.dateNoYearRev,
        formats.isoWeekDay,
        formats.relativeText,
        formats.relative,
        formats.dayText,
        formats.relativeTextWeek,
        formats.monthFullOrMonthAbbr,
        formats.tzCorrection,
        formats.ago,
        formats.gnuNoColon2,
        formats.year4,
        // note: the two rules below
        // should always come last
        formats.whitespace,
        formats.any
    ]

    let result = Object.create(resultProto)

    while (str.length) {
        for (let i = 0, l = rules.length; i < l; i++) {
            const format = rules[i]

            const match = str.match(format.regex)

            if (match) {
                // care only about false results. Ignore other values
                if (format.callback && format.callback.apply(result, match) === false) {
                    return false
                }

                str = str.substr(match[0].length)
                break
            }
        }
    }

    return Math.floor(result.toDate(new Date(now * 1000)) / 1000)
}
exports.version_compare = function (v1, v2, operator) { // eslint-disable-line camelcase
    //       discuss at: http://locutus.io/php/version_compare/
    //      original by: Philippe Jausions (http://pear.php.net/user/jausions)
    //      original by: Aidan Lister (http://aidanlister.com/)
    // reimplemented by: Kankrelune (http://www.webfaktory.info/)
    //      improved by: Brett Zamir (http://brett-zamir.me)
    //      improved by: Scott Baker
    //      improved by: Theriault (https://github.com/Theriault)
    //        example 1: version_compare('8.2.5rc', '8.2.5a')
    //        returns 1: 1
    //        example 2: version_compare('8.2.50', '8.2.52', '<')
    //        returns 2: true
    //        example 3: version_compare('5.3.0-dev', '5.3.0')
    //        returns 3: -1
    //        example 4: version_compare('4.1.0.52','4.01.0.51')
    //        returns 4: 1

    // Important: compare must be initialized at 0.
    var i
    var x
    var compare = 0

    // vm maps textual PHP versions to negatives so they're less than 0.
    // PHP currently defines these as CASE-SENSITIVE. It is important to
    // leave these as negatives so that they can come before numerical versions
    // and as if no letters were there to begin with.
    // (1alpha is < 1 and < 1.1 but > 1dev1)
    // If a non-numerical value can't be mapped to this table, it receives
    // -7 as its value.
    var vm = {
        'dev': -6,
        'alpha': -5,
        'a': -5,
        'beta': -4,
        'b': -4,
        'RC': -3,
        'rc': -3,
        '#': -2,
        'p': 1,
        'pl': 1
    }

    // This function will be called to prepare each version argument.
    // It replaces every _, -, and + with a dot.
    // It surrounds any nonsequence of numbers/dots with dots.
    // It replaces sequences of dots with a single dot.
    //    version_compare('4..0', '4.0') === 0
    // Important: A string of 0 length needs to be converted into a value
    // even less than an unexisting value in vm (-7), hence [-8].
    // It's also important to not strip spaces because of this.
    //   version_compare('', ' ') === 1
    var _prepVersion = function (v) {
        v = ('' + v).replace(/[_\-+]/g, '.')
        v = v.replace(/([^.\d]+)/g, '.$1.').replace(/\.{2,}/g, '.')
        return (!v.length ? [-8] : v.split('.'))
    }
    // This converts a version component to a number.
    // Empty component becomes 0.
    // Non-numerical component becomes a negative number.
    // Numerical component becomes itself as an integer.
    var _numVersion = function (v) {
        return !v ? 0 : (isNaN(v) ? vm[v] || -7 : parseInt(v, 10))
    }

    v1 = _prepVersion(v1)
    v2 = _prepVersion(v2)
    x = Math.max(v1.length, v2.length)
    for (i = 0; i < x; i++) {
        if (v1[i] === v2[i]) {
            continue
        }
        v1[i] = _numVersion(v1[i])
        v2[i] = _numVersion(v2[i])
        if (v1[i] < v2[i]) {
            compare = -1
            break
        } else if (v1[i] > v2[i]) {
            compare = 1
            break
        }
    }
    if (!operator) {
        return compare
    }

    // Important: operator is CASE-SENSITIVE.
    // "No operator" seems to be treated as "<."
    // Any other values seem to make the function return null.
    switch (operator) {
        case '>':
        case 'gt':
            return (compare > 0)
        case '>=':
        case 'ge':
            return (compare >= 0)
        case '<=':
        case 'le':
            return (compare <= 0)
        case '===':
        case '=':
        case 'eq':
            return (compare === 0)
        case '<>':
        case '!==':
        case 'ne':
            return (compare !== 0)
        case '':
        case '<':
        case 'lt':
            return (compare < 0)
        default:
            return null
    }
}
exports.mt_rand = function (min, max) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/mt_rand/
    // original by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //    input by: Kongo
    //   example 1: mt_rand(1, 1)
    //   returns 1: 1

    var argc = arguments.length
    if (argc === 0) {
        min = 0
        max = 2147483647
    } else if (argc === 1) {
        throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given')
    } else {
        min = parseInt(min, 10)
        max = parseInt(max, 10)
    }
    return Math.floor(Math.random() * (max - min + 1)) + min
}
exports.time = function () {
    //  discuss at: http://locutus.io/php/time/
    // original by: GeekFG (http://geekfg.blogspot.com)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: metjay
    // improved by: HKM
    //   example 1: var $timeStamp = time()
    //   example 1: var $result = $timeStamp > 1000000000 && $timeStamp < 2000000000
    //   returns 1: true

    return Math.floor(new Date().getTime() / 1000)
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
exports.intval = function (mixedVar, base) {
    //  discuss at: http://locutus.io/php/intval/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: stensi
    // bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Rafał Kukawski (http://blog.kukawski.pl)
    //    input by: Matteo
    //   example 1: intval('Kevin van Zonneveld')
    //   returns 1: 0
    //   example 2: intval(4.2)
    //   returns 2: 4
    //   example 3: intval(42, 8)
    //   returns 3: 42
    //   example 4: intval('09')
    //   returns 4: 9
    //   example 5: intval('1e', 16)
    //   returns 5: 30
    //   example 6: intval(0x200000001)
    //   returns 6: 8589934593
    //   example 7: intval('0xff', 0)
    //   returns 7: 255
    //   example 8: intval('010', 0)
    //   returns 8: 8

    var tmp, match

    var type = typeof mixedVar

    if (type === 'boolean') {
        return +mixedVar
    } else if (type === 'string') {
        if (base === 0) {
            match = mixedVar.match(/^\s*0(x?)/i)
            base = match ? (match[1] ? 16 : 8) : 10
        }
        tmp = parseInt(mixedVar, base || 10)
        return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp
    } else if (type === 'number' && isFinite(mixedVar)) {
        return mixedVar < 0 ? Math.ceil(mixedVar) : Math.floor(mixedVar)
    } else {
        return 0
    }
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

exports.unserialize = function (data) {
    //  discuss at: http://locutus.io/php/unserialize/
    // original by: Arpad Ray (mailto:arpad@php.net)
    // improved by: Pedro Tainha (http://www.pedrotainha.com)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Chris
    // improved by: James
    // improved by: Le Torbi
    // improved by: Eli Skeggs
    // bugfixed by: dptr1988
    // bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: philippsimon (https://github.com/philippsimon/)
    //  revised by: d3x
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: Martin (http://www.erlenwiese.de/)
    //    input by: kilops
    //    input by: Jaroslaw Czarniak
    //    input by: lovasoa (https://github.com/lovasoa/)
    //      note 1: We feel the main purpose of this function should be
    //      note 1: to ease the transport of data between php & js
    //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
    //   example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}')
    //   returns 1: ['Kevin', 'van', 'Zonneveld']
    //   example 2: unserialize('a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}')
    //   returns 2: {firstName: 'Kevin', midName: 'van'}
    //   example 3: unserialize('a:3:{s:2:"ü";s:2:"ü";s:3:"四";s:3:"四";s:4:"𠜎";s:4:"𠜎";}')
    //   returns 3: {'ü': 'ü', '四': '四', '𠜎': '𠜎'}

    var $global = (typeof window !== 'undefined' ? window : global)

    var utf8Overhead = function (str) {
        var s = str.length
        for (var i = str.length - 1; i >= 0; i--) {
            var code = str.charCodeAt(i)
            if (code > 0x7f && code <= 0x7ff) {
                s++
            } else if (code > 0x7ff && code <= 0xffff) {
                s += 2
            }
            // trail surrogate
            if (code >= 0xDC00 && code <= 0xDFFF) {
                i--
            }
        }
        return s - 1
    }
    var error = function (type,
        msg, filename, line) {
        throw new $global[type](msg, filename, line)
    }
    var readUntil = function (data, offset, stopchr) {
        var i = 2
        var buf = []
        var chr = data.slice(offset, offset + 1)

        while (chr !== stopchr) {
            if ((i + offset) > data.length) {
                error('Error', 'Invalid')
            }
            buf.push(chr)
            chr = data.slice(offset + (i - 1), offset + i)
            i += 1
        }
        return [buf.length, buf.join('')]
    }
    var readChrs = function (data, offset, length) {
        var i, chr, buf

        buf = []
        for (i = 0; i < length; i++) {
            chr = data.slice(offset + (i - 1), offset + i)
            buf.push(chr)
            length -= utf8Overhead(chr)
        }
        return [buf.length, buf.join('')]
    }
    function _unserialize(data, offset) {
        var dtype
        var dataoffset
        var keyandchrs
        var keys
        var contig
        var length
        var array
        var readdata
        var readData
        var ccount
        var stringlength
        var i
        var key
        var kprops
        var kchrs
        var vprops
        var vchrs
        var value
        var chrs = 0
        var typeconvert = function (x) {
            return x
        }

        if (!offset) {
            offset = 0
        }
        dtype = (data.slice(offset, offset + 1)).toLowerCase()

        dataoffset = offset + 2

        switch (dtype) {
            case 'i':
                typeconvert = function (x) {
                    return parseInt(x, 10)
                }
                readData = readUntil(data, dataoffset, ';')
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 1
                break
            case 'b':
                typeconvert = function (x) {
                    return parseInt(x, 10) !== 0
                }
                readData = readUntil(data, dataoffset, ';')
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 1
                break
            case 'd':
                typeconvert = function (x) {
                    return parseFloat(x)
                }
                readData = readUntil(data, dataoffset, ';')
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 1
                break
            case 'n':
                readdata = null
                break
            case 's':
                ccount = readUntil(data, dataoffset, ':')
                chrs = ccount[0]
                stringlength = ccount[1]
                dataoffset += chrs + 2

                readData = readChrs(data, dataoffset + 1, parseInt(stringlength, 10))
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 2
                if (chrs !== parseInt(stringlength, 10) && chrs !== readdata.length) {
                    error('SyntaxError', 'String length mismatch')
                }
                break
            case 'a':
                readdata = {}

                keyandchrs = readUntil(data, dataoffset, ':')
                chrs = keyandchrs[0]
                keys = keyandchrs[1]
                dataoffset += chrs + 2

                length = parseInt(keys, 10)
                contig = true

                for (i = 0; i < length; i++) {
                    kprops = _unserialize(data, dataoffset)
                    kchrs = kprops[1]
                    key = kprops[2]
                    dataoffset += kchrs

                    vprops = _unserialize(data, dataoffset)
                    vchrs = vprops[1]
                    value = vprops[2]
                    dataoffset += vchrs

                    if (key !== i) {
                        contig = false
                    }

                    readdata[key] = value
                }

                if (contig) {
                    array = new Array(length)
                    for (i = 0; i < length; i++) {
                        array[i] = readdata[i]
                    }
                    readdata = array
                }

                dataoffset += 1
                break
            default:
                error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype)
                break
        }
        return [dtype, dataoffset - offset, typeconvert(readdata)]
    }

    return _unserialize((data + ''), 0)[2]
}
exports.serialize = function (mixedValue) {
    //  discuss at: http://locutus.io/php/serialize/
    // original by: Arpad Ray (mailto:arpad@php.net)
    // improved by: Dino
    // improved by: Le Torbi (http://www.letorbi.de/)
    // improved by: Kevin van Zonneveld (http://kvz.io/)
    // bugfixed by: Andrej Pavlovic
    // bugfixed by: Garagoth
    // bugfixed by: Russell Walker (http://www.nbill.co.uk/)
    // bugfixed by: Jamie Beck (http://www.terabit.ca/)
    // bugfixed by: Kevin van Zonneveld (http://kvz.io/)
    // bugfixed by: Ben (http://benblume.co.uk/)
    // bugfixed by: Codestar (http://codestarlive.com/)
    // bugfixed by: idjem (https://github.com/idjem)
    //    input by: DtTvB (http://dt.in.th/2008-09-16.string-length-in-bytes.html)
    //    input by: Martin (http://www.erlenwiese.de/)
    //      note 1: We feel the main purpose of this function should be to ease
    //      note 1: the transport of data between php & js
    //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
    //   example 1: serialize(['Kevin', 'van', 'Zonneveld'])
    //   returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
    //   example 2: serialize({firstName: 'Kevin', midName: 'van'})
    //   returns 2: 'a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}'
    //   example 3: serialize( {'ü': 'ü', '四': '四', '𠜎': '𠜎'})
    //   returns 3: 'a:3:{s:2:"ü";s:2:"ü";s:3:"四";s:3:"四";s:4:"𠜎";s:4:"𠜎";}'

    var val, key, okey
    var ktype = ''
    var vals = ''
    var count = 0

    var _utf8Size = function (str) {
        return ~-encodeURI(str).split(/%..|./).length
    }

    var _getType = function (inp) {
        var match
        var key
        var cons
        var types
        var type = typeof inp

        if (type === 'object' && !inp) {
            return 'null'
        }

        if (type === 'object') {
            if (!inp.constructor) {
                return 'object'
            }
            cons = inp.constructor.toString()
            match = cons.match(/(\w+)\(/)
            if (match) {
                cons = match[1].toLowerCase()
            }
            types = ['boolean', 'number', 'string', 'array']
            for (key in types) {
                if (cons === types[key]) {
                    type = types[key]
                    break
                }
            }
        }
        return type
    }

    var type = _getType(mixedValue)

    switch (type) {
        case 'function':
            val = ''
            break
        case 'boolean':
            val = 'b:' + (mixedValue ? '1' : '0')
            break
        case 'number':
            val = (Math.round(mixedValue) === mixedValue ? 'i' : 'd') + ':' + mixedValue
            break
        case 'string':
            val = 's:' + _utf8Size(mixedValue) + ':"' + mixedValue + '"'
            break
        case 'array':
        case 'object':
            val = 'a'
            /*
            if (type === 'object') {
              var objname = mixedValue.constructor.toString().match(/(\w+)\(\)/);
              if (objname === undefined) {
                return;
              }
              objname[1] = serialize(objname[1]);
              val = 'O' + objname[1].substring(1, objname[1].length - 1);
            }
            */

            for (key in mixedValue) {
                if (mixedValue.hasOwnProperty(key)) {
                    ktype = _getType(mixedValue[key])
                    if (ktype === 'function') {
                        continue
                    }

                    okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key)
                    vals += serialize(okey) + serialize(mixedValue[key])
                    count++
                }
            }
            val += ':' + count + ':{' + vals + '}'
            break
        case 'undefined':
        default:
            // Fall-through
            // if the JS object has a property which contains a null value,
            // the string cannot be unserialized by PHP
            val = 'N'
            break
    }
    if (type !== 'object' && type !== 'array') {
        val += ';'
    }

    return val
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
exports.explode = function (delimiter, string, limit) {
    //  discuss at: http://locutus.io/php/explode/
    // original by: Kevin van Zonneveld (http://kvz.io)
    //   example 1: explode(' ', 'Kevin van Zonneveld')
    //   returns 1: [ 'Kevin', 'van', 'Zonneveld' ]

    if (arguments.length < 2 ||
        typeof delimiter === 'undefined' ||
        typeof string === 'undefined') {
        return null
    }
    if (delimiter === '' ||
        delimiter === false ||
        delimiter === null) {
        return false
    }
    if (typeof delimiter === 'function' ||
        typeof delimiter === 'object' ||
        typeof string === 'function' ||
        typeof string === 'object') {
        return {
            0: ''
        }
    }
    if (delimiter === true) {
        delimiter = '1'
    }

    // Here we go...
    delimiter += ''
    string += ''

    var s = string.split(delimiter)

    if (typeof limit === 'undefined') return s

    // Support for limit
    if (limit === 0) limit = 1

    // Positive limit
    if (limit > 0) {
        if (limit >= s.length) {
            return s
        }
        return s
            .slice(0, limit - 1)
            .concat([s.slice(limit - 1)
                .join(delimiter)
            ])
    }

    // Negative limit
    if (-limit >= s.length) {
        return []
    }

    s.splice(s.length + limit)
    return s
}
exports.implode = function (glue, pieces) {
    //  discuss at: http://locutus.io/php/implode/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Waldo Malqui Silva (http://waldo.malqui.info)
    // improved by: Itsacon (http://www.itsacon.net/)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: implode(' ', ['Kevin', 'van', 'Zonneveld'])
    //   returns 1: 'Kevin van Zonneveld'
    //   example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'})
    //   returns 2: 'Kevin van Zonneveld'

    var i = ''
    var retVal = ''
    var tGlue = ''

    if (arguments.length === 1) {
        pieces = glue
        glue = ''
    }

    if (typeof pieces === 'object') {
        if (Object.prototype.toString.call(pieces) === '[object Array]') {
            return pieces.join(glue)
        }
        for (i in pieces) {
            retVal += tGlue + pieces[i]
            tGlue = glue
        }
        return retVal
    }

    return pieces
}