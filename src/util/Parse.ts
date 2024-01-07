import { Is } from "@dec-land/as-is";

export type Unknown<T> = unknown | T;

/**
 * Helper functions for parsing strings or unknowns as certain types
 * @class Parse
 */
class Parse {
  /**
   * Returns the given value if the type-guard matches, otherwise returns null.
   */
  public static as<T>(
    value: unknown,
    guard: (value: unknown) => value is T,
    defaultValue?: Unknown<T>
  ): Unknown<T>;

  public static as<T>(
    value: unknown,
    guard: (value: unknown) => boolean,
    defaultValue?: Unknown<T>
  ): Unknown<T>;

  public static as<T>(
    value: unknown,
    guard: (value: unknown) => boolean,
    defaultValue: Unknown<T> = null
  ): Unknown<T> {
    return guard(value) ? value : defaultValue;
  }

  /**
   * Parses the given string as an integer.
   * @return a number (or null if defaultValue = null and value is not an integer)
   */
  public static integer<T, Default = null>(
    value: T,
    defaultVal?: Default
  ): T extends number ? T : Default extends undefined ? null : Default {
    // TODO - fix the complaining of the typing here
    if (value === "" || value == null) return (defaultVal ?? null) as any;
    const parsed = Number(value);
    return Parse.as(parsed, Is.integer, defaultVal) as any;
  }
}

export default Parse;
