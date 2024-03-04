const fullName = 'indonesiaIdCardNumberValidProvince';

const provinceCodeMapping = {
  11: true, // 'ACEH'
  12: true, // 'SUMATERA UTARA'
  13: true, // 'SUMATERA BARAT'
  14: true, // 'RIAU'
  15: true, // 'JAMBI'
  16: true, // 'SUMATERA SELATAN'
  17: true, // 'BENGKULU'
  18: true, // 'LAMPUNG'
  19: true, // 'KEPULAUAN BANGKA BELITUNG'
  21: true, // 'KEPULAUAN RIAU'
  31: true, // 'DKI JAKARTA'
  32: true, // 'JAWA BARAT'
  33: true, // 'JAWA TENGAH'
  34: true, // 'DI YOGYAKARTA'
  35: true, // 'JAWA TIMUR'
  36: true, // 'BANTEN'
  51: true, // 'BALI'
  52: true, // 'NUSA TENGGARA BARAT'
  53: true, // 'NUSA TENGGARA TIMUR'
  61: true, // 'KALIMANTAN BARAT'
  62: true, // 'KALIMANTAN TENGAH'
  63: true, // 'KALIMANTAN SELATAN'
  64: true, // 'KALIMANTAN TIMUR'
  65: true, // 'KALIMANTAN UTARA'
  71: true, // 'SULAWESI UTARA'
  72: true, // 'SULAWESI TENGAH'
  73: true, // 'SULAWESI SELATAN'
  74: true, // 'SULAWESI TENGGARA'
  75: true, // 'GORONTALO'
  76: true, // 'SULAWESI BARAT'
  81: true, // 'MALUKU'
  82: true, // 'MALUKU UTARA'
  91: true, // 'PAPUA'
  92: true // 'PAPUA BARAT'
};

const validate = (value)  => {
  // Do not validate if input value is falsy.
  if (!value) {
    return true;
  }

  const provinceCode = Number(String(value).substr(0, 2));

  return provinceCodeMapping[provinceCode];
};

const message = '<%= propertyName %> province code is not valid.';

export default { fullName, validate, message };
