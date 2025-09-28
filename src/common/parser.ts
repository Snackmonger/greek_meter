
/**
 * A generic base class for a parser.
 *
 * Input is the input, e.g. a string of text to be parsed
 * Identifier is an identifier by which a category of T is recognized, e.g. a token type
 * Return is the result of the parse, e.g. an abstract syntax tree
 * ParseNode is the parse node, e.g. a lexical token
 */
export abstract class ParserBase<Input, Identifier, Return, ParseNode> {
  protected currentPosition: number = 0;
  protected nodes: ParseNode[] = [];
  protected errors: string[] = [];

  /**
   * This method will be implemented by subclasses to provide the orchestration
   * of their own parse tree. Usually, we assign a method to each rule, then
   * call the top level rule from the `parse` method, but this is not strictly
   * necessary, and all behaviour can be stuffed in this method if you want.
   *
   * @param input The `Input` input to be parsed.
   * @returns     A parsing `Return` representing the AST of the input.
   */
  public abstract parse(input: Input): Return;

  /**
   * This method will be implemented by subclasses to provide a means by which
   * the parser can check whether the item `ParseNode` at the current position
   * can be identified by identifier `Identifier`
   *
   * @param identifier  A means by which the item `ParseNode` can be identified.
   */
  protected abstract check(identifier: Identifier): boolean;

  /**
   * This method will be implemented by subclasses to provide an error message
   * when the parser fails to `consume` an item `ParseNode`, using appropriate data
   * from `ParseNode`
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
    this.nodes = [];
    this.errors = [];
  }

  /**
   * Indicate whether the parser has reached the end of the node streams.
   *
   * @returns True, if the parser has reached the end of the node stream.
   */
  protected isAtEnd(): boolean {
    return this.currentPosition >= this.nodes.length;
  }

  /**
   * Look at the parse node that is (+/-) n nodes from the current index.
   *
   * @param nodes The number of nodes ahead of the current index to check.
   *
   * @returns A node, if one is found at the requested position, or null if not.
   */
  protected lookAround(nodes: number): ParseNode | null {
    let pos = this.currentPosition + nodes;
    if (pos < 0 || pos >= this.nodes.length) {
      return null;
    }
    return this.nodes[pos];
  }

  /**
   * Return the current node and move the counter ahead by one node.
   *
   * @returns The node at the previously-current position.
   */
  protected advance(): ParseNode {
    let node = this.nodes[this.currentPosition];
    this.currentPosition += 1;
    return node;
  }

  /**
   * Asssert that the next node is of the given type, advance the counter,
   * and return the node, or log the given error if the assertion fails.
   *
   * @param identifier
   * @param errorMessage
   * @returns
   */
  protected consume(
    identifier: Identifier,
    errorMessage: string
  ): ParseNode | null {
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
   * Return the single node at the position before the current position,
   * or null if there is none.
   *
   * @returns A node, if there is one, or null if not.
   */
  protected previous(): ParseNode | null {
    return this.lookAround(-1);
  }

  /**
   * Return the node at the current position, or null if there is none.
   *
   * @returns A node, if there is one, or null if not.
   */
  protected current(): ParseNode | null {
    return this.lookAround(0);
  }

  /**
   * Return the node at counter +1 or null if none exists.
   * @returns
   */
  protected peek(): ParseNode | null {
    return this.lookAround(1);
  }

  /**
   * Return the node at counter +2 or null if none exists.
   * @returns
   */
  protected peekNext(): ParseNode | null {
    return this.lookAround(2);
  }

  /**
   * Check whether the given identifier is found at the current position;
   * if so, return true and advance the counter.
   * @param identifiers   The identifier (e.g. token type) to check.
   * @returns   True, if the item at current position has identifier.
   */
  protected match(...identifiers: Identifier[]): boolean {
    for (let identifier of identifiers) {
      if (this.check(identifier)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  /**
   * Register an error with the error log.
   * @param message   The message thar accompanies the error.
   */
  protected addError(message: string) {
    this.errors.push(message);
  }
}
