import { TokenType } from "../../../common/enums";
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
 * Convert character intermediary nodes into Unicode Greek characters with
 * precomposed diacritics.
 */
export class PrecomposedUnicodeVisitor implements IGreekCharacterNodeVisitor {
  public visitGreekVowel(node: IGreekVowelData & IGreekCharacterNode): string {
    /**
     * Check the node's configuration and correct any inconsistencies
     * that are found.
     */
    let vowel = node.name.tokenType;
    if (node.modifier != null) {
      // Diaeresis only exists on iota and upsilon.
      if (node.modifier.tokenType === TokenType.DIAERESIS) {
        if (![TokenType.IOTA, TokenType.UPSILON].includes(vowel)) {
          node.modifier = null;
        }
        // Diaeresis is not used with breathing.
        if (node.breathing !== null) {
          node.breathing = null;
        }
      }
      // Subscript only exists on alpha, eta, omega.
      if (node.modifier?.tokenType === TokenType.SUBSCRIPT) {
        if (
          ![TokenType.ALPHA, TokenType.ETA, TokenType.OMEGA].includes(vowel)
        ) {
          node.modifier = null;
        }
      }
    }

    // Length mark only exists on ambiguous vowels and cannot be used with
    // other diacritics.
    if (node.lengthMark != null) {
      if (
        ![TokenType.ALPHA, TokenType.IOTA, TokenType.UPSILON].includes(vowel) ||
        node.accent != null ||
        node.breathing != null ||
        node.modifier
      ) {
        node.lengthMark = null;
      }
    }

    // Capital upsilon does not take smooth breathing.
    if (
      vowel === TokenType.UPSILON &&
      node.isUppercase &&
      node.breathing != null &&
      node.breathing.tokenType == TokenType.SMOOTH
    ) {
      node.breathing = null;
    }

    // Naturally short vowels cannot take a circumflex.
    if (node.accent != null && node.accent.tokenType == TokenType.CIRCUMFLEX) {
      if ([TokenType.EPSILON, TokenType.OMICRON].includes(vowel)) {
        node.accent = null;
      }
    }
  }
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
