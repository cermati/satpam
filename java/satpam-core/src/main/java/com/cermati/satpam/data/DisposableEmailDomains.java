package com.cermati.satpam.data;

import com.cermati.satpam.SatpamException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * The domains in {@code src/data/disposable-email-list.js}, exported to
 * {@code disposable-email-domains.txt} by {@code java/scripts/export-data.js}.
 */
public final class DisposableEmailDomains {
  private static final Set<String> DOMAINS = load();

  private DisposableEmailDomains() {
  }

  public static boolean contains(String lowerCaseDomain) {
    return DOMAINS.contains(lowerCaseDomain);
  }

  private static Set<String> load() {
    Set<String> domains = new HashSet<>();
    try (InputStream in = DisposableEmailDomains.class.getResourceAsStream("disposable-email-domains.txt")) {
      if (in == null) {
        throw new SatpamException("disposable-email-domains.txt is missing from the classpath");
      }
      BufferedReader reader = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8));
      String line;
      while ((line = reader.readLine()) != null) {
        if (!line.isEmpty()) {
          domains.add(line);
        }
      }
    } catch (IOException e) {
      throw new SatpamException("Cannot read disposable-email-domains.txt", e);
    }
    return Collections.unmodifiableSet(domains);
  }
}
