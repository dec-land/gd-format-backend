// import { Is } from "@dec-land/as-is";
// import camelCase from "lodash.camelcase";
// import type { KeysToCamelCase } from "@root/Types/CamelCase";

// export function keysToCamelCase<T>(data: T): KeysToCamelCase<T>;
// export function keysToCamelCase<T>(data: T[]): KeysToCamelCase<T>[];
// export function keysToCamelCase<T>(data: T | T[]) {
//   if (Is.array(data)) return data.map((v) => keysToCamelCase(v));

//   if (Is.object(data) && !Is.function(data) && !Is.date(data)) {
//     return Object.entries(data).reduce(
//       (result, [key, value]) => ({
//         ...result,
//         [camelCase(key)]: keysToCamelCase(value),
//       }),
//       {} as KeysToCamelCase<T>
//     );
//   }
//   return data;
// }
