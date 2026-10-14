#!/usr/bin/env node
/**
 * Records how Node's `new Date(string)` and moment 2.29 parse and manipulate dates, for the Java
 * port in java/satpam-core/src/main/java/com/cermati/satpam/internal/date/. Writes
 * java/satpam-core/src/test/resources/date-cases.json, which DateParityTest replays. Run from the
 * satpam repo root:
 *
 *   node java/scripts/record-date-cases.js
 *
 * Every scenario fixes Date.now() and process.env.TZ, like fixture-runner.js.
 */
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { withClock } = require('./fixture-runner');

moment.suppressDeprecationWarnings = true;

const OUT = path.join(__dirname, '../satpam-core/src/test/resources/date-cases.json');

const SCENARIOS = [
  { now: '2024-03-15T03:30:45.123Z', timeZone: 'Asia/Jakarta' },
  { now: '2024-11-03T05:59:59.999Z', timeZone: 'America/New_York' },
  { now: '2000-02-29T23:00:00.000Z', timeZone: 'UTC' }
];

const DATE_STRINGS = [
  // ES5 ISO and near misses
  '2020', '2020-01', '2020-01-02', '2020-1-2', '2020-13-01', '2020-02-30', '2020-01-02T03:04', '2020-01-02T03:04:05',
  '2020-01-02T03:04:05.6', '2020-01-02T03:04:05.678', '2020-01-02T03:04:05.6789', '2020-01-02T03:04:05Z',
  '2020-01-02T03:04:05.678Z', '2020-01-02T03:04:05+07:00', '2020-01-02T03:04:05-0130', '2020-01-02T03:04:05+7',
  '2020-01-02T24:00', '2020-01-02T24:00:01', '2020-01-02T25:00', '2020-01-02t03:04', '2020-01-02 03:04',
  '2020-01-02T03:04:05 Z', '+002020-01-02', '-002020-01-02', '-000000-01-01', '+275760-09-13T00:00:00Z',
  '+275760-09-13T00:00:00.001Z', '0099-01-01', '0000-01-01', '20200102', '20200102T030405', '2020-W01',
  '2020-W01-3', '2020-123', '2020123', '2020-01-02T03', '2020-01-02T0304', '2020-01-02T030405,5',
  // RFC 2822 and legacy formats
  'Thu, 02 Jan 2020 03:04:05 GMT', 'Fri, 02 Jan 2020 03:04:05 GMT', '02 Jan 2020 03:04 +0700', '2 Jan 20 03:04 EST',
  '02 Jan 2020 03:04:05 (comment) PST', 'Jan 2 2020', 'Jan 2, 2020 10:00 AM', 'January 2, 2020 10:00 PM',
  '2 January 2020', '2020 Jan 2', 'Thursday, January 2, 2020', '1/2/2020', '01/02/2020 03:04:05',
  '2020/01/02', '2020/1/2 3:4:5', '1-2-2020', '2/1/20', '12/31/99', '12/31/50', '12/31/49', '13/01/2020',
  '1.2.2020', 'Jan 2 2020 10:00 GMT+0700', 'Jan 2 2020 10:00 GMT+07:00', 'Jan 2 2020 10:00 UTC+7',
  'Jan 2 2020 10:00 +0700 (WIB)', 'Jan 2 2020 10:00:00.123', 'Jan 2 2020 10:00:00.1234567', 'Jan 2 2020 12:00 am',
  'Jan 2 2020 12:30 pm', 'Jan 2 2020 13:00 pm', 'Jan 2 2020 24:00', 'Jan 2 2020 10::', 'Jan 2 2020 10:00z',
  'Jan 2 2020 T10:00', 'foo Jan 2 2020', 'Jan 2 2020 foo', 'Janx 2 2020', 'Ja 2 2020', '2020 2 Jan', '2 2020 Jan',
  'Jan 32 2020', 'Feb 30 2020', 'Dec 31 1969 23:59:59.999 GMT', '1970', '99', '100', '12345', '1700000000000',
  '0', '-1', 'Mon Jan 01 2024 00:00:00 GMT+0700 (Western Indonesia Time)', 'Sun Mar 10 2024 02:30:00',
  'Nov 3 2024 01:30:00', 'Mar 10 2024 02:30:00 EST', '(Jan) 2 2020', '2020-01-02(x)', '2020-01-02)', ')2020',
  '+2020', 'Jan 2 2020 +', 'Jan 2 2020 10:00 +', 'Jan 2 2020 10:00 GMT+12345', 'Jan\u00a02\u00a02020',
  'Jan\u20282\u20282020', 'Jan\n2\n2020', '\u30002020-01-02', ' 2020-01-02 ', '2020-01-02\u0000junk', 'today',
  'now', '', ' ', 'abc', 'Invalid Date', 'NaN', 'true', 'null', 'undefined', '[object Object]', '1,2', '2020,1,2',
  '/Date(1577934245000)/', 'Date(-5)', '15-03-2024', '15/03/2024', '2024-03-15 10:20:30', '10:20', '10:20:30',
  '1:2:3', '3/15/2024 10:20:30 PM', '15 Mar 2024', '15 March 2024 10:20', '15-Mar-2024', 'Mar-15-2024', '15Mar2024',
  '15th March 2024', 'March 15th, 2024', 'Fri Mar 15 2024', '2024-03-15T10:20:30.123+07:00', '1st', '31st',
  '1999-12-31T23:59:59.999', '2024-02-29', '2023-02-29', '1900-02-29', '2000-02-29'
];

const FORMATS = [
  'YYYY-MM-DD', 'DD-MM-YYYY', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ssZ',
  'YYYY-MM-DDTHH:mm:ss.SSSZ', 'D MMM YYYY', 'D MMMM YYYY', 'Do MMMM YYYY', 'MMMM Do, YYYY', 'DD-MMM-YYYY',
  'DDMMYYYY', 'YYYYMMDD', 'YY-MM-DD', 'DD-MM-YY', 'HH:mm', 'HH:mm:ss', 'h:mm A', 'hh:mm a', 'X', 'x', 'YYYY',
  'MM', 'DDD', 'YYYY-DDD', 'ddd, DD MMM YYYY', 'dddd', 'E', 'GGGG-[W]WW-E', 'gggg-ww-e', 'w', 'Q YYYY', 'L', 'LL',
  'LLL', 'l', 'LT', '[Year] YYYY', 'YYYY [at] HH', 'YYYYY-MM-DD', 'Y', 'k:mm', 'Hmm', 'hmm A', 'SSS', 'ZZ',
  'YYYY-MM-DD\\THH', 'DD.MM.YYYY', 'YYYY/MM/DD', '[]YYYY', 'MMM', 'DD MM YYYY HH mm ss SSSS', 'zz YYYY'
];

const VALUES = [
  undefined, null, 0, 1577934245000, -1, 8.64e15, 8.64e15 + 1, NaN, 1.5, true, false, [], [2020], [2020, 0, 2],
  [2020, 1, 30], [2020, '1', '2', '3', '4', '5', '6'], [2020, 12], [99, 0, 1], [-5, 0, 1], [2020, 0, 1, 24],
  [2020, 0, 1, 24, 1], ['abc'], [null], [[2020]], {}, { year: 2020 }, { y: 2020, M: 1, d: 3 },
  { year: 2020, month: 1, day: 30 }, { year: 2020, date: 3, hours: 4 }, { years: '2020', months: '0', days: 0 },
  { year: 0, month: 0 }, { year: '', month: false }, { year: 2020, day: null, date: 4 }, { foo: 1 },
  { year: 2020, millisecond: 1500 }, '2020-01-02', 'Jan 2 2020'
];

const ADD_UNITS = [undefined, 'days', 'd', 'D', 'date', 'months', 'M', 'm', 'y', 'years', 'w', 'weeks', 'W',
  'isoWeek', 'Q', 'h', 'hours', 'minutes', 's', 'ms', 'Days', 'foo', '', '5', 'weekday', 'dayOfYear'];
const START_UNITS = [undefined, 'year', 'quarter', 'month', 'week', 'isoWeek', 'day', 'date', 'hour', 'minute',
  'second', 'millisecond', 'days', 'D', 'weekday', 'isoWeekday', 'dayOfYear', 'weekYear', 'foo'];
const ADD_AMOUNTS = [1, -1, 1.5, -1.5, 0.5, 13, -400, 2.5];
const DIFF_UNITS = ['years', 'months', 'quarters', 'weeks', 'days', 'hours', 'minutes', 'seconds', undefined, 'foo'];

const BASES = ['2020-01-31T10:20:30.400', '2020-02-29T00:00:00', '2024-03-10T01:30:00', '2024-11-03T01:30:00',
  '1999-12-31T23:59:59.999', '0050-06-15T12:00:00', '1965-08-17T07:00:00', '2024-03-15T03:30:45.123Z'];

const ms = m => (m.isValid() ? m.valueOf() : null);
const num = v => (typeof v === 'number' && !Number.isFinite(v) ? null : v);

const record = scenario => withClock(scenario, () => Object.assign({}, scenario, {
  dateParse: DATE_STRINGS.map(s => num(new Date(s).getTime())),
  momentString: DATE_STRINGS.map(s => ms(moment(s))),
  momentValue: VALUES.map(v => ms(moment(v))),
  momentFormat: FORMATS.map(f => DATE_STRINGS.map(s => ms(moment(s, f)))),
  momentStrict: FORMATS.map(f => DATE_STRINGS.map(s => ms(moment(s, f, true)))),
  momentValueFormat: FORMATS.map(f => VALUES.map(v => ms(moment(v, f)))),
  momentArrayFormat: [
    [['DD-MM-YYYY', 'YYYY-MM-DD'], DATE_STRINGS.map(s => ms(moment(s, ['DD-MM-YYYY', 'YYYY-MM-DD'])))],
    [['MMMM D, YYYY', 'D MMMM YYYY', 'L'], DATE_STRINGS.map(s => ms(moment(s, ['MMMM D, YYYY', 'D MMMM YYYY', 'L'])))],
    [[], DATE_STRINGS.slice(0, 3).map(s => ms(moment(s, [])))]
  ],
  add: BASES.map(b => ADD_UNITS.map(u => ADD_AMOUNTS.map(n => ms(moment(b).add(n, u))))),
  subtract: BASES.map(b => ADD_UNITS.map(u => ms(moment(b).subtract(3, u)))),
  startOf: BASES.map(b => START_UNITS.map(u => num(moment(b).startOf(u).valueOf()))),
  endOf: BASES.map(b => START_UNITS.map(u => num(moment(b).endOf(u).valueOf()))),
  diff: BASES.map(a => BASES.map(b => DIFF_UNITS.map(u => num(moment(a).diff(moment(b), u))))),
  compare: BASES.map(a => BASES.map(b => START_UNITS.map(u => {
    const x = moment(a);
    const y = moment(b);
    return [x.isAfter(y, u), x.isBefore(y, u), x.isSame(y, u), x.isSameOrAfter(y, u), x.isSameOrBefore(y, u)];
  }))),
  format: BASES.concat(['abc']).map(b => [moment(b).format('DDMMYY'), moment(b).format('YYYY-MM-DD HH:mm:ssZ')]),
  unixAt7: ['0', '1700000000', '-1', '1.5', 'abc', '', '253402300799', '-62198755200'].map(
    s => moment.unix(s).locale('id').utcOffset(7).format('YYYY-MM-DD HH:mm:ssZ'))
}));

const data = {
  dateStrings: DATE_STRINGS,
  formats: FORMATS,
  values: VALUES.map(v => (v === undefined ? { undefined: true } : Number.isNaN(v) ? { nan: true } : { value: v })),
  addUnits: ADD_UNITS.map(u => (u === undefined ? null : u)),
  startUnits: START_UNITS.map(u => (u === undefined ? null : u)),
  addAmounts: ADD_AMOUNTS,
  diffUnits: DIFF_UNITS.map(u => (u === undefined ? null : u)),
  bases: BASES,
  scenarios: SCENARIOS.map(record)
};

fs.writeFileSync(OUT, JSON.stringify(data) + '\n');
console.log(`wrote ${path.relative(process.cwd(), OUT)} (${fs.statSync(OUT).size} bytes)`);
