import { UnexpectedCharacterError } from "./errors";
import { TextSymbol } from "./enums";
import { ILexer, IToken } from "./interfaces";

/**
 * A template for token type pattern matches.
 */
type TokenTemplate = {
  tokenType: string;
  regexPattern: RegExp;
  callback?: (lexeme: string) => any;
};

/**
 * An object that returns an instance of an implementation of `IToken`
 */
type TokenConstructor<T extends IToken = IToken> = new (
  tokenType: string,
  lexeme: string,
  start: number,
  end: number,
  line: number,
  column: number
) => T;

/**
 * A text reader that sorts raw text into lexical categories.
 *
 * The `addRule` method is used to define rules for the set of terminals that
 * the lexer will try to match. The rules are expressed as a token type name,
 * a regular expression, and an optional callback (generally used to transform
 * literal values into their appropriate types).
 *
 * The `tokenize` method crawls through the source text and checks the list
 * of rules for regular expression matches at the current position. If no
 * match is found, an error will be raised with details about the problem
 * position. If multiple matches are found, then the `best` method is called,
 * which supplies logic for choosing the preferred match. In the default
 * implementation, this is the match with the longest literal is accepted.
 * You may override the `best` method in a subclass to change the behaviour.
 *
 * NOTE: The lexer does NOT have an option to ignore any characters
 * automatically. Therefore, whitespace, tabs, etc. have to be accounted
 * for in the rule set. If these tokens are not actually needed, then a list
 * of token type names can be passed as the `filterTypes` parameter to the
 * `tokenize` method in order to exclude them from the final result.
 */
export default class Lexer implements ILexer {
  private templates: TokenTemplate[] = [];
  private tokens: IToken[] = [];
  private tokenType: TokenConstructor;

  private _start: number = 0;
  private _line: number = 1;
  private _column: number = 1;

  constructor(tokenType: TokenConstructor) {
    this.tokenType = tokenType;
  }

  /**
   * Define a new token production rule that will be considered when
   * tokenizing the source text.
   *
   * @param tokenType         The name of the token's lexical category.
   * @param regexPattern      A regular expression defining the lexeme.
   * @param callback          An optional transformer for the lexeme's type.
   */
  public addRule(
    tokenType: string,
    regexPattern: RegExp,
    callback?: (lexeme: string) => unknown
  ): ILexer {
    this.templates.push({
      tokenType: tokenType,
      regexPattern: regexPattern,
      callback: callback,
    });
    return this;
  }

  /**
   * Attempt to sort a source text into lexical categories, represented
   * as tokens.
   *
   * IMPORTANT: The lexer does not ignore whitespaces, newlines, tabs, etc.
   * by default. You must define a token template to capture unwanted
   * characters, then you can add them to the a list of `filter_types`,
   * which will omit tokens with those labels from the final return.
   *
   * @param text          A source document to be tokenized.
   * @param filterTypes   Token type names that will be excluded from output.
   *
   * @returns             A list of tokens representing the source text.
   */
  public tokenize(text: string, ...filterTypes: string[]): IToken[] {
    this.tokens = [];
    let best: IToken | null;
    let token: IToken | null;
    while (this.start < text.length) {
      best = null;
      for (let template of this.templates) {
        token = this.match(
          template,
          text,
          this.start,
          this.line,
          this.column
        );
        if (token == null) {
          continue;
        }
        if (best == null) {
          best = token;
        } else {
          best = this.best(best, token);
        }
      }
      if (best == null) {
        throw new UnexpectedCharacterError(
          text.split(TextSymbol.NEWLINE)[this.line - 1],
          this.line,
          this.column
        );
      }
      this.accept(best);
    }
    return this.tokens.filter((x) => !filterTypes.includes(x.tokenType));
  }

  /**
   * Check if a match can be made at the current position in the source
   * text and generate a token if so, or return null if not.
   *
   * @param text      The source text to be analyzed
   * @param start     The position in the text to check for a match
   * @param line      The linebreak-sensitive line count
   * @param column    The linebreak-sensistive column count
   *
   * @returns         A new token if the match was made or null if not.
   */
  public match(
    template: TokenTemplate,
    text: string,
    start: number,
    line: number,
    column: number
  ): IToken | null {
    let match = text.slice(start).match(template.regexPattern);
    if (!match) {
      return null;
    }
    if (match.index != 0) {
      return null;
    }

    let lexeme = match[0];
    let end = start + lexeme.length;
    for (let char of lexeme) {
      if (char == TextSymbol.NEWLINE) {
        line += 1;
        column = 1;
      }
    }

    let token = new this.tokenType(
      template.tokenType,
      lexeme,
      start,
      end,
      line,
      column
    );
    if (template.callback != undefined) {
      token.value = template.callback(lexeme);
    }
    return token;
  }

  /**
   * Compare the current best token to another token.
   *
   * By default, this checks the longest lexeme match. Override this
   * function or replace its logic to implement a different algorithm.
   *
   * @param best      The current best token.
   * @param other     Another token for comparison.
   *
   * @returns         The better of the two tokens.
   */
  protected best(best: IToken, other: IToken): IToken {
    return best.length >= other.length ? best : other;
  }

  /**
   * Accept the given token by adding it to the list of tokens and by
   * instructing the program counter to advance.
   *
   * @param token     The token to be accepted.
   */
  private accept(token: IToken) {
    this.tokens.push(token);
    if (token.line != this.line) {
      this._column = 1;
    } else {
      this._column += token.end - token.start;
    }
    this._start = token.end;
    this._line = token.line;
  }

  /**
   * The absolute position in the text to start reading from.
   *
   * @returns The index of the current position in the source text.
   */
  public get start(): number {
    return this._start;
  }

  /**
   * @returns The line in the text, relative to any newlines previously
   * encountered.
   */
  public get line(): number {
    return this._line;
  }

  /**
   * @returns The column in the text, relative to any newlines previously
   * encountered.
   */
  public get column(): number {
    return this._column;
  }
}
