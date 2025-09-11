import {
  IGreekAlphabeticChar,
  IGreekCharacterNodeFactory,
  IGreekEditorialSymbol,
  IGreekPunctuation,
  IGreekVowel,
} from "../common/interfaces";
import {
  GreekConsonantNode,
  GreekEditorialSymbolNode,
  GreekPunctuationNode,
  GreekVowelNode,
} from "./character.nodes";

/**
 * Factory object to supply concrete implementations of character
 * node & data interfaces.
 */
export const GreekCharacterNodeFactory: IGreekCharacterNodeFactory = {
  GreekConsonant: ({
    name,
    isUppercase = false,
    hasUnderdot = false,
  }: IGreekAlphabeticChar) => {
    return new GreekConsonantNode(name, isUppercase, hasUnderdot);
  },

  GreekEditorialSymbol: ({
    symbolType,
    value = null,
  }: IGreekEditorialSymbol) => {
    return new GreekEditorialSymbolNode(symbolType, value);
  },

  GreekPunctuation: ({ punctuationType }: IGreekPunctuation) => {
    return new GreekPunctuationNode(punctuationType);
  },

  GreekVowel: ({
    name,
    accent = null,
    breathing = null,
    modifier = null,
    isUppercase = false,
    hasUnderdot = false,
  }: IGreekVowel) => {
    return new GreekVowelNode(
      name,
      accent,
      breathing,
      modifier,
      isUppercase,
      hasUnderdot
    );
  },
};
