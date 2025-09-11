import { TextSymbol } from "./enums";

export class UnexpectedCharacterError extends Error {
  constructor(
    public readonly excerpt: string,
    public readonly line: number,
    public readonly column: number
  ) {
    let arrow = TextSymbol.HYPHEN.repeat(column - 1) + TextSymbol.CARET;
    let diagram = `Near here:\n\t\t${excerpt}\n\t\t${arrow}`;
    let errMsg =
      `Lexer encountered an unexpected character at column ${column} on line ${line}:\n\t${diagram}`;
    super(errMsg);
  }
}


export class ParserError extends Error {

}