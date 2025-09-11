export type ParsingResult<T> =
  | { input: string; ast: T }
  | { input: string; error: string[] };
