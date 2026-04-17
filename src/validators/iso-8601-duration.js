/**
 * ISO 8601 duration format
 *
 * ISO 8601 Durations are expressed using the following format, where (n) is
 * replaced by the value for each of the date and time elements that follow the (n):
 *
 * **P(n)Y(n)M(n)DT(n)H(n)M(n)S**
 *
 * Where:
 * *  P is the duration designator (referred to as "period"), and is always placed at the beginning of the duration.
 * *  Y is the year designator that follows the value for the number of years.
 * *  M is the month designator that follows the value for the number of months.
 * *  W is the week designator that follows the value for the number of weeks.
 * *  D is the day designator that follows the value for the number of days.
 * *  T is the time designator that precedes the time components.
 * *  H is the hour designator that follows the value for the number of hours.
 * *  M is the minute designator that follows the value for the number of minutes.
 * *  S is the second designator that follows the value for the number of seconds.
 *
 * For example:
 * * PT10S represents a duration of 10 seconds.
 * * PT15M represents a duration of 15 minutes.
 * * PT2H15M30S represents a duration of 2 hours, 15 minutes, and 30 seconds.
 * * PT0.1S represents a duration of 100 milliseconds.
 * * P3Y6M4DT12H30M5S represents a duration of 3 years, 6 months, 4 days, 12 hours, 30 minutes, and 5 seconds.
 */
import {Duration} from 'luxon';

const fullName = 'iso8601Duration';

const validate = val => {
  if (!val) {
    return true;
  }

  return Duration.fromISO(val).isValid;
};

const message = '<%= propertyName %> must be a valid ISO 8601 duration.';

export default {fullName, validate, message};
