import {
  IGreekAlphabeticData,
  IGreekCharacterNode,
  IGreekCharacterNodeVisitor,
  IGreekEditorialSymbolData,
  IGreekPunctuationData,
  IGreekSpaceData,
  IGreekVowelData,
} from "../../../common/interfaces/prosody";

/**
 * Convert character intermediary nodes into TLG style beta code.
 */
export class TlgBetacodeVisitor implements IGreekCharacterNodeVisitor {
  public visitGreekVowel(
    node: IGreekVowelData & IGreekCharacterNode
  ): string {}
  public visitGreekConsonant(
    node: IGreekAlphabeticData & IGreekCharacterNode
  ): string {}
  public visitGreekPunctuation(
    node: IGreekPunctuationData & IGreekCharacterNode
  ): string {}
  public visitGreekEditorialSymbol(
    node: IGreekEditorialSymbolData & IGreekCharacterNode
  ): string {}
  public visitGreekSpace(
    node: IGreekSpaceData & IGreekCharacterNode
  ): string {}
}
