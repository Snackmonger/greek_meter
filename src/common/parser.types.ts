export type ParsingResult<T> =
  | { ok: true; ast: T }
  | { ok: false; error: string[] };
