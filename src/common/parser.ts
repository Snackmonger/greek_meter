/**
 * A generic base class for a parser.
 *
 * P is the input, e.g. a string of text to be parsed
 * Q is an identifier by which a category of T is recognized, e.g. a token type
 * R is the result of the parse, e.g. an abstract syntax tree
 * T is the parse node, e.g. a lexical token
 */
export default abstract class ParserBase<P, Q, R, T> {
  protected currentPosition: number = 0;
  protected items: T[] = [];
  protected errors: string[] = [];

  /**
   * This method will be implemented by subclasses to provide the orchestration
   * of their own parse tree. Usually, we assign a method to each rule, then
   * call the top level rule from the `parse` method, but this is not strictly
   * necessary, and all behaviour can be stuffed in this method if you want.
   *
   * @param input The input to be parsed and returned as a `ParsingResult` AST.
   * @returns A parsing result representing the AST of the input.
   */
  public abstract parse(input: P): R;

  /**
   * This method will be implemented by subclasses to provide a means by which
   * the parser can check whether the item `T` at the current position can be
   * identified by identifier `Q`
   *
   * @param identifier  A means by which the item `T` can be identified.
   */
  protected abstract check(identifier: Q): boolean;

  /**
   * This method will be implemented by subclasses to provide an error message
   * when the parser fails to `consume` an item `T`, using appropriate data
   * from `T`
   *
   * @param errorMsg    A description of the error, to which this method will
   *                    add specific item data to complete the message.
   */
  protected abstract makeErrorMsg(errorMsg: string): string;

  /**
   * Return the parser to its initial state.
   */
  public reset(): void {
    this.currentPosition = 0;
    this.items = [];
    this.errors = [];
  }

  /**
   * Indicate whether the parser has reached the end of the tokens.
   *
   * @returns True, if the parser has reached the end of the token stream.
   */
  protected isAtEnd(): boolean {
    return this.currentPosition >= this.items.length;
  }

  /**
   * Look at the token that is (+/-) n tokens from the current index.
   *
   * @param tokens The number of tokens ahead of the current index to check.
   *
   * @returns A token, if one is found at the requested position, or null if not.
   */
  protected lookAround(tokens: number): T | null {
    let pos = this.currentPosition + tokens;
    if (pos < 0 || pos >= this.items.length) {
      return null;
    }
    return this.items[pos];
  }

  /**
   * Return the current token and move the counter ahead by one token.
   *
   * @returns The token at the previously-current position.
   */
  protected advance(): T {
    let token = this.items[this.currentPosition];
    this.currentPosition += 1;
    return token;
  }

  /**
   * Asssert that the next token is of the given type, advance the counter,
   * and return the token, or log the given error if the assertion fails.
   *
   * @param identifier
   * @param errorMessage
   * @returns
   */
  protected consume(identifier: Q, errorMessage: string): T | null {
    // Success path.
    if (this.check(identifier)) {
      return this.advance();
    }
    this.addError(this.makeErrorMsg(errorMessage));
    return null;
  }

  /**
   * Flag to indicate whether the parser had an error during parsing.
   *
   * @returns True, if at least one error was encountered.
   */
  protected hadError(): boolean {
    return this.errors.length > 0;
  }

  /**
   * Return the single token at the position before the current position,
   * or null if there is none.
   *
   * @returns A token, if there is one, or null if not.
   */
  protected previous(): T | null {
    return this.lookAround(-1);
  }

  /**
   * Return the token at the current position, or null if there is none.
   *
   * @returns A token, if there is one, or null if not.
   */
  protected current(): T | null {
    return this.lookAround(0);
  }

  protected peek(): T | null {
    return this.lookAround(1);
  }

  protected peekNext(): T | null {
    return this.lookAround(2);
  }

  protected match(...identifiers: Q[]): boolean {
    for (let identifier of identifiers) {
      if (this.check(identifier)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  protected addError(message: string) {
    this.errors.push(message);
  }
}
