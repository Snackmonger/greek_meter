/**
 * GENERAL PARSING/LEXING API
 */

/**
 * Interface for tokens used by our lexer and parser.
 */
export interface IToken {
  // The transformed value of the lexeme, if there is one.
  value?: unknown;
  // The category into which the token is sorted.
  tokenType: string;
  // The literal string match that generated the token.
  lexeme: string;
  // The start of the lexeme in the source text.
  start: number;
  // The end of the lexeme in the source text.
  end: number;
  // The lexeme's line in the source text, when newlines are accounted for.
  line: number;
  // The lexeme's column in the source text, when newlines are accounted for.
  column: number;

  // Return a printable string representing this token.
  toString(): string;

  // The length of the token's lexeme.
  get length(): number;
}

/**
 * Interface for a lexer that adds production rules via a method-chaining
 * pattern, and that tokenizes a text based on those rules and returns
 * a list of tokens.
 */
export interface ILexer {
  tokenize(text: string): IToken[];
  addRule(
    tokenType: string,
    regexPattern: RegExp,
    callback?: (lexeme: string) => any
  ): ILexer;
}

/******************************************************************************
 * CHARACTER PARSING API
 *
 * The parser takes raw text in a few different formats, and turns it into
 * a simple AST serving as an intermediary representation of the Greek,
 * which can then be rendered into other formats, or have something else
 * done with it.
 *
 *****************************************************************************/

/**
 * Interface for data of a spacing character.
 */
export interface IGreekSpaceChar {
  token: IToken;
}

/**
 * Interface for data common to any alphabetic character. This is sufficient
 * for consonants but vowels may contain additional data.
 */
export interface IGreekAlphabeticChar {
  // The name of the character, e.g. "alpha", "beta", etc.
  name: IToken;
  // Flag whether to render the character in uppercase.
  isUppercase?: boolean;
  // Editorial diacritic that may not be renderable in every format.
  hasUnderdot?: boolean;
}

/**
 * Interface for data of an alphabetic vowel character that may have
 * diacritics.
 */
export interface IGreekVowel extends IGreekAlphabeticChar {
  // The type of accent borne by the vowel.
  accent?: IToken | null;
  // The type of breathing borne by the vowel.
  breathing?: IToken | null;
  // The type of modifier borne by the vowel.
  modifier?: IToken | null;
}

/**
 * Interface for data of a punctuation character.
 */
export interface IGreekPunctuation {
  // The type of punctuation.
  punctuationType: IToken;
}

/**
 * Interface for data of an editorial symbol, e.g. `[23`
 */
export interface IGreekEditorialSymbol {
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

/**
 * Interface for the factory that supplies node objects to the
 * character parser.
 */
export interface IGreekCharacterNodeFactory {
  GreekVowel(data: IGreekVowel): IGreekVowel & IGreekCharacterNode;
  GreekConsonant(
    data: IGreekAlphabeticChar
  ): IGreekAlphabeticChar & IGreekCharacterNode;
  GreekPunctuation(
    data: IGreekPunctuation
  ): IGreekPunctuation & IGreekCharacterNode;
  GreekEditorialSymbol(
    data: IGreekEditorialSymbol
  ): IGreekEditorialSymbol & IGreekCharacterNode;
}

/**
 * Interface for the character AST node visitor.
 */
export interface IGreekCharacterNodeVisitor {
  visitGreekVowel(node: IGreekVowel & IGreekCharacterNode): any;
  visitGreekConsonant(node: IGreekAlphabeticChar & IGreekCharacterNode): any;
  visitGreekPunctuation(node: IGreekPunctuation & IGreekCharacterNode): any;
  visitGreekEditorialSymbol(
    node: IGreekEditorialSymbol & IGreekCharacterNode
  ): any;
  visitGreekSpace(node: IGreekSpaceChar & IGreekCharacterNode): any;
}

/******************************************************************************
 * PROSODY PARSING API
 *
 * The
 *
 *****************************************************************************/

/**
 * Visitable node representing a Greek metrical segment.
 */
export interface IGreekProsodyNode {
  accept(visitor: IGreekProsodyNodeVisitor): any;
}

export interface IGreekLine {
  words: IGreekWord[];
}
export interface IGreekWord {
  syllables: IGreekSyllable[];
}
export interface IGreekSyllable {
  onset: IGreekAlphabeticChar[];
  nucleus: IGreekVowel;
  coda: IGreekAlphabeticChar[];
}

/**
 * Interface for the metrical AST node visitor.
 */
export interface IGreekProsodyNodeVisitor {
  visitGreekLine(node: IGreekProsodyNode & IGreekLine): any;
  visitGreekWord(node: IGreekProsodyNode & IGreekWord): any;
  visitGreekSyllable(node: IGreekProsodyNode & IGreekSyllable): any;
}

export interface IGreekProsodyNodeFactory {
  GreekSyllable(
    onset: IGreekAlphabeticChar[],
    nucleus: IGreekVowel,
    coda: IGreekAlphabeticChar[]
  ): IGreekProsodyNode & IGreekSyllable;
  GreekWord(
    syllables: (IGreekProsodyNode & IGreekSyllable)[]
  ): IGreekProsodyNode & IGreekWord;
  GreekLine(
    words: (IGreekProsodyNode & IGreekWord)[]
  ): IGreekProsodyNode & IGreekLine;
}
