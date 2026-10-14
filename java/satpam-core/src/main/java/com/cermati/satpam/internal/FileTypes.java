package com.cermati.satpam.internal;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Magic-number file type detection, ported from the two npm {@code file-type} versions satpam uses:
 * 3.8.0 (the {@code fileType} rule) and 10.11.0 (through {@code image-type} 4.1.0, the {@code image}
 * rule). Both return the extension, or {@code null} when the type is unknown. Bytes past the end of
 * the buffer compare like JS {@code undefined}: never equal to a byte value.
 */
public final class FileTypes {
  /** {@code image-type} 4.1.0's image extensions. */
  public static final Set<String> IMAGE_EXTENSIONS = new HashSet<>(Arrays.asList(
    "jpg", "png", "gif", "webp", "flif", "cr2", "tif", "bmp", "jxr", "psd", "ico", "bpg", "jp2", "jpm", "jpx",
    "heic", "cur", "dcm"));

  private FileTypes() {
  }

  private static final class Buf {
    private final byte[] bytes;

    Buf(byte[] bytes) {
      this.bytes = bytes;
    }

    int length() {
      return bytes.length;
    }

    /** {@code buf[i]}: the unsigned byte, or -1 for undefined. */
    int at(int i) {
      return i >= 0 && i < bytes.length ? bytes[i] & 0xFF : -1;
    }

    boolean eq(int i, int value) {
      return at(i) == value;
    }

    /** file-type 10's {@code check(header, {offset})}. */
    boolean check(int offset, int... header) {
      for (int i = 0; i < header.length; i++) {
        if (header[i] != at(i + offset)) {
          return false;
        }
      }
      return true;
    }

    /** {@code check(header, {offset, mask})}: {@code mask & undefined} is 0. */
    boolean checkMasked(int offset, int[] header, int[] mask) {
      for (int i = 0; i < header.length; i++) {
        int value = at(i + offset);
        if (header[i] != (mask[i] & (value < 0 ? 0 : value))) {
          return false;
        }
      }
      return true;
    }

    boolean checkString(int offset, String header) {
      for (int i = 0; i < header.length(); i++) {
        if (header.charAt(i) != at(i + offset)) {
          return false;
        }
      }
      return true;
    }

    /** {@code [...bytes]} matched from index 0, for the {@code check(header)} form. */
    boolean starts(int... header) {
      return check(0, header);
    }
  }

  // ===================================================================================
  // file-type 3.8.0
  // ===================================================================================

  /**
   * file-type 3.8.0.
   *
   * @throws IllegalArgumentException where 3.8.0 throws: a buffer of exactly {@code 00 00 01}
   *     ({@code buf[3].toString(16)} on undefined)
   */
  public static String detectV3(byte[] bytes) {
    Buf buf = new Buf(bytes);
    if (!(buf.length() > 1)) {
      return null;
    }
    if (buf.eq(0, 0xFF) && buf.eq(1, 0xD8) && buf.eq(2, 0xFF)) {
      return "jpg";
    }
    if (buf.eq(0, 0x89) && buf.eq(1, 0x50) && buf.eq(2, 0x4E) && buf.eq(3, 0x47)) {
      return "png";
    }
    if (buf.eq(0, 0x47) && buf.eq(1, 0x49) && buf.eq(2, 0x46)) {
      return "gif";
    }
    if (buf.eq(8, 0x57) && buf.eq(9, 0x45) && buf.eq(10, 0x42) && buf.eq(11, 0x50)) {
      return "webp";
    }
    boolean tiff = (buf.eq(0, 0x49) && buf.eq(1, 0x49) && buf.eq(2, 0x2A) && buf.eq(3, 0x0))
      || (buf.eq(0, 0x4D) && buf.eq(1, 0x4D) && buf.eq(2, 0x0) && buf.eq(3, 0x2A));
    if (tiff && buf.eq(8, 0x43) && buf.eq(9, 0x52)) {
      return "cr2";
    }
    if (tiff) {
      return "tif";
    }
    if (buf.eq(0, 0x42) && buf.eq(1, 0x4D)) {
      return "bmp";
    }
    if (buf.eq(0, 0x49) && buf.eq(1, 0x49) && buf.eq(2, 0xBC)) {
      return "jxr";
    }
    if (buf.eq(0, 0x38) && buf.eq(1, 0x42) && buf.eq(2, 0x50) && buf.eq(3, 0x53)) {
      return "psd";
    }
    boolean zipHeader = buf.eq(0, 0x50) && buf.eq(1, 0x4B) && buf.eq(2, 0x3) && buf.eq(3, 0x4);
    if (zipHeader && buf.checkString(30, "mimetypeapplication/epub+zip")) {
      return "epub";
    }
    if (zipHeader && buf.checkString(30, "META-INF/mozilla.rsa")) {
      return "xpi";
    }
    if (buf.eq(0, 0x50) && buf.eq(1, 0x4B) && (buf.eq(2, 0x3) || buf.eq(2, 0x5) || buf.eq(2, 0x7))
      && (buf.eq(3, 0x4) || buf.eq(3, 0x6) || buf.eq(3, 0x8))) {
      return "zip";
    }
    if (buf.check(257, 0x75, 0x73, 0x74, 0x61, 0x72)) {
      return "tar";
    }
    if (buf.starts(0x52, 0x61, 0x72, 0x21, 0x1A, 0x7) && (buf.eq(6, 0x0) || buf.eq(6, 0x1))) {
      return "rar";
    }
    if (buf.starts(0x1F, 0x8B, 0x8)) {
      return "gz";
    }
    if (buf.starts(0x42, 0x5A, 0x68)) {
      return "bz2";
    }
    if (buf.starts(0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C)) {
      return "7z";
    }
    if (buf.starts(0x78, 0x01)) {
      return "dmg";
    }
    if ((buf.starts(0x0, 0x0, 0x0) && (buf.eq(3, 0x18) || buf.eq(3, 0x20)) && buf.check(4, 0x66, 0x74, 0x79, 0x70))
      || buf.starts(0x33, 0x67, 0x70, 0x35)
      || (buf.starts(0x0, 0x0, 0x0, 0x1C, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32)
        && buf.check(16, 0x6D, 0x70, 0x34, 0x31, 0x6D, 0x70, 0x34, 0x32, 0x69, 0x73, 0x6F, 0x6D))
      || buf.starts(0x0, 0x0, 0x0, 0x1C, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D)
      || buf.starts(0x0, 0x0, 0x0, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32, 0x0, 0x0, 0x0, 0x0)) {
      return "mp4";
    }
    if (buf.starts(0x0, 0x0, 0x0, 0x1C, 0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x56)) {
      return "m4v";
    }
    if (buf.starts(0x4D, 0x54, 0x68, 0x64)) {
      return "mid";
    }
    if (buf.check(31, 0x6D, 0x61, 0x74, 0x72, 0x6f, 0x73, 0x6B, 0x61)) {
      return "mkv";
    }
    if (buf.starts(0x1A, 0x45, 0xDF, 0xA3)) {
      return "webm";
    }
    if (buf.starts(0x0, 0x0, 0x0, 0x14, 0x66, 0x74, 0x79, 0x70)) {
      return "mov";
    }
    if (buf.starts(0x52, 0x49, 0x46, 0x46) && buf.check(8, 0x41, 0x56, 0x49)) {
      return "avi";
    }
    if (buf.starts(0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11, 0xA6, 0xD9)) {
      return "wmv";
    }
    if (buf.starts(0x0, 0x0, 0x1)) {
      // buf[3].toString(16)[0] === 'b'
      int b3 = buf.at(3);
      if (b3 < 0) {
        throw new IllegalArgumentException("TypeError: Cannot read properties of undefined (reading 'toString')");
      }
      if (Integer.toHexString(b3).charAt(0) == 'b') {
        return "mpg";
      }
    }
    if (buf.starts(0x49, 0x44, 0x33) || buf.starts(0xFF, 0xfb)) {
      return "mp3";
    }
    if (buf.check(4, 0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x41) || buf.starts(0x4D, 0x34, 0x41, 0x20)) {
      return "m4a";
    }
    if (buf.check(28, 0x4F, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64)) {
      return "opus";
    }
    if (buf.starts(0x4F, 0x67, 0x67, 0x53)) {
      return "ogg";
    }
    if (buf.starts(0x66, 0x4C, 0x61, 0x43)) {
      return "flac";
    }
    if (buf.starts(0x52, 0x49, 0x46, 0x46) && buf.check(8, 0x57, 0x41, 0x56, 0x45)) {
      return "wav";
    }
    if (buf.starts(0x23, 0x21, 0x41, 0x4D, 0x52, 0x0A)) {
      return "amr";
    }
    if (buf.starts(0x25, 0x50, 0x44, 0x46)) {
      return "pdf";
    }
    if (buf.starts(0x4D, 0x5A)) {
      return "exe";
    }
    if ((buf.eq(0, 0x43) || buf.eq(0, 0x46)) && buf.check(1, 0x57, 0x53)) {
      return "swf";
    }
    if (buf.starts(0x7B, 0x5C, 0x72, 0x74, 0x66)) {
      return "rtf";
    }
    if (buf.starts(0x77, 0x4F, 0x46, 0x46) && (buf.check(4, 0x00, 0x01, 0x00, 0x00) || buf.check(4, 0x4F, 0x54, 0x54, 0x4F))) {
      return "woff";
    }
    if (buf.starts(0x77, 0x4F, 0x46, 0x32) && (buf.check(4, 0x00, 0x01, 0x00, 0x00) || buf.check(4, 0x4F, 0x54, 0x54, 0x4F))) {
      return "woff2";
    }
    if (buf.check(34, 0x4C, 0x50)
      && (buf.check(8, 0x00, 0x00, 0x01) || buf.check(8, 0x01, 0x00, 0x02) || buf.check(8, 0x02, 0x00, 0x02))) {
      return "eot";
    }
    if (buf.starts(0x00, 0x01, 0x00, 0x00, 0x00)) {
      return "ttf";
    }
    if (buf.starts(0x4F, 0x54, 0x54, 0x4F, 0x00)) {
      return "otf";
    }
    if (buf.starts(0x00, 0x00, 0x01, 0x00)) {
      return "ico";
    }
    if (buf.starts(0x46, 0x4C, 0x56, 0x01)) {
      return "flv";
    }
    if (buf.starts(0x25, 0x21)) {
      return "ps";
    }
    if (buf.starts(0xFD, 0x37, 0x7A, 0x58, 0x5A, 0x00)) {
      return "xz";
    }
    if (buf.starts(0x53, 0x51, 0x4C, 0x69)) {
      return "sqlite";
    }
    if (buf.starts(0x4E, 0x45, 0x53, 0x1A)) {
      return "nes";
    }
    if (buf.starts(0x43, 0x72, 0x32, 0x34)) {
      return "crx";
    }
    if (buf.starts(0x4D, 0x53, 0x43, 0x46) || buf.starts(0x49, 0x53, 0x63, 0x28)) {
      return "cab";
    }
    if (buf.checkString(0, "!<arch>\ndebian-binary")) {
      return "deb";
    }
    if (buf.checkString(0, "!<arch>")) {
      return "ar";
    }
    if (buf.starts(0xED, 0xAB, 0xEE, 0xDB)) {
      return "rpm";
    }
    if (buf.starts(0x1F, 0xA0) || buf.starts(0x1F, 0x9D)) {
      return "Z";
    }
    if (buf.starts(0x4C, 0x5A, 0x49, 0x50)) {
      return "lz";
    }
    if (buf.starts(0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1)) {
      return "msi";
    }
    return null;
  }

  // ===================================================================================
  // file-type 10.11.0
  // ===================================================================================

  /** file-type 10.11.0. */
  public static String detectV10(byte[] bytes) {
    Buf buf = new Buf(bytes);
    if (!(buf.length() > 1)) {
      return null;
    }
    if (buf.starts(0xFF, 0xD8, 0xFF)) {
      return "jpg";
    }
    if (buf.starts(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)) {
      return "png";
    }
    if (buf.starts(0x47, 0x49, 0x46)) {
      return "gif";
    }
    if (buf.check(8, 0x57, 0x45, 0x42, 0x50)) {
      return "webp";
    }
    if (buf.starts(0x46, 0x4C, 0x49, 0x46)) {
      return "flif";
    }
    boolean tiff = buf.starts(0x49, 0x49, 0x2A, 0x0) || buf.starts(0x4D, 0x4D, 0x0, 0x2A);
    if (tiff && buf.check(8, 0x43, 0x52)) {
      return "cr2";
    }
    if (tiff) {
      return "tif";
    }
    if (buf.starts(0x42, 0x4D)) {
      return "bmp";
    }
    if (buf.starts(0x49, 0x49, 0xBC)) {
      return "jxr";
    }
    if (buf.starts(0x38, 0x42, 0x50, 0x53)) {
      return "psd";
    }
    if (buf.starts(0x50, 0x4B, 0x3, 0x4)) {
      String zipType = zipBasedType(buf);
      if (zipType != null) {
        return zipType;
      }
    }
    if (buf.starts(0x50, 0x4B) && (buf.eq(2, 0x3) || buf.eq(2, 0x5) || buf.eq(2, 0x7))
      && (buf.eq(3, 0x4) || buf.eq(3, 0x6) || buf.eq(3, 0x8))) {
      return "zip";
    }
    if (buf.check(257, 0x75, 0x73, 0x74, 0x61, 0x72)) {
      return "tar";
    }
    if (buf.starts(0x52, 0x61, 0x72, 0x21, 0x1A, 0x7) && (buf.eq(6, 0x0) || buf.eq(6, 0x1))) {
      return "rar";
    }
    if (buf.starts(0x1F, 0x8B, 0x8)) {
      return "gz";
    }
    if (buf.starts(0x42, 0x5A, 0x68)) {
      return "bz2";
    }
    if (buf.starts(0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C)) {
      return "7z";
    }
    if (buf.starts(0x78, 0x01)) {
      return "dmg";
    }
    if (buf.starts(0x33, 0x67, 0x70, 0x35)
      || (buf.starts(0x0, 0x0, 0x0) && buf.check(4, 0x66, 0x74, 0x79, 0x70)
        && (buf.check(8, 0x6D, 0x70, 0x34, 0x31) || buf.check(8, 0x6D, 0x70, 0x34, 0x32)
          || buf.check(8, 0x69, 0x73, 0x6F, 0x6D) || buf.check(8, 0x69, 0x73, 0x6F, 0x32)
          || buf.check(8, 0x6D, 0x6D, 0x70, 0x34) || buf.check(8, 0x4D, 0x34, 0x56)
          || buf.check(8, 0x64, 0x61, 0x73, 0x68)))) {
      return "mp4";
    }
    if (buf.starts(0x4D, 0x54, 0x68, 0x64)) {
      return "mid";
    }
    if (buf.starts(0x1A, 0x45, 0xDF, 0xA3)) {
      String matroska = matroskaType(buf);
      if (matroska != null) {
        return matroska;
      }
    }
    if (buf.starts(0x0, 0x0, 0x0, 0x14, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20)
      || buf.check(4, 0x66, 0x72, 0x65, 0x65)
      || buf.check(4, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20)
      || buf.check(4, 0x6D, 0x64, 0x61, 0x74)
      || buf.check(4, 0x6D, 0x6F, 0x6F, 0x76)
      || buf.check(4, 0x77, 0x69, 0x64, 0x65)) {
      return "mov";
    }
    if (buf.starts(0x52, 0x49, 0x46, 0x46)) {
      if (buf.check(8, 0x41, 0x56, 0x49)) {
        return "avi";
      }
      if (buf.check(8, 0x57, 0x41, 0x56, 0x45)) {
        return "wav";
      }
      if (buf.check(8, 0x51, 0x4C, 0x43, 0x4D)) {
        return "qcp";
      }
    }
    if (buf.starts(0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11, 0xA6, 0xD9)) {
      return asfType(buf);
    }
    if (buf.starts(0x0, 0x0, 0x1, 0xBA) || buf.starts(0x0, 0x0, 0x1, 0xB3)) {
      return "mpg";
    }
    if (buf.check(4, 0x66, 0x74, 0x79, 0x70, 0x33, 0x67)) {
      return "3gp";
    }
    for (int start = 0; start < 2 && start < (buf.length() - 16); start++) {
      if (buf.check(start, 0x49, 0x44, 0x33) || buf.checkMasked(start, new int[] {0xFF, 0xE2}, new int[] {0xFF, 0xE2})) {
        return "mp3";
      }
      if (buf.checkMasked(start, new int[] {0xFF, 0xE4}, new int[] {0xFF, 0xE4})) {
        return "mp2";
      }
      if (buf.checkMasked(start, new int[] {0xFF, 0xF8}, new int[] {0xFF, 0xFC})) {
        return "mp2";
      }
      if (buf.checkMasked(start, new int[] {0xFF, 0xF0}, new int[] {0xFF, 0xFC})) {
        return "mp4";
      }
    }
    if (buf.check(4, 0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x41)) {
      return "m4a";
    }
    if (buf.check(28, 0x4F, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64)) {
      return "opus";
    }
    if (buf.starts(0x4F, 0x67, 0x67, 0x53)) {
      if (buf.check(28, 0x80, 0x74, 0x68, 0x65, 0x6F, 0x72, 0x61)) {
        return "ogv";
      }
      if (buf.check(28, 0x01, 0x76, 0x69, 0x64, 0x65, 0x6F, 0x00)) {
        return "ogm";
      }
      if (buf.check(28, 0x7F, 0x46, 0x4C, 0x41, 0x43)) {
        return "oga";
      }
      if (buf.check(28, 0x53, 0x70, 0x65, 0x65, 0x78, 0x20, 0x20)) {
        return "spx";
      }
      if (buf.check(28, 0x01, 0x76, 0x6F, 0x72, 0x62, 0x69, 0x73)) {
        return "ogg";
      }
      return "ogx";
    }
    if (buf.starts(0x66, 0x4C, 0x61, 0x43)) {
      return "flac";
    }
    if (buf.starts(0x4D, 0x41, 0x43, 0x20)) {
      return "ape";
    }
    if (buf.starts(0x77, 0x76, 0x70, 0x6B)) {
      return "wv";
    }
    if (buf.starts(0x23, 0x21, 0x41, 0x4D, 0x52, 0x0A)) {
      return "amr";
    }
    if (buf.starts(0x25, 0x50, 0x44, 0x46)) {
      return "pdf";
    }
    if (buf.starts(0x4D, 0x5A)) {
      return "exe";
    }
    if ((buf.eq(0, 0x43) || buf.eq(0, 0x46)) && buf.check(1, 0x57, 0x53)) {
      return "swf";
    }
    if (buf.starts(0x7B, 0x5C, 0x72, 0x74, 0x66)) {
      return "rtf";
    }
    if (buf.starts(0x00, 0x61, 0x73, 0x6D)) {
      return "wasm";
    }
    if (buf.starts(0x77, 0x4F, 0x46, 0x46) && (buf.check(4, 0x00, 0x01, 0x00, 0x00) || buf.check(4, 0x4F, 0x54, 0x54, 0x4F))) {
      return "woff";
    }
    if (buf.starts(0x77, 0x4F, 0x46, 0x32) && (buf.check(4, 0x00, 0x01, 0x00, 0x00) || buf.check(4, 0x4F, 0x54, 0x54, 0x4F))) {
      return "woff2";
    }
    if (buf.check(34, 0x4C, 0x50)
      && (buf.check(8, 0x00, 0x00, 0x01) || buf.check(8, 0x01, 0x00, 0x02) || buf.check(8, 0x02, 0x00, 0x02))) {
      return "eot";
    }
    if (buf.starts(0x00, 0x01, 0x00, 0x00, 0x00)) {
      return "ttf";
    }
    if (buf.starts(0x4F, 0x54, 0x54, 0x4F, 0x00)) {
      return "otf";
    }
    if (buf.starts(0x00, 0x00, 0x01, 0x00)) {
      return "ico";
    }
    if (buf.starts(0x00, 0x00, 0x02, 0x00)) {
      return "cur";
    }
    if (buf.starts(0x46, 0x4C, 0x56, 0x01)) {
      return "flv";
    }
    if (buf.starts(0x25, 0x21)) {
      return "ps";
    }
    if (buf.starts(0xFD, 0x37, 0x7A, 0x58, 0x5A, 0x00)) {
      return "xz";
    }
    if (buf.starts(0x53, 0x51, 0x4C, 0x69)) {
      return "sqlite";
    }
    if (buf.starts(0x4E, 0x45, 0x53, 0x1A)) {
      return "nes";
    }
    if (buf.starts(0x43, 0x72, 0x32, 0x34)) {
      return "crx";
    }
    if (buf.starts(0x4D, 0x53, 0x43, 0x46) || buf.starts(0x49, 0x53, 0x63, 0x28)) {
      return "cab";
    }
    if (buf.checkString(0, "!<arch>\ndebian-binary")) {
      return "deb";
    }
    if (buf.checkString(0, "!<arch>")) {
      return "ar";
    }
    if (buf.starts(0xED, 0xAB, 0xEE, 0xDB)) {
      return "rpm";
    }
    if (buf.starts(0x1F, 0xA0) || buf.starts(0x1F, 0x9D)) {
      return "Z";
    }
    if (buf.starts(0x4C, 0x5A, 0x49, 0x50)) {
      return "lz";
    }
    if (buf.starts(0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1)) {
      return "msi";
    }
    if (buf.starts(0x06, 0x0E, 0x2B, 0x34, 0x02, 0x05, 0x01, 0x01, 0x0D, 0x01, 0x02, 0x01, 0x01, 0x02)) {
      return "mxf";
    }
    if (buf.check(4, 0x47) && (buf.check(192, 0x47) || buf.check(196, 0x47))) {
      return "mts";
    }
    if (buf.checkString(0, "BLENDER")) {
      return "blend";
    }
    if (buf.starts(0x42, 0x50, 0x47, 0xFB)) {
      return "bpg";
    }
    if (buf.starts(0x00, 0x00, 0x00, 0x0C, 0x6A, 0x50, 0x20, 0x20, 0x0D, 0x0A, 0x87, 0x0A)) {
      if (buf.check(20, 0x6A, 0x70, 0x32, 0x20)) {
        return "jp2";
      }
      if (buf.check(20, 0x6A, 0x70, 0x78, 0x20)) {
        return "jpx";
      }
      if (buf.check(20, 0x6A, 0x70, 0x6D, 0x20)) {
        return "jpm";
      }
      if (buf.check(20, 0x6D, 0x6A, 0x70, 0x32)) {
        return "mj2";
      }
    }
    if (buf.starts(0x46, 0x4F, 0x52, 0x4D)) {
      return "aif";
    }
    if (buf.checkString(0, "<?xml ")) {
      return "xml";
    }
    if (buf.check(60, 0x42, 0x4F, 0x4F, 0x4B, 0x4D, 0x4F, 0x42, 0x49)) {
      return "mobi";
    }
    if (buf.check(4, 0x66, 0x74, 0x79, 0x70)) {
      if (buf.check(8, 0x6D, 0x69, 0x66, 0x31) || buf.check(8, 0x6D, 0x73, 0x66, 0x31)
        || buf.check(8, 0x68, 0x65, 0x69, 0x63) || buf.check(8, 0x68, 0x65, 0x69, 0x78)
        || buf.check(8, 0x68, 0x65, 0x76, 0x63) || buf.check(8, 0x68, 0x65, 0x76, 0x78)) {
        return "heic";
      }
    }
    if (buf.starts(0xAB, 0x4B, 0x54, 0x58, 0x20, 0x31, 0x31, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A)) {
      return "ktx";
    }
    if (buf.check(128, 0x44, 0x49, 0x43, 0x4D)) {
      return "dcm";
    }
    if (buf.starts(0x4D, 0x50, 0x2B)) {
      return "mpc";
    }
    if (buf.starts(0x4D, 0x50, 0x43, 0x4B)) {
      return "mpc";
    }
    if (buf.checkString(0, "BEGIN:")) {
      return "ics";
    }
    if (buf.starts(0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00)) {
      return "glb";
    }
    if (buf.starts(0xD4, 0xC3, 0xB2, 0xA1) || buf.starts(0xA1, 0xB2, 0xC3, 0xD4)) {
      return "pcap";
    }
    return null;
  }

  private static String zipBasedType(Buf buf) {
    if (buf.checkString(30, "mimetypeapplication/epub+zip")) {
      return "epub";
    }
    if (buf.checkString(30, "META-INF/mozilla.rsa")) {
      return "xpi";
    }
    if (buf.checkString(30, "mimetypeapplication/vnd.oasis.opendocument.text")) {
      return "odt";
    }
    if (buf.checkString(30, "mimetypeapplication/vnd.oasis.opendocument.spreadsheet")) {
      return "ods";
    }
    if (buf.checkString(30, "mimetypeapplication/vnd.oasis.opendocument.presentation")) {
      return "odp";
    }
    int zipHeaderIndex = 0;
    boolean oxmlFound = false;
    String type = null;
    do {
      int offset = zipHeaderIndex + 30;
      if (!oxmlFound) {
        oxmlFound = buf.checkString(offset, "[Content_Types].xml") || buf.checkString(offset, "_rels/.rels");
      }
      if (type == null) {
        if (buf.checkString(offset, "word/")) {
          type = "docx";
        } else if (buf.checkString(offset, "ppt/")) {
          type = "pptx";
        } else if (buf.checkString(offset, "xl/")) {
          type = "xlsx";
        }
      }
      if (oxmlFound && type != null) {
        return type;
      }
      zipHeaderIndex = -1;
      for (int i = offset; i < buf.length(); i++) {
        if (buf.eq(i, 0x50) && buf.eq(i + 1, 0x4B) && buf.eq(i + 2, 0x3) && buf.eq(i + 3, 0x4)) {
          zipHeaderIndex = i;
          break;
        }
      }
    } while (zipHeaderIndex >= 0);
    return type;
  }

  private static String matroskaType(Buf buf) {
    int end = Math.min(buf.length(), 4 + 4096);
    int idPos = -1;
    for (int i = 4; i < end; i++) {
      // sliced[i + 1] past the slice is undefined
      if (buf.at(i) == 0x42 && i + 1 < end && buf.at(i + 1) == 0x82) {
        idPos = i - 4;
        break;
      }
    }
    if (idPos == -1) {
      return null;
    }
    int docTypePos = 4 + idPos + 3;
    if (sliceMatches(buf, docTypePos, end, "matroska")) {
      return "mkv";
    }
    if (sliceMatches(buf, docTypePos, end, "webm")) {
      return "webm";
    }
    return null;
  }

  private static boolean sliceMatches(Buf buf, int from, int end, String text) {
    for (int i = 0; i < text.length(); i++) {
      int index = from + i;
      if (index >= end || buf.at(index) != text.charAt(i)) {
        return false;
      }
    }
    return true;
  }

  private static String asfType(Buf buf) {
    double offset = 30;
    do {
      double objectSize = readUInt64LE(buf, offset + 16);
      int intOffset = (int) offset;
      if (buf.check(intOffset, 0x91, 0x07, 0xDC, 0xB7, 0xB7, 0xA9, 0xCF, 0x11, 0x8E, 0xE6, 0x00, 0xC0, 0x0C, 0x20, 0x53, 0x65)) {
        if (buf.check(intOffset + 24, 0x40, 0x9E, 0x69, 0xF8, 0x4D, 0x5B, 0xCF, 0x11, 0xA8, 0xFD, 0x00, 0x80, 0x5F, 0x5C, 0x44, 0x2B)) {
          return "wma";
        }
        if (buf.check(intOffset + 24, 0xC0, 0xEF, 0x19, 0xBC, 0x4D, 0x5B, 0xCF, 0x11, 0xA8, 0xFD, 0x00, 0x80, 0x5F, 0x5C, 0x44, 0x2B)) {
          return "wmv";
        }
        break;
      }
      offset += objectSize;
    } while (offset + 24 <= buf.length());
    return "asf";
  }

  /** {@code readUInt64LE}: NaN once it reads past the end (undefined arithmetic). */
  private static double readUInt64LE(Buf buf, double offset) {
    if (Double.isNaN(offset) || offset != Math.floor(offset)) {
      return Double.NaN;
    }
    int start = (int) offset;
    double n = 0;
    double mul = 1;
    for (int i = 0; i < 8; i++) {
      int b = buf.at(start + i);
      if (b < 0) {
        return Double.NaN;
      }
      n += b * mul;
      mul *= 0x100;
    }
    return n;
  }
}
