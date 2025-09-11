import {
  IGreekAlphabeticChar,
  IGreekCharacterNode,
  IGreekCharacterNodeVisitor,
  IGreekEditorialSymbol,
  IGreekPunctuation,
  IGreekSpaceChar,
  IGreekVowel,
} from "../../../common/interfaces";

/**
 * Convert character intermediary nodes into Unicode Greek characters with 
 * precomposed diacritics.
 */
export class PrecomposedUnicodeVisitor implements IGreekCharacterNodeVisitor {
  public visitGreekVowel(
    node: IGreekVowel & IGreekCharacterNode
  ): string {}
  public visitGreekConsonant(
    node: IGreekAlphabeticChar & IGreekCharacterNode
  ): string {}
  public visitGreekPunctuation(
    node: IGreekPunctuation & IGreekCharacterNode
  ): string {}
  public visitGreekEditorialSymbol(
    node: IGreekEditorialSymbol & IGreekCharacterNode
  ): string {}
  public visitGreekSpace(
    node: IGreekSpaceChar & IGreekCharacterNode
  ): string {}
}
