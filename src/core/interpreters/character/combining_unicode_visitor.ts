import {
  IGreekAlphabeticData,
  IGreekCharacterNode,
  IGreekCharacterNodeVisitor,
  IGreekEditorialSymbolData,
  IGreekPunctuationData,
  IGreekSpaceData,
  IGreekVowelData,
} from "../../../common/interfaces/character";

/**
 * Convert character intermediary nodes into Unicode Greek characters
 * with combining diacritics.
 */
export class CombiningUnicodeVisitor implements IGreekCharacterNodeVisitor {
  public visitGreekVowel(node: IGreekVowelData & IGreekCharacterNode): string {}
  public visitGreekConsonant(
    node: IGreekAlphabeticData & IGreekCharacterNode
  ): string {}
  public visitGreekPunctuation(
    node: IGreekPunctuationData & IGreekCharacterNode
  ): string {}
  public visitGreekEditorialSymbol(
    node: IGreekEditorialSymbolData & IGreekCharacterNode
  ): string {}
  public visitGreekSpace(node: IGreekSpaceData & IGreekCharacterNode): string {}
}
