package com.cermati.satpam;

/**
 * Java stand-in for JavaScript's {@code undefined}.
 *
 * <p>satpam treats a missing property ({@code undefined}) differently from a property that is
 * present but {@code null}, e.g. the {@code boolean} rule accepts a missing value but rejects
 * {@code null}. Validators receive {@link #INSTANCE} when the property is absent from the input.
 */
public final class Undefined {
  public static final Undefined INSTANCE = new Undefined();

  private Undefined() {
  }

  @Override
  public String toString() {
    return "undefined";
  }
}
