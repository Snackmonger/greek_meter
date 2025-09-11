import { TlgBetacodeLexer } from "./tlg.lexer";
import { TokenType } from "../../common/enums";
import {
  IGreekAlphabeticChar,
  IGreekCharacterNode,
  IGreekCharacterNodeFactory,
  IGreekEditorialSymbol,
  IGreekPunctuation,
  IGreekVowel,
  IToken,
} from "../../common/interfaces";
import { TextParser } from "../text_parser";
import { ParsingResult } from "../../common/parser.types";

/**
 * Parser-transformer that accepts the 'strict' form of beta code as used
 * by TLG and outputs a simple syntax tree representing the characters.
 */
export class TlgBetacodeParser extends TextParser {
  private astNodeFactory: IGreekCharacterNodeFactory;

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
   * Parse a text in the TLG beta code formatting and return an AST
   * representing the Greek characters.
   *
   * @param text
   * @returns
   */
  public parse(text: string): ParsingResult<IGreekCharacterNode[]> {
    this.items = TlgBetacodeLexer.tokenize(text);
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
      return { input: text, error: this.errors };
    }
    return { input: text, ast: characters };
  }

  /**
   * Parse a top-level syntax element by delegating to the lower-level syntax
   * element parse methods.
   *
   * @returns A syntax element, expressed as an concrete implementation
   * of `IGreekCharacterNode`
   */
  private parseElement(): IGreekCharacterNode | null {
    if (this.match(TokenType.UPPERCASE)) {
      return this.parseUppercase();
    }
    if (this.matchPunctuation()) {
      return this.parsePunctuation();
    }
    if (this.matchEditorial()) {
      return this.parseEditorialSymbol();
    }
    // Text was tokenized but hasn't matched by now; can only be lowercase.
    return this.parseLowercase();
  }

  /**
   * Parse a consonant.
   *
   * @param isUppercase Flag whether to mark the consonant as uppercase.
   * @returns           A node representing a consonant.
   */
  private parseConsonant(
    isUppercase: boolean
  ): IGreekAlphabeticChar & IGreekCharacterNode {
    let hasUnderdot = false;
    if (this.match(TokenType.UNDERDOT)) {
      hasUnderdot = true;
    }
    return this.astNodeFactory.GreekConsonant({
      name: this.previous()!,
      isUppercase: isUppercase,
      hasUnderdot: hasUnderdot,
    });
  }

  /**
   * Parse a lowercase alphabetic character.
   *
   * @returns A character node for a lowercase letter, or null if none
   * can be parsed at the current position.
   */
  private parseLowercase():
    | (IGreekVowel & IGreekCharacterNode)
    | (IGreekAlphabeticChar & IGreekCharacterNode)
    | null {
    if (this.matchConsonant()) {
      return this.parseConsonant(false);
    }
    let accent: IToken | null = null;
    let vowel: IToken;
    let breathing: IToken | null = null;
    let modifier: IToken | null = null;
    let hasUnderdot = false;

    if (!this.matchVowel()) {
      // Consume a dummy value. This will generate the error message at the
      // current position.
      this.consume(TokenType.ALPHA, "Expected a vowel");
      return null;
    }
    vowel = this.previous()!;

    if (this.match(TokenType.ROUGH, TokenType.SMOOTH)) {
      breathing = this.previous();
    }

    if (this.match(TokenType.ACUTE, TokenType.GRAVE, TokenType.CIRCUMFLEX)) {
      accent = this.previous();
    }

    if (this.match(TokenType.DIAERESIS, TokenType.SUBSCRIPT)) {
      modifier = this.previous();
    }

    if (this.match(TokenType.UNDERDOT)) {
      hasUnderdot = true;
    }
    return this.astNodeFactory.GreekVowel({
      name: vowel,
      accent: accent,
      breathing: breathing,
      modifier: modifier,
      isUppercase: true,
      hasUnderdot: hasUnderdot,
    });
  }

  /**
   * Parse an uppercase alphabetic character.
   *
   * @returns A node representing an uppercase vowel or consonant,
   * or null, if none can be parsed at the current position.
   */
  private parseUppercase():
    | (IGreekVowel & IGreekCharacterNode)
    | (IGreekAlphabeticChar & IGreekCharacterNode)
    | null {
    if (this.matchConsonant()) {
      return this.parseConsonant(true);
    }

    let accent: IToken | null = null;
    let vowel: IToken;
    let breathing: IToken | null = null;
    let modifier: IToken | null = null;
    let hasUnderdot = false;

    if (this.match(TokenType.ROUGH, TokenType.SMOOTH)) {
      breathing = this.previous();
    }

    if (this.match(TokenType.ACUTE, TokenType.GRAVE, TokenType.CIRCUMFLEX)) {
      accent = this.previous();
    }

    if (!this.matchVowel()) {
      // Consume a dummy value. This will generate the error message at the
      // current position.
      this.consume(TokenType.ALPHA, "Expected a vowel");
      return null;
    }
    vowel = this.previous()!;

    if (this.match(TokenType.DIAERESIS, TokenType.SUBSCRIPT)) {
      modifier = this.previous();
    }

    if (this.match(TokenType.UNDERDOT)) {
      hasUnderdot = true;
    }
    return this.astNodeFactory.GreekVowel({
      name: vowel,
      accent: accent,
      breathing: breathing,
      modifier: modifier,
      isUppercase: true,
      hasUnderdot: hasUnderdot,
    });
  }

  /**
   * Parse an editorial symbol.
   *
   * @returns A node representing an editorial symbol.
   */
  private parseEditorialSymbol(): IGreekEditorialSymbol & IGreekCharacterNode {
    let data: IGreekEditorialSymbol = { symbolType: this.previous()! };
    if (this.match(TokenType.DIGIT)) {
      data.value = this.previous()!.value as number;
    }
    return this.astNodeFactory.GreekEditorialSymbol(data);
  }

  /**
   * Parse a punctuation symbol.
   *
   * @returns A node representing a punctuation symbol.
   */
  private parsePunctuation(): IGreekPunctuation & IGreekCharacterNode {
    return this.astNodeFactory.GreekPunctuation({
      punctuationType: this.previous()!,
    });
  }

  private matchVowel(): boolean {
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

  private matchConsonant(): boolean {
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

  private matchPunctuation(): boolean {
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

  private matchEditorial(): boolean {
    return this.match(
      TokenType.OPEN_BRACKET,
      TokenType.CLOSE_BRACKET,
      TokenType.OPEN_TEXT_FORMATTING,
      TokenType.CLOSE_TEXT_FORMATTING,
      TokenType.PAGE_FORMATTING,
      TokenType.ADDITIONAL_PUNCTUATION,
      TokenType.ADDITIONAL_CHARACTER,
      TokenType.QUOTATION_MARK,
      TokenType.MARKUP,
      TokenType.GREEK_STYLE,
      TokenType.LATIN_STYLE
    );
  }
}
