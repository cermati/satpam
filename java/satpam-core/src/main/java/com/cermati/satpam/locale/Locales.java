package com.cermati.satpam.locale;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Message translations keyed by rule fullName, the Java counterpart of {@code src/locale/*.js}.
 * Entries are copied verbatim, including keys that do not match a rule fullName in JS.
 */
public final class Locales {
  private static final Map<String, Map<String, String>> BY_LOCALE;

  static {
    Map<String, Map<String, String>> byLocale = new LinkedHashMap<>();
    byLocale.put("id", Id.MESSAGES);
    BY_LOCALE = Collections.unmodifiableMap(byLocale);
  }

  private Locales() {
  }

  /** Messages for {@code locale} (case-insensitive), or {@code null} if there is no such locale. */
  public static Map<String, String> messages(String locale) {
    return locale == null ? null : BY_LOCALE.get(locale.toLowerCase(Locale.ROOT));
  }

  /** Port of {@code src/locale/id.js}. */
  static final class Id {
    static final Map<String, String> MESSAGES;

    static {
      Map<String, String> messages = new LinkedHashMap<>();
      messages.put("alpha", "Input harus berupa huruf.");
      messages.put("alphanumeric", "Input harus berupa huruf atau angka.");
      messages.put("array", "Input harus berupa array.");
      messages.put("beginWith:$1", "Input tidak valid.");
      messages.put("between:$1:$2:", "Input antara <%= ruleParams[0] %> dan <% ruleParams[1] %>.");
      messages.put("boolean", "Input harus boolean.");
      messages.put("containsAlphabet", "Input harus mengandung setidaknya 1 huruf.");
      messages.put("containsDigit", "Input harus mengandung setidaknya 1 angka.");
      messages.put("containsSymbol", "Input harus mengandung setidaknya 1 simbol.");
      messages.put("containsLowerCase", "Input harus mengandung setidaknya 1 huruf kecil.");
      messages.put("containsUpperCase", "Input harus mengandung setidaknya 1 huruf besar.");
      messages.put("creditCard", "Nomor kartu kredit tidak valid.");
      messages.put("date", "Input harus dalam format tanggal yang valid.");
      messages.put("dateAfter:$1:$2:$3:$4", "Tanggal tidak valid.");
      messages.put("dateAfterOrEqual:$1:$2:$3:$4", "Tanggal tidak valid.");
      messages.put("dateBefore:$1:$2:$3:$4", "Tanggal tidak valid.");
      messages.put("dateBeforeOrEqual:$1:$2:$3:$4", "Tanggal tidak valid.");
      messages.put("dateFormat:$1", "Format tanggal tidak valid.");
      messages.put("dateTimeAfter:$1:$2:$3:$4", "Tanggal/Waktu tidak valid.");
      messages.put("dateTimeAfterOrEqual:$1:$2:$3:$4", "Tanggal/Waktu tidak valid.");
      messages.put("email", "Format email tidak valid.");
      messages.put("emptyString", "Input harus kosong");
      messages.put("equal:$1", "Input harus sama dengan <%= ruleParams[0] %>.");
      messages.put("equal-to-field:$1", "Input harus sama dengan <%= inputObj[ruleParams[0]] %>.");
      messages.put("fqdn", "Input harus dalam format FQDN.");
      messages.put("image", "File harus berupa gambar.");
      messages.put("imei", "Input harus dalam format IMEI.");
      messages.put("indonesiaIdCardNumberBirthDate:$1:$2", "Digit Nomor KTP tidak sesuai dengan tanggal lahir.");
      messages.put("indonesiaIdCardNumberGender:$1:$2:$3", "Digit Nomor KTP tidak sesuai dengan jenis kelamin.");
      messages.put("indonesiaIdCardNumberProvince:$1", "Digit Nomor KTP tidak sesuai dengan provinsi.");
      messages.put("indonesiaIdCardNumberValidProvince", "Kode provinsi pada Nomor KTP tidak benar.");
      messages.put("indonesianName", "Nama tidak valid.");
      messages.put("integer", "Input harus berupa angka.");
      messages.put("internationalPhoneNumber", "Nomor telepon tidak valid.");
      messages.put("length:$1", "Jumlah karakter harus <%= ruleParams[0] %>.");
      messages.put("maxLength:$1", "Jumlah karakter tidak boleh lebih dari <%= ruleParams[0] %>.");
      messages.put("maxValue:$1", "Input tidak boleh lebih dari <%= ruleParams[0] %>.");
      messages.put("memberOf:$1", "Input tidak valid.");
      messages.put("minLength:$1", "Jumlah karakter tidak boleh kurang dari <%= ruleParams[0] %>.");
      messages.put("minValue:$1", "Input tidak boleh kurang dari <%= ruleParams[0] %>.");
      messages.put("minimumAge:$1:$2", "Umur tidak boleh kurang dari <%= ruleParams[0] %> tahun.");
      messages.put("mobilePhoneNumber", "Nomor handphone tidak valid.");
      messages.put("mongoId", "<%= propertyName %> tidak valid.");
      messages.put("multipleOf:$1", "<%= propertyName %> harus merupakan kelipatan <%= ruleParams[0] %>.");
      messages.put("nonBlank", "Input ini wajib diisi.");
      messages.put("notDisposableEmail", "Domain tidak valid.");
      messages.put("not-equal:$1", "Input tidak boleh sama dengan <%= ruleParams[0] %>.");
      messages.put("not-equal-to-field:$1", "Input tidak boleh sama dengan <%= inputObj[ruleParams[0]] %>.");
      messages.put("not-equal-email-domain:$1", "Domain <%= propertyName %> tidak valid.");
      messages.put("not-memberOf:$1", "Input tidak boleh bagian dari <%= ruleParams[0] %>.");
      messages.put("numeric", "Input harus berupa angka.");
      messages.put("pattern:$1:$2", "Input tidak valid.");
      messages.put("phoneNumber", "Nomor telepon tidak valid.");
      messages.put("regex:$1:$2", "Input tidak valid.");
      messages.put("required", "Input ini wajib diisi.");
      messages.put("requiredIf:$1:$2", "Input ini wajib diisi.");
      messages.put("requiredIfNot:$1:$2", "Input ini wajib diisi.");
      messages.put("samePassword", "Confirm Password tidak sama dengan Password.");
      messages.put("string", "Input harus berupa string.");
      messages.put("plainObject", "Input harus berupa object.");
      messages.put("taxId:$1", "Nomor NPWP tidak valid.");
      messages.put("url", "Format link tidak valid.");
      messages.put("uuid:$1", "Input harus berupa UUID.");
      messages.put("validZipCode", "Kode Pos tidak valid.");
      messages.put("hostname", "Nama host tidak valid");
      MESSAGES = Collections.unmodifiableMap(messages);
    }

    private Id() {
    }
  }
}
