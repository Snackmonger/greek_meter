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
 * Convert character intermediary nodes into TLG style beta code.
 */
export class TlgBetacodeVisitor implements IGreekCharacterNodeVisitor {
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
