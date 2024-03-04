const fullName = 'internationalPhoneNumber';

// Maximum international mobile phone number length including country code is 15 digits. Source: https://en.wikipedia.org/wiki/E.164
const internationalPhoneNumberRegExp = /^\+?[0-9]{2,15}$/;

/**
 * Source: https://www.iban.com/dialing-codes (country code)
 */
const oneNumPrefixMap = {
  '1': true, // American Samoa, Anguilla, Antigua and Barbuda, Bahamas, Barbados, Bermuda, British Virgin Islands, Canada, Cayman Islands, Dominica, Dominican Rep., Grenada, Guam, Jamaica, Montserrat, Northern Marianas, Puerto Rico, Saint Kitts and Nevis, Saint Lucia, Saint Vincent and the Grenadines, Sint Maarten (Dutch part), Trinidad and Tobago, Turks and Caicos Islands, United States, United States Virgin Islands, and some countries' National Prefixes
  '7': true, // Kazakhstan, Russian Federation
};

const twoNumPrefixMap = {
  '20': true, // Egypt
  '27': true, // South Africa
  '30': true, // Greece
  '31': true, // Netherlands
  '32': true, // Belgium
  '33': true, // France
  '34': true, // Spain
  '36': true, // Hungary
  '39': true, // Italy, Vatican
  '40': true, // Romania
  '41': true, // Switzerland
  '43': true, // Austria
  '44': true, // United Kingdom
  '45': true, // Denmark
  '46': true, // Sweden
  '47': true, // Norway
  '48': true, // Poland
  '49': true, // Germany
  '51': true, // Peru
  '52': true, // Mexico
  '53': true, // Cuba
  '54': true, // Argentina
  '55': true, // Brazil
  '56': true, // Chile
  '57': true, // Colombia
  '58': true, // Venezuela (Bolivarian Republic of)
  '60': true, // Malaysia
  '61': true, // Australia
  '62': true, // Indonesia
  '63': true, // Philippines
  '64': true, // New Zealand
  '65': true, // Singapore
  '66': true, // Thailand
  '81': true, // Japan
  '82': true, // Korea (Rep. of)
  '84': true, // Viet Nam
  '86': true, // China
  '90': true, // Turkey
  '91': true, // India
  '92': true, // Pakistan
  '93': true, // Afghanistan
  '94': true, // Sri Lanka
  '95': true, // Myanmar
  '98': true, // Iran (Islamic Republic of)
};

const threeNumPrefixMap = {
  '211': true, // South Sudan
  '212': true, // Morocco
  '213': true, // Algeria
  '216': true, // Tunisia
  '218': true, // Libya
  '220': true, // Gambia
  '221': true, // Senegal
  '222': true, // Mauritania
  '223': true, // Mali
  '224': true, // Guinea
  '225': true, // Côte d'Ivoire
  '226': true, // Burkina Faso
  '227': true, // Niger
  '228': true, // Togo
  '229': true, // Benin
  '230': true, // Mauritius
  '231': true, // Liberia
  '232': true, // Sierra Leone
  '233': true, // Ghana
  '234': true, // Nigeria
  '235': true, // Chad
  '236': true, // Central African Rep.
  '237': true, // Cameroon
  '238': true, // Cape Verde
  '239': true, // Sao Tome and Principe
  '240': true, // Equatorial Guinea
  '241': true, // Gabon
  '242': true, // Congo
  '243': true, // Dem. Rep. of the Congo
  '244': true, // Angola
  '245': true, // Guinea-Bissau
  '246': true, // Diego Garcia
  '247': true, // Saint Helena, Ascension and Tristan da Cunha
  '248': true, // Seychelles
  '249': true, // Sudan
  '250': true, // Rwanda
  '251': true, // Ethiopia
  '252': true, // Somalia
  '253': true, // Djibouti
  '254': true, // Kenya
  '255': true, // Tanzania
  '256': true, // Uganda
  '257': true, // Burundi
  '258': true, // Mozambique
  '260': true, // Zambia
  '261': true, // Madagascar
  '262': true, // French Dep. and Territories in the Indian Ocean
  '263': true, // Zimbabwe
  '264': true, // Namibia
  '265': true, // Malawi
  '266': true, // Lesotho
  '267': true, // Botswana
  '268': true, // Swaziland
  '269': true, // Comoros
  '290': true, // Saint Helena, Ascension and Tristan da Cunha
  '291': true, // Eritrea
  '297': true, // Aruba
  '298': true, // Faroe Islands
  '299': true, // Greenland
  '350': true, // Gibraltar
  '351': true, // Portugal
  '352': true, // Luxembourg
  '353': true, // Ireland
  '354': true, // Iceland
  '355': true, // Albania
  '356': true, // Malta
  '357': true, // Cyprus
  '358': true, // Finland
  '359': true, // Bulgaria
  '370': true, // Lithuania
  '371': true, // Latvia
  '372': true, // Estonia
  '373': true, // Moldova (Republic of)
  '374': true, // Armenia
  '375': true, // Belarus
  '376': true, // Andorra
  '377': true, // Monaco
  '378': true, // San Marino
  '379': true, // Vatican
  '380': true, // Ukraine
  '381': true, // Serbia
  '382': true, // Montenegro
  '385': true, // Croatia
  '386': true, // Slovenia
  '387': true, // Bosnia and Herzegovina
  '388': true, // Group of countries, shared code
  '389': true, // The Former Yugoslav Republic of Macedonia
  '420': true, // Czech Rep.
  '421': true, // Slovakia
  '423': true, // Liechtenstein
  '500': true, // Falkland Islands (Malvinas)
  '501': true, // Belize
  '502': true, // Guatemala
  '503': true, // El Salvador
  '504': true, // Honduras
  '505': true, // Nicaragua
  '506': true, // Costa Rica
  '507': true, // Panama
  '508': true, // Saint Pierre and Miquelon
  '509': true, // Haiti
  '590': true, // Guadeloupe
  '591': true, // Bolivia (Plurinational State of)
  '592': true, // Guyana
  '593': true, // Ecuador
  '594': true, // French Guiana
  '595': true, // Paraguay
  '596': true, // Martinique
  '597': true, // Suriname
  '598': true, // Uruguay
  '599': true, // Bonaire, Sint Eustatius and Saba, Curaçao
  '670': true, // Timor-Leste
  '672': true, // Australian External Territories
  '673': true, // Brunei Darussalam
  '674': true, // Nauru
  '675': true, // Papua New Guinea
  '676': true, // Tonga
  '677': true, // Solomon Islands
  '678': true, // Vanuatu
  '679': true, // Fiji
  '680': true, // Palau
  '681': true, // Wallis and Futuna
  '682': true, // Cook Islands
  '683': true, // Niue
  '685': true, // Samoa
  '686': true, // Kiribati
  '687': true, // New Caledonia
  '688': true, // Tuvalu
  '689': true, // French Polynesia
  '690': true, // Tokelau
  '691': true, // Micronesia
  '692': true, // Marshall Islands
  '800': true, // International Freephone Service
  '808': true, // International Shared Cost Service (ISCS)
  '850': true, // Dem. People's Rep. of Korea
  '852': true, // Hong Kong, China
  '853': true, // Macao, China
  '855': true, // Cambodia
  '856': true, // Lao P.D.R.
  '870': true, // Inmarsat SNAC
  '878': true, // Universal Personal Telecommunication (UPT)
  '880': true, // Bangladesh
  '881': true, // Global Mobile Satellite System (GMSS), shared
  '882': true, // International Networks, shared code
  '883': true, // International Networks, shared code
  '886': true, // Taiwan, China
  '888': true, // Telecommunications for Disaster Relief (TDR)
  '960': true, // Maldives
  '961': true, // Lebanon
  '962': true, // Jordan
  '963': true, // Syrian Arab Republic
  '964': true, // Iraq
  '965': true, // Kuwait
  '966': true, // Saudi Arabia
  '967': true, // Yemen
  '968': true, // Oman
  '970': true, // Reserved
  '971': true, // United Arab Emirates
  '972': true, // Israel
  '973': true, // Bahrain
  '974': true, // Qatar
  '975': true, // Bhutan
  '976': true, // Mongolia
  '977': true, // Nepal
  '979': true, // International Premium Rate Service (IPRS)
  '991': true, // Trial of a proposed new international service
  '992': true, // Tajikistan
  '993': true, // Turkmenistan
  '994': true, // Azerbaijan
  '995': true, // Georgia
  '996': true, // Kyrgyzstan
  '998': true, // Uzbekistan
};


/**
 * Validates whether the given string is a valid international phone number.
 * This rule only checks whether the given string prefix is a valid country code (or national prefix).
 * Unlike the mobilePhoneNumber rule, this rule does not check if a telephone service operator
 * with the given phone number prefix actually exists or not.
 * @param {string|number} [val]
 * @returns {boolean}
 */
const validate = val => {
  if (!val) {
    return true;
  }

  const valStr = String(val);

  // If does not pass the regex, return false
  const passInternationalPhoneNumberRegExp = internationalPhoneNumberRegExp.test(valStr);

  if (!passInternationalPhoneNumberRegExp) {
    return false;
  }

  // If pass, continue to validate the prefix
  // Strip the plus sign prefix
  const valWithoutPlusPrefix = valStr.replace(/^\+/, '');

  // Match the first n numbers to be in the list
  const oneNumPrefix = valWithoutPlusPrefix.slice(0, 1);
  const existsInOnePrefixList = oneNumPrefixMap[oneNumPrefix];

  if (existsInOnePrefixList) {
    return true;
  }

  const twoNumPrefix = valWithoutPlusPrefix.slice(0, 2);
  const existsInTwoPrefixList = twoNumPrefixMap[twoNumPrefix];

  if (existsInTwoPrefixList) {
    return true;
  }

  const threeNumPrefix = valWithoutPlusPrefix.slice(0, 3);
  const existsInThreePrefixList = threeNumPrefixMap[threeNumPrefix];

  if (existsInThreePrefixList) {
    return true;
  }

  return false;
};

const message = '<%= propertyName %> field is not a valid international phone number.';

export default { fullName, validate, message };
