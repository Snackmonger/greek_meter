import { TextSymbol } from "../../common/enums";
import { IGreekCharacterNode } from "../../common/interfaces/character";
import { IToken } from "../../common/interfaces/lexing";
import { ParserBase, ParsingResult } from "../../common/parser";

/**
 * A subclass of `ParserBase` designed to parse string text into 
 * the `IGreekCharacterNode` intermediary representation.
 */
export abstract class CharacterParser extends ParserBase<
  string,
  string,
  ParsingResult<IGreekCharacterNode[]>,
  IToken
> {
  protected text: string = "";

  /**
   * Generate an error diagram according to the token at the current position
   * and append it to the given error message.
   *
   * @param errorMsg  A message about the error.
   * @returns         The original message, plus a diagram of the problem area
   */
  protected makeErrorMsg(errorMsg: string): string {
    // Edge case: parse error at pos 0 with no tokens.
    let tLine = 0;
    let tCol = 0;

    // Normal error case.
    if (this.currentPosition != 0) {
      let token = this.nodes[this.currentPosition - 1];
      tCol = token.column;
      tLine = token.line;
    }

    // Create error diagram.
    let arrow = TextSymbol.HYPHEN.repeat(tCol) + TextSymbol.CARET;
    let excerpt: string;
    if (this.text.includes(TextSymbol.NEWLINE)) {
      excerpt = this.text.split(TextSymbol.NEWLINE)[tLine];
    } else {
      excerpt = this.text;
    }
    let diagram = `Near here (column ${tCol} on line ${tLine}):\n\t\t${excerpt}\n\t\t${arrow}`;
    return `${errorMsg}: \n\t${diagram}`;
  }

  protected check(identifier: string): boolean {
    return this.current()?.tokenType == identifier;
  }
}
