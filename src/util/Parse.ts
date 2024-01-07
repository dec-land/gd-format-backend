import { Is } from "@dec-land/as-is";

export type Unknown<T> = unknown | T;

/**
 * Helper functions for parsing strings or unknowns as certain types
 * @class Parse
 */
class Parse {
  private static readonly truthy = ["true", "1", "y", "yes"];

  private static readonly falsy = ["false", "0", "n", "no"];

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
   * Parses the given string as an boolean.
   * @return a boolean (or null if defaultValue = null and value is not a boolean)
   */
  public static boolean(
    value: unknown,
    defaultVal: unknown = null
  ): Unknown<boolean> {
    if (Is.boolean(value)) return Boolean(value);
    // Cannot parse as boolean if not a string
    if (!Is.string(value)) return defaultVal;
    const lower = value?.toLowerCase();
    if (Parse.truthy.indexOf(lower) !== -1) return true;
    if (Parse.falsy.indexOf(lower) !== -1) return false;
    return defaultVal;
  }

  /**
   * Parses the given string as an integer.
   * @return a number (or null if defaultValue = null and value is not an integer)
   */
  public static integer(
    value: unknown,
    defaultVal: unknown = null
  ): Unknown<number> {
    if (value === "" || value == null) return defaultVal;
    const parsed = Number(value);
    return Parse.as(parsed, Is.integer, defaultVal);
  }

  /**
   * Parses the given string as a number.
   * @return a number (or null if defaultValue = null and value is not a number)
   */
  public static number(
    value: unknown,
    fractionDigits?: number,
    defaultVal: unknown = null
  ): Unknown<number> {
    if (value === "" || value == null) return defaultVal;
    let parsed = Number(value);
    if (fractionDigits != null) parsed = Number(parsed.toFixed(fractionDigits));
    return Parse.as(parsed, Is.number, defaultVal);
  }

  /**
   * Parses the given string as an array of a specific type.
   * @return an array of T and null values
   */
  public static arrayOf<T>(
    value: string,
    innerReader: (value: unknown) => Unknown<T>,
    delimiter = ",",
    escapeChar?: string
  ): Unknown<T>[] | string {
    if (!Is.string(value)) return value;
    const strings =
      escapeChar && value.includes(escapeChar)
        ? this.splitStringWithEscapeChar(value, delimiter, escapeChar)
        : value.split(delimiter);
    return strings.map((str) => innerReader(str));
  }

  /**
   * Split a string into a string array using a delimiter. Also use an escape char to allow strings that have the delimiter in them.
   * @param {string} value The string to split
   * @param {string} delimiter The delimiter that splits the individual strings
   * @param {string} escapeChar The char to use to ensure that the string within includes a delimiter and should not be split.
   */
  private static splitStringWithEscapeChar(
    value: string,
    delimiter: string,
    escapeChar: string
  ) {
    // Regex example with , delimiter and ` escape char
    // /`([^`]*,?[^`]*)`|([^`,]+)/g;
    const regex = new RegExp(
      `${escapeChar}([^${escapeChar}]*${delimiter}?[^${escapeChar}]*)${escapeChar}|([^${escapeChar}${delimiter}]+)`,
      "g"
    );

    return [...(value.match(regex) || [])].map((v) =>
      v.replace(new RegExp(escapeChar, "g"), "")
    );
  }
}

export default Parse;
