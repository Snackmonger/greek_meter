import { TokenType } from "../../common/enums";
import {
  IGreekAlphabeticChar,
  IGreekCharacterNode,
  IGreekCharacterNodeVisitor,
  IGreekEditorialSymbol,
  IGreekPunctuation,
  IGreekSpaceChar,
  IGreekVowel,
  IToken,
} from "../../common/interfaces";

/**
 * A Greek consonant glyph; either a single character, or a character plus
 * underdot.
 */
export class GreekConsonantNode
  implements IGreekCharacterNode, IGreekAlphabeticChar
{
  public name: IToken;
  public isUppercase: boolean;
  public hasUnderdot: boolean;

  constructor(
    name: IToken,
    isUppercase: boolean = false,
    hasUnderdot: boolean = false
  ) {
    this.name = name;
    this.isUppercase = isUppercase;
    this.hasUnderdot = hasUnderdot;
  }

  public accept(visitor: IGreekCharacterNodeVisitor) {
    return visitor.visitGreekConsonant(this);
  }
}


export class GreekEditorialSymbolNode
  implements IGreekCharacterNode, IGreekEditorialSymbol
{
  public symbolType: IToken;
  public value: number | null;

  constructor(symbolType: IToken, value: number | null = null) {
    this.symbolType = symbolType;
    this.value = value;
  }

  public accept(visitor: IGreekCharacterNodeVisitor): any {
    return visitor.visitGreekEditorialSymbol(this);
  }
}


/**
 * A Greek consonant glyph; either a single character, or a character plus
 * underdot.
 */
export class GreekPunctuationNode
  implements IGreekCharacterNode, IGreekPunctuation
{
  public punctuationType: IToken;

  constructor(punctuationType: IToken) {
    this.punctuationType = punctuationType;
  }

  public accept(visitor: IGreekCharacterNodeVisitor) {
    return visitor.visitGreekPunctuation(this);
  }
}

export class GreekSpaceNode implements IGreekCharacterNode, IGreekSpaceChar {
  token: IToken;

  constructor(token: IToken) {
    this.token = token;
  }

  accept(visitor: IGreekCharacterNodeVisitor) {
    return visitor.visitGreekSpace(this);
  }
}

/**
 * A Greek vowel glyph, which is a vowel character, possibly with
 * diacritic characters modifying it.
 */
export class GreekVowelNode implements IGreekCharacterNode, IGreekVowel {
  public accent: IToken| null;
  public breathing: IToken| null;
  public modifier: IToken| null;

  public name: IToken;
  public isUppercase: boolean;
  public hasUnderdot: boolean;

  constructor(
    name: IToken,
    accent: IToken | null = null,
    breathing: IToken | null = null,
    modifier: IToken | null = null,
    isUppercase: boolean = false,
    hasUnderdot: boolean = false
  ) {
    this.name = name;
    this.accent = accent;
    this.breathing = breathing;
    this.modifier = modifier;
    this.isUppercase = isUppercase;
    this.hasUnderdot = hasUnderdot;
  }

  public accept(visitor: IGreekCharacterNodeVisitor) {
    return visitor.visitGreekVowel(this);
  }

  /**
   * Flag indicating whether this vowel can begin a diphthong.
   *
   * @returns True, if this vowel can begin a diphthong.
   */
  public canBeginDiphthong(): boolean {
    if (
      this.accent !== null ||
      this.modifier !== null ||
      this.breathing !== null ||
      this.name.tokenType === TokenType.IOTA ||
      this.name.tokenType === TokenType.OMEGA
    ) {
      return false;
    }
    return true;
  }

  /**
   * Flag indicating whether this vowel can end a diphthong.
   *
   * @returns True, if this vowel can end a diphthong.
   */
  public canEndDiphthong(): boolean {
    if (
      this.modifier?.tokenType === TokenType.DIAERESIS ||
      this.name.tokenType === TokenType.ALPHA ||
      this.name.tokenType === TokenType.OMICRON ||
      this.name.tokenType === TokenType.OMEGA ||
      this.name.tokenType === TokenType.ETA ||
      this.name.tokenType === TokenType.EPSILON
    ) {
      return false;
    }
    return true;
  }

  /**
   * Check whether this vowel can form a diphthong with the following vowel.
   *
   * This check considers not only the type of vowel, but also the presence of
   * any diacritical marks.
   *
   * @param other   The vowel that follows this vowel.
   * @returns       True, if the two vowels can form a diphthong.
   */
  public canFormDiphthong(other: GreekVowelNode): boolean {
    // Some vowels can form diphthongs with one high vowel but not
    // the other: ηυ pass, ηι fail, υι pass, υυ fail
    if (
      (this.name.tokenType === TokenType.ETA &&
        other.name.tokenType === TokenType.IOTA) ||
      (this.name.tokenType === TokenType.UPSILON &&
        other.name.tokenType === TokenType.UPSILON)
    ) {
      return false;
    }
    return this.canBeginDiphthong() && other.canEndDiphthong();
  }
}
