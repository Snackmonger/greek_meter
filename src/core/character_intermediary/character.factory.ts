
import { IGreekCharacterNodeFactory } from "../../common/interfaces/character";
import {
  GreekConsonantNode,
  GreekEditorialSymbolNode,
  GreekPunctuationNode,
  GreekSpaceNode,
  GreekVowelNode,
} from "../../core/character_intermediary/character.nodes";

/**
 * Factory object to supply concrete implementations of character
 * node & data interfaces.
 */
export const GreekCharacterNodeFactory: IGreekCharacterNodeFactory = {
  GreekConsonant: ({
    name,
    isUppercase = false,
    hasUnderdot = false,
    annotation = {},
  }) => {
    return new GreekConsonantNode(name, isUppercase, hasUnderdot, annotation);
  },

  GreekEditorialSymbol: ({ symbolType, value = null }) => {
    return new GreekEditorialSymbolNode(symbolType, value);
  },

  GreekPunctuation: ({ punctuationType }) => {
    return new GreekPunctuationNode(punctuationType);
  },

  GreekVowel: ({
    name,
    accent = null,
    breathing = null,
    modifier = null,
    lengthMark = null,
    isUppercase = false,
    hasUnderdot = false,
  }) => {
    return new GreekVowelNode(
      name,
      accent,
      breathing,
      modifier,
      lengthMark,
      isUppercase,
      hasUnderdot
    );
  },
  GreekSpace: ({ token }) => {
    return new GreekSpaceNode(token);
  },
};
