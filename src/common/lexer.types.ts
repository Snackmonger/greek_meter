import { IToken } from "./interfaces/lexing";

/**
 * A template for token type pattern matches.
 */
export type TokenTemplate = {
  tokenType: string;
  regexPattern: RegExp;
  callback?: (lexeme: string) => any;
};

/**
 * An object that returns an instance of an implementation of `IToken`
 */
export type TokenConstructor<T extends IToken = IToken> = new (
  tokenType: string,
  lexeme: string,
  start: number,
  end: number,
  line: number,
  column: number
) => T;
