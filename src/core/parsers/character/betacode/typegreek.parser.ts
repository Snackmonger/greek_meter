import { TokenType } from "../../../common/enums";
import {
  IGreekAlphabeticData,
  IGreekCharacterNode,
  IGreekCharacterNodeFactory,
  IGreekPunctuationData,
  IGreekSpaceData,
  IGreekVowelData,
} from "../../../common/interfaces/character";
import { IToken } from "../../../common/interfaces/lexing";
import { ParsingResult } from "../../../common/parser.types";
import {
  isAccent,
  isBreathing,
  isModifier,
  isUpper,
} from "../../../common/syntax_helpers";
import { CharacterParser } from "../character/character_parser";
import { TypeGreekBetacodeLexer } from "./typegreek.lexer";

export class TypegreekBetacodeParser extends CharacterParser {
  protected astNodeFactory: IGreekCharacterNodeFactory;

  /**
   * Initialize the parser.
   *
   * @param astNodeFactory A factory object that will provide concrete
   * implementations of the node interfaces expected by the interpreter.
   */
  constructor(astNodeFactory: IGreekCharacterNodeFactory) {
    super();
    this.astNodeFactory = astNodeFactory;
  }

  /**
   * Parse a string of text as a TypeGreek beta code
   *
   * @param text  Text in TypeGreek beta code.
   * @returns     A parsing result with a Character node AST
   */
  public parse(text: string): ParsingResult<IGreekCharacterNode[]> {
    this.reset();
    this.nodes = TypeGreekBetacodeLexer.tokenize(text);
    let characters: IGreekCharacterNode[] = [];
    let element: IGreekCharacterNode | null;
    while (!this.isAtEnd()) {
      element = this.parseElement();
      if (element !== null) {
        characters.push(element);
      } else {
        // Attempt to resynchronize 1 token at a time until parse succeeds.
        this.advance();
      }
    }
    if (this.hadError()) {
      return { ok: false, error: this.errors };
    }
    return { ok: true, ast: characters };
  }

  /**
   * Delegate element parsing to the correct sub-procedure.
   *
   * @returns   A node corresponding to the type of character
   *            parsed at the current position.
   */
  protected parseElement(): IGreekCharacterNode | null {
    if (this.matchVowel()) {
      return this.parseVowel();
    }
    if (this.matchConsonant()) {
      return this.parseConsonant();
    }
    if (this.matchPunctuation()) {
      return this.parsePunctuation();
    }
    if (this.match(TokenType.WHITESPACE, TokenType.TAB, TokenType.NEWLINE)) {
      return this.parseWhitespace();
    }
    return null;
  }

  protected parseWhitespace(): IGreekSpaceData & IGreekCharacterNode {
    return this.astNodeFactory.GreekSpace({
      token: this.previous()!,
    });
  }

  protected parsePunctuation(): IGreekPunctuationData & IGreekCharacterNode {
    let data: IGreekPunctuationData = { punctuationType: this.previous()! };
    return this.astNodeFactory.GreekPunctuation(data);
  }

  protected parseConsonant(): IGreekAlphabeticData & IGreekCharacterNode {
    let consonant = this.previous()!;
    let data: IGreekAlphabeticData = { name: consonant };
    if (isUpper(consonant.lexeme)) {
      data.isUppercase = true;
    }
    if (this.match(TokenType.UNDERDOT)) {
      this.advance();
      data.hasUnderdot = true;
    }
    return this.astNodeFactory.GreekConsonant(data);
  }

  protected parseVowel(): IGreekVowelData & IGreekCharacterNode {
    let vowel = this.previous()!;
    let data: IGreekVowelData = { name: vowel };
    if (isUpper(vowel.lexeme)) {
      data.isUppercase = true;
    }
    let diacritics: IToken[] = [];
    if (this.match(TokenType.UNDERDOT)) {
      data.hasUnderdot = true;
    }
    while (this.matchDiacritic()) {
      diacritics.push(this.previous()!);
    }
    if (this.match(TokenType.UNDERDOT)) {
      data.hasUnderdot = true;
    }
    // Collect all diacritics, but only register the last one in each
    // category.
    for (let d of diacritics) {
      if (isAccent(d.tokenType)) {
        data.accent = d;
      } else if (isBreathing(d.tokenType)) {
        data.breathing = d;
      } else if (isModifier(d.tokenType)) {
        data.modifier = d;
      }
    }
    return this.astNodeFactory.GreekVowel(data);
  }

  protected matchVowel(): boolean {
    return this.match(
      TokenType.ALPHA,
      TokenType.EPSILON,
      TokenType.ETA,
      TokenType.IOTA,
      TokenType.OMICRON,
      TokenType.UPSILON,
      TokenType.OMEGA
    );
  }

  protected matchDiacritic(): boolean {
    return this.match(
      TokenType.ACUTE,
      TokenType.GRAVE,
      TokenType.DIAERESIS,
      TokenType.CIRCUMFLEX,
      TokenType.SUBSCRIPT,
      TokenType.ROUGH,
      TokenType.SMOOTH
    );
  }

  protected matchConsonant(): boolean {
    return this.match(
      TokenType.BETA,
      TokenType.GAMMA,
      TokenType.DELTA,
      TokenType.ZETA,
      TokenType.THETA,
      TokenType.KAPPA,
      TokenType.LAMBDA,
      TokenType.MU,
      TokenType.NU,
      TokenType.XI,
      TokenType.PI,
      TokenType.RHO,
      TokenType.SIGMA,
      TokenType.TAU,
      TokenType.PHI,
      TokenType.CHI,
      TokenType.PSI,
      TokenType.DIGAMMA
    );
  }

  protected matchPunctuation(): boolean {
    return this.match(
      TokenType.COMMA,
      TokenType.PERIOD,
      TokenType.MIDDLEDOT,
      TokenType.MISSING_LETTER,
      TokenType.QUESTION,
      TokenType.APOSTROPHE,
      TokenType.EMDASH,
      TokenType.ENDASH
    );
  }
}
