import { TokenType } from "../../../common/enums";
import {
  IGreekAlphabeticNode,
  IGreekCharacterNode,
  IGreekCharacterNodeFactory,
  IGreekEditorialNode,
  IGreekPunctuationNode,
  IGreekSpaceNode,
  IGreekVowelNode,
} from "../../../common/interfaces/character";
import { IToken } from "../../../common/interfaces/lexing";
import { ParsingResult } from "../../../common/parser.types";
import { CharacterParser } from "../character/character_parser";
import { TlgBetacodeLexer } from "./tlg.lexer";

/**
 * Parser-transformer that accepts the 'strict' form of beta code as used
 * by TLG and outputs a simple syntax tree representing the characters.
 */
export class TlgBetacodeParser extends CharacterParser<ParsingResult<IGreekCharacterNode[]>> {
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
   * Parse a text in the TLG beta code formatting and return an AST
   * representing the Greek characters.
   *
   * @param text    Text in the TLG beta code formatting
   * @returns       A character node AST representing the text.
   */
  public parse(text: string): ParsingResult<IGreekCharacterNode[]> {
    this.reset();
    this.nodes = TlgBetacodeLexer.tokenize(text);
    this.text = text;
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
   * Parse a top-level syntax element by delegating to the lower-level syntax
   * element parse methods.
   *
   * @returns A syntax element, expressed as an concrete implementation
   * of `IGreekCharacterNode`
   */
  protected parseElement(): IGreekCharacterNode | null {
    if (this.match(TokenType.UPPERCASE)) {
      return this.parseUppercase();
    }
    if (this.matchPunctuation()) {
      return this.parsePunctuation();
    }
    if (this.matchEditorial()) {
      return this.parseEditorialSymbol();
    }
    if (this.match(TokenType.WHITESPACE, TokenType.TAB, TokenType.NEWLINE)) {
      return this.parseWhitespace();
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
  protected parseConsonant(
    isUppercase: boolean,
    annotation?: object
  ): IGreekAlphabeticNode {
    let hasUnderdot = false;
    let consonant = this.previous()!;

    // If this method was called on an uppercase rho, it already has
    // a breathing annotation and doesn't need to be checked here.
    if (consonant.tokenType === TokenType.RHO && !isUppercase) {
      this.match(TokenType.SMOOTH, TokenType.ROUGH);
      annotation = { breathing: this.previous() };
    }

    // Normally sigma is just converted based on position, but it can accept
    // a trailing digit to control its appearance.
    if (consonant!.tokenType === TokenType.SIGMA) {
      if (this.match(TokenType.DIGIT)) {
        annotation = { digit: this.previous() };
      }
    }

    if (this.match(TokenType.UNDERDOT)) {
      hasUnderdot = true;
    }

    return this.astNodeFactory.GreekConsonant({
      name: consonant,
      isUppercase: isUppercase,
      hasUnderdot: hasUnderdot,
      annotation: annotation,
    });
  }

  /**
   * Parse a lowercase alphabetic character.
   *
   * @returns A character node for a lowercase letter, or null if none
   * can be parsed at the current position.
   */
  protected parseLowercase(): IGreekVowelNode | IGreekAlphabeticNode | null {
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
      isUppercase: false,
      hasUnderdot: hasUnderdot,
    });
  }

  /**
   * Parse an uppercase alphabetic character.
   *
   * @returns A node representing an uppercase vowel or consonant,
   * or null, if none can be parsed at the current position.
   */
  protected parseUppercase(): IGreekVowelNode | IGreekAlphabeticNode | null {
    if (this.matchConsonant()) {
      return this.parseConsonant(true);
    }
    let vowel: IToken | null = null;
    let accent: IToken | null = null;
    let breathing: IToken | null = null;
    let modifier: IToken | null = null;
    let hasUnderdot = false;

    if (this.match(TokenType.ROUGH, TokenType.SMOOTH)) {
      breathing = this.previous();

      // Rho is the only consonant that might take a diacritic.
      if (this.match(TokenType.RHO)) {
        return this.parseConsonant(true, { breathing: breathing });
      }
    }

    if (this.match(TokenType.ACUTE, TokenType.GRAVE, TokenType.CIRCUMFLEX)) {
      accent = this.previous();
    }
    if (!this.matchVowel()) {
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
  protected parseEditorialSymbol(): IGreekEditorialNode {
    let symbolType = this.previous()!;
    let value: number | null = null;
    if (this.match(TokenType.DIGIT)) {
      value = this.previous()!.value as number;
    }
    return this.astNodeFactory.GreekEditorialSymbol({
      symbolType: symbolType,
      value: value,
    });
  }

  /**
   * Parse a punctuation symbol.
   *
   * @returns A node representing a punctuation symbol.
   */
  protected parseWhitespace(): IGreekSpaceNode {
    return this.astNodeFactory.GreekSpace({
      token: this.previous()!,
    });
  }

  /**
   * Parse a punctuation symbol.
   *
   * @returns A node representing a punctuation symbol.
   */
  protected parsePunctuation(): IGreekPunctuationNode {
    return this.astNodeFactory.GreekPunctuation({
      punctuationType: this.previous()!,
    });
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

  protected matchEditorial(): boolean {
    return this.match(
      TokenType.OPEN_BRACKET,
      TokenType.CLOSE_BRACKET,
      TokenType.OPEN_TEXT_FORMATTING,
      TokenType.CLOSE_TEXT_FORMATTING,
      TokenType.PAGE_FORMATTING,
      TokenType.ADDITIONAL_PUNCTUATION,
      TokenType.ADDITIONAL_CHARACTER,
      TokenType.QUOTATION_MARK,
      TokenType.OPEN_BRACE,
      TokenType.CLOSE_BRACE,
      TokenType.GREEK_STYLE,
      TokenType.LATIN_STYLE
    );
  }
}
