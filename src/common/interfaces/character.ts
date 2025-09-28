/******************************************************************************
 * CHARACTER PARSING API
 *
 * The parser takes raw text in a few different formats, and turns it into
 * a simple AST serving as an intermediary representation of the original,
 * which can then be rendered into other formats, or have something else
 * done with it.
 *
 * - Data interfaces in this API are suffixed with `Char` (e.g.
 * `IGreekSpaceChar`).
 *
 * - Parse nodes in this API are suffixed with `CharacterNode` (e.g.
 * `IGreekCharacterNode`), and these have their associated factory and visitor
 * interfaces (e.g. `IGreekCharacterNodeFactory` and
 * `IGreekCharacterNodeVisitor`)
 *
 * Each concrete node implements a `Char` suffixed data interface and a
 * `CharacterNode` suffixed visitor interface.
 *
 *****************************************************************************/

import { CharacterAnnotation } from "../enums";
import { IToken } from "./lexing";


/**
 * Interface for data of a spacing character.
 */
export interface IGreekSpaceData {
  token: IToken;
}

/**
 * Interface for data common to any alphabetic character. This is sufficient
 * for consonants but vowels may contain additional data.
 */
export interface IGreekAlphabeticData {
  // The name of the character, e.g. "alpha", "beta", etc.
  name: IToken;
  // Flag whether to render the character in uppercase.
  isUppercase?: boolean;
  // Editorial diacritic that may not be renderable in every format.
  hasUnderdot?: boolean;
  // Annotation used to preserve data in the input that might not have a
  // representation in the output (e.g. variant character).
  annotation?: CharacterAnnotation;
}

/**
 * Interface for data of an alphabetic vowel character that may have
 * diacritics.
 */
export interface IGreekVowelData extends IGreekAlphabeticData {
  // The type of accent borne by the vowel.
  accent?: IToken | null;
  // The type of breathing borne by the vowel.
  breathing?: IToken | null;
  // The type of modifier borne by the vowel.
  modifier?: IToken | null;
  // The type of length borne by the vowel.
  lengthMark?: IToken | null;
}

/**
 * Interface for data of a punctuation character.
 */
export interface IGreekPunctuationData {
  // The type of punctuation.
  punctuationType: IToken;
}

/**
 * Interface for data of an editorial symbol, e.g. `[23`
 */
export interface IGreekEditorialSymbolData {
  // The type of editorial symbol.
  symbolType: IToken;
  // The value of the editorial symbol, if it takes a value.
  value?: number | null;
}

/**
 * Visitable node representing a Greek character.
 */
export interface IGreekCharacterNode {
  accept(visitor: IGreekCharacterNodeVisitor): any;
}

export type IGreekAlphabeticNode = IGreekAlphabeticData & IGreekCharacterNode;
export type IGreekVowelNode = IGreekVowelData &
  IGreekCharacterNode & {
    canFormDiphthong: (node: IGreekVowelNode) => boolean;
    canBeginDiphthong: () => boolean;
    canEndDiphthong: () => boolean;
  };
export type IGreekPunctuationNode = IGreekPunctuationData & IGreekCharacterNode;
export type IGreekEditorialNode = IGreekEditorialSymbolData &
  IGreekCharacterNode;
export type IGreekSpaceNode = IGreekSpaceData & IGreekCharacterNode;

/**
 * Interface for the factory that supplies node objects to the
 * character parser.
 */
export interface IGreekCharacterNodeFactory {
  GreekVowel(data: IGreekVowelData): IGreekVowelNode;
  GreekConsonant(data: IGreekAlphabeticData): IGreekAlphabeticNode;
  GreekPunctuation(data: IGreekPunctuationData): IGreekPunctuationNode;
  GreekEditorialSymbol(data: IGreekEditorialSymbolData): IGreekEditorialNode;
  GreekSpace(data: IGreekSpaceData): IGreekSpaceNode;
}

/**
 * Interface for the character AST node visitor.
 */
export interface IGreekCharacterNodeVisitor {
  visitGreekVowel(node: IGreekVowelNode): any;
  visitGreekConsonant(node: IGreekAlphabeticNode): any;
  visitGreekPunctuation(node: IGreekPunctuationNode): any;
  visitGreekEditorialSymbol(node: IGreekEditorialNode): any;
  visitGreekSpace(node: IGreekSpaceNode): any;
}
