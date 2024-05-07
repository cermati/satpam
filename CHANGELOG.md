# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.0.0] - 2024-05-07

### Changed features

- BREAKING: Migrate date utilities from previously using moment to now using dayjs to optimize bundle size
  - Previously, parsing an incomplete input date using moment will fill the missing value. dayjs doesn't have this behavior. Considering adding `date-format` validation if your input is not guaranteed to have a valid format.
    ```js
    const dateWithoutSeconds = '2024-05-07T13:00';
    const dateFormatExpectingSeconds = 'YYYY-MM-DDTHH:mm:ss';

    moment(dateWithoutSeconds, dateFormatExpectingSeconds).format()
    > '2024-05-07T13:00:00+07:00'

    dayjs(dateWithoutSeconds, dateFormatExpectingSeconds).format()
    > 'Invalid Date'
    ```
