/******************************************************************************
 * PROSODY PARSING API
 *
 * The prosody parser uses the character AST as a token stream and organizes
 * the characters into syllables according to the prosodic rules of the
 * language.
 *
 *****************************************************************************/

import { IGreekAlphabeticData, IGreekVowelData } from "./character";

/**
 * Visitable node representing a Greek metrical segment.
 */
export interface IGreekProsodyNode {
  accept(visitor: IGreekProsodyNodeVisitor): any;
}

export interface IGreekLineData {
  words: IGreekWordData[];
}
export interface IGreekWordData {
  syllables: IGreekSyllableData[];
}
export interface IGreekSyllableData {
  onset: IGreekAlphabeticData[];
  nucleus: IGreekVowelData;
  coda: IGreekAlphabeticData[];
}

/**
 * Interface for the metrical AST node visitor.
 */
export interface IGreekProsodyNodeVisitor {
  visitGreekLine(node: IGreekProsodyNode & IGreekLineData): any;
  visitGreekWord(node: IGreekProsodyNode & IGreekWordData): any;
  visitGreekSyllable(node: IGreekProsodyNode & IGreekSyllableData): any;
}

export interface IGreekProsodyNodeFactory {
  GreekSyllable(
    onset: IGreekAlphabeticData[],
    nucleus: IGreekVowelData,
    coda: IGreekAlphabeticData[]
  ): IGreekProsodyNode & IGreekSyllableData;
  GreekWord(
    syllables: (IGreekProsodyNode & IGreekSyllableData)[]
  ): IGreekProsodyNode & IGreekWordData;
  GreekLine(
    words: (IGreekProsodyNode & IGreekWordData)[]
  ): IGreekProsodyNode & IGreekLineData;
}
