import { TokenType } from "../../common/enums";
import {
  IGreekAlphabeticData,
  IGreekCharacterNode,
  IGreekCharacterNodeVisitor,
  IGreekEditorialSymbolData,
  IGreekPunctuationData,
  IGreekSpaceData,
  IGreekVowelData,
  IGreekVowelNode,
} from "../../common/interfaces/character";
import { IToken } from "../../common/interfaces/lexing";

/**
 * A Greek consonant glyph; either a single character, or a character plus
 * underdot.
 */
export class GreekConsonantNode
  implements IGreekCharacterNode, IGreekAlphabeticData
{
  public name: IToken;
  public isUppercase: boolean;
  public hasUnderdot: boolean;
  public annotation: object;

  constructor(
    name: IToken,
    isUppercase: boolean = false,
    hasUnderdot: boolean = false,
    annotation: object = {}
  ) {
    this.name = name;
    this.isUppercase = isUppercase;
    this.hasUnderdot = hasUnderdot;
    this.annotation = annotation;
  }

  public accept(visitor: IGreekCharacterNodeVisitor) {
    return visitor.visitGreekConsonant(this);
  }
}

export class GreekEditorialSymbolNode
  implements IGreekCharacterNode, IGreekEditorialSymbolData
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
  implements IGreekCharacterNode, IGreekPunctuationData
{
  public punctuationType: IToken;

  constructor(punctuationType: IToken) {
    this.punctuationType = punctuationType;
  }

  public accept(visitor: IGreekCharacterNodeVisitor) {
    return visitor.visitGreekPunctuation(this);
  }
}

export class GreekSpaceNode implements IGreekCharacterNode, IGreekSpaceData {
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
export class GreekVowelNode implements IGreekCharacterNode, IGreekVowelData {
  public accent: IToken | null;
  public breathing: IToken | null;
  public modifier: IToken | null;
  public lengthMark: IToken | null;

  public name: IToken;
  public isUppercase: boolean;
  public hasUnderdot: boolean;

  constructor(
    name: IToken,
    accent: IToken | null = null,
    breathing: IToken | null = null,
    modifier: IToken | null = null,
    lengthMark: IToken | null = null,
    isUppercase: boolean = false,
    hasUnderdot: boolean = false
  ) {
    this.name = name;
    this.accent = accent;
    this.breathing = breathing;
    this.lengthMark = lengthMark;
    this.modifier = modifier;
    this.isUppercase = isUppercase;
    this.hasUnderdot = hasUnderdot;
  }

  public accept(visitor: IGreekCharacterNodeVisitor) {
    return visitor.visitGreekVowel(this);
  }

  /**
   * Flag indicating whether this vowel can hypothetically begin a diphthong.
   *
   * @returns True, if this vowel can begin a diphthong.
   */
  public canBeginDiphthong(): boolean {
    if (
      this.accent !== null ||
      this.modifier !== null ||
      this.breathing !== null ||
      this.name.tokenType === TokenType.IOTA
    ) {
      return false;
    }
    return true;
  }

  /**
   * Flag indicating whether this vowel can hypothetically end a diphthong.
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
  public canFormDiphthong(other: IGreekVowelNode): boolean {
    if (
      this.name.tokenType === TokenType.UPSILON &&
      other.name.tokenType === TokenType.UPSILON
    ) {
      return false;
    }
    if (this.name.tokenType === TokenType.ETA) {
      // cf. ἀ]λλ’ οὔ πως ἤιδει Ζηνὸς νόον αἰγιόχοιο, (Hes. fr. 43a Merkelbach-West 1967)
      // ἧις τὸ πρὶν ἠρήρησθα; νῦν δὲ δὴ πολὺς (Archil. fr. 172 West)
      // ταῦτά μοι ἠινίχθω κεκρυμμένα τοῖσ’ ἀγαθοῖσιν· (Theog. 681)
      // δόμους προσείλους ἦισαν, οὐ ξυλουργίαν, (A. PV. 451)
      if (other.name.tokenType === TokenType.IOTA) {
        if (
          other.accent ||
          other.breathing ||
          other.modifier ||
          this.modifier
        ) {
          return false;
        }
        return true;
      }
    } else if (this.name.tokenType === TokenType.OMEGA) {
      // ἵπποι θ’ ἡμίονοί τε, καὶ ὧι μόνα ταῦτα πάρεστι (Solon 24)
      // ὤικτιρε γὰρ αὐτὸν ὕδωρ (Stesichorus fr. 23 Page)
      if (other.name.tokenType === TokenType.IOTA) {
        return (
          other.accent === null &&
          other.breathing === null &&
          other.modifier === null
        );
      }
      // Very rare edge cases (ca. 175 instances in TLG)
      // εὖτέ μιν ωὐτὸς ἀνὴρ υἱὸς Διὸς αἰγιόχοιο (Hom. Il. 5.396)
      // ὁδὸς ἄνω κάτω μία καὶ ὡυτή (Heracl. fr. 60)
      // παρὰ σοῦ πυθέσθαι ποῖ μ’ ἄγεις, ωὖριπίδη (Arist. Thes. 4)
      if (other.name.tokenType === TokenType.UPSILON) {
        if (this.accent || other.accent || this.modifier || other.modifier) {
          return false;
        }
        return true;
      }
    }
    return this.canBeginDiphthong() && other.canEndDiphthong();
  }
}
