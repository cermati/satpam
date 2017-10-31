import _ from 'lodash';

const mobilePhoneNumberRegex = /^(08|628|\+628)[0-9]{6,11}$/;

/**
 * Sources
 * http://blog.mangpulsa.com/daftar-operator-seluler-gsm-indonesia/
 * http://www.kios-pulsa.com/article/daftar-prefix-nomor-operator-seluler-indonesia/
 */
const prefixMap = {
  '0811': true, // KartuHALO	Telkomsel
  '0812': true, // SimPATI, KartuHALO	Telkomsel
  '0813': true, // SimPATI, KartuHALO	Telkomsel
  '0814': true, // Indosat 3,5G Broadband	Indosat (IndosatM2)
  '0815': true, // Mentari lama, Matrix	Indosat
  '0816': true, // Mentari, Matrix	Indosat
  '0817': true, // XL Prabayar, XL Pascabayar	XL Axiata
  '0818': true, // XL Prabayar, XL Pascabayar	XL Axiata
  '0819': true, // XL Prabayar, XL Pascabayar	XL Axiata
  '0821': true, // SimPATI Freedom	Telkomsel
  '0822': true, // SimPATI (Kartu Facebook)	Telkomsel
  '0823': true, // Kartu As
  '0828': true, // Ceria	Sampoerna Telekom
  '0831': true, // Axis	AXIS Telekom Indonesia
  '0832': true, // Axis	AXIS Telekom Indonesia
  '0832': true, // Axis	AXIS Telekom Indonesia
  '0838': true, // Axis	AXIS Telekom Indonesia
  '0851': true, // Nomor untu k Kartu AS (pengganti Flexi)
  '0852': true, // Kartu As	Telkomsel
  '0853': true, // Kartu As (Kartu Prima)	Telkomsel
  '0855': true, // Matrix Auto	Indosat
  '0856': true, // IM3	Indosat
  '0857': true, // IM3	Indosat
  '0858': true, // Mentari	Indosat
  '0859': true, // XL Prabayar, XL Pascabayar	XL Axiata
  '0868': true, // ByRU	PSN/ACeS
  '0877': true, // XL Prabayar, Hauraa	XL Axiata
  '0878': true, // XL Prabayar	XL Axiata
  '0879': true, // XL Prabayar	XL Axiata
  '0881': true, // smartfren	Smartfren Telecom
  '0882': true, // smartfren	Smartfren Telecom
  '0883': true, // Smartfren	Smartfren Telecom
  '0884': true, // Smartfren	Smartfren Telecom
  '0885': true, // Smartfren	Smartfren Telecom
  '0886': true, // Smartfren	Smartfren Telecom
  '0887': true, // smartfren	Smartfren Telecom
  '0888': true, // smartfren	Smartfren Telecom
  '0889': true, // smartfren	Smartfren Telecom
  '0895': true, // 3	Hutchison Charoen Pokphand Telecom
  '0896': true, // 3	Hutchison Charoen Pokphand Telecom
  '0897': true, // 3	Hutchison Charoen Pokphand Telecom
  '0898': true, // 3	Hutchison Charoen Pokphand Telecom
  '0899': true // 3	Hutchison Charoen Pokphand Telecom
};

const validate = value => {
  if (!value) {
    return true;
  }

  const prefix = _.toString(value).substr(0, 4);

  return prefixMap[prefix] && mobilePhoneNumberRegex.test(value);
};

const message = '<%= propertyName %> field is not a valid mobile phone number.';

export default {validate, message};
