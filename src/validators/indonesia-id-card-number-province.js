const fullName = 'indonesiaIdCardNumberProvince:$1';

const provinceCodeMapping = {
  'ACEH': 11,
  'SUMATERA UTARA': 12,
  'SUMATERA BARAT': 13,
  'RIAU': 14,
  'JAMBI': 15,
  'SUMATERA SELATAN': 16,
  'BENGKULU': 17,
  'LAMPUNG': 18,
  'KEPULAUAN BANGKA BELITUNG': 19,
  'KEPULAUAN RIAU': 21,
  'DKI JAKARTA': 31,
  'JAWA BARAT': 32,
  'JAWA TENGAH': 33,
  'DI YOGYAKARTA': 34,
  'JAWA TIMUR': 35,
  'BANTEN': 36,
  'BALI': 51,
  'NUSA TENGGARA BARAT': 52,
  'NUSA TENGGARA TIMUR': 53,
  'KALIMANTAN BARAT': 61,
  'KALIMANTAN TENGAH': 62,
  'KALIMANTAN SELATAN': 63,
  'KALIMANTAN TIMUR': 64,
  'KALIMANTAN UTARA': 65,
  'SULAWESI UTARA': 71,
  'SULAWESI TENGAH': 72,
  'SULAWESI SELATAN': 73,
  'SULAWESI TENGGARA': 74,
  'GORONTALO': 75,
  'SULAWESI BARAT': 76,
  'MALUKU': 81,
  'MALUKU UTARA': 82,
  'PAPUA': 91,
  'PAPUA BARAT': 92
};

const validate = (value, ruleObj, propertyName, inputObj)  => {
  // Do not validate if input value is falsy.
  if (!value) {
    return true;
  }

  const provinceCode = Number(String(value).substr(0, 2));
  const provinceKey = ruleObj.params[0];
  const provinceInputValue = inputObj[provinceKey];

  if (!provinceInputValue) {
    return false;
  }

  return provinceCode === provinceCodeMapping[provinceInputValue.toUpperCase()];
};

const message = '<%= propertyName %> province code does not match province input.';

export default { fullName, validate, message };
