import {
  ASCII_CONTROL_RANGE,
  ASCII_DIGITS_RANGE,
  ASCII_PUNCTUATION_1_RANGE,
  ASCII_PUNCTUATION_2_RANGE,
  ASCII_PUNCTUATION_3_RANGE,
  ASCII_PUNCTUATION_4_RANGE,
  UNICODE_COMBINING_DIACRITICALS_RANGE,
  UNICODE_GENERAL_PUNCTUATION_RANGE,
  UNICODE_GREEK_COPIC_RANGE,
  UNICODE_GREEK_EXTENDED_RANGE,
  UNICODE_SUPPLEMENTAL_PUNCTUATION_RANGE,
} from "../../common/constants";

import { GreekEncoding } from "../../common/enums";
import { numberIsInRange } from "../../common/syntax_helpers";
import { TlgBetacodeLexer } from "../parsers/betacode/tlg.lexer";
import { TypeGreekBetacodeLexer } from "../parsers/betacode/typegreek.lexer";
import { unicodeGreekLexer } from "../parsers/unicode/unicode.lexer";

export function isTlgBetacode(text: string): boolean {
  try {
    TlgBetacodeLexer.tokenize(text);
    return true;
  } catch (error) {
    return false;
  }
}

export function isTypeGreekBetacode(text: string): boolean {
  // Simple exclusion test: Typegreek doesn't use the asterisk at all.
  if (text.includes("*")) return false;

  try {
    TypeGreekBetacodeLexer.tokenize(text);
    return true;
  } catch (error) {
    return false;
  }
}

export function isUnicodeGreek(text: string): boolean {
  try {
    unicodeGreekLexer.tokenize(text.normalize("NFKD"));
    return true;
  } catch (error) {
    return false;
  }
}

export function isCombiningGreek(text: string): boolean {
  try {
    unicodeGreekLexer.tokenize(text);
    return true;
  } catch (error) {
    return false;
  }
}

export function isPrecomposedGreek(text: string): boolean {
  for (const char of text) {
    let codePoint = char.codePointAt(0)!;
    // Simple exclusion test: combining diacritics.
    if (numberIsInRange(codePoint, UNICODE_COMBINING_DIACRITICALS_RANGE))
      return false;
    let found = false;
    for (const range of [
      UNICODE_GREEK_COPIC_RANGE,
      UNICODE_GREEK_EXTENDED_RANGE,
      ASCII_CONTROL_RANGE,
      ASCII_DIGITS_RANGE,
      ASCII_PUNCTUATION_1_RANGE,
      ASCII_PUNCTUATION_2_RANGE,
      ASCII_PUNCTUATION_3_RANGE,
      ASCII_PUNCTUATION_4_RANGE,
      UNICODE_GENERAL_PUNCTUATION_RANGE,
      UNICODE_SUPPLEMENTAL_PUNCTUATION_RANGE,
    ]) {
      if (numberIsInRange(codePoint, range)) found = true;
      if (found) continue;
    }
    if (!found) return false;
  }
  return true;
}

export function identifyEncoding(text: string): GreekEncoding {
  if (isTypeGreekBetacode(text)) return GreekEncoding.TYPEGREEK_BETA_CODE;
  if (isTlgBetacode(text)) return GreekEncoding.TLG_BETA_CODE;
  if (isPrecomposedGreek(text)) return GreekEncoding.UNICODE_PRECOMPOSED;
  if (isCombiningGreek(text)) return GreekEncoding.UNICODE_COMBINING;
  if (isUnicodeGreek(text)) return GreekEncoding.UNICODE;

  return GreekEncoding.UNKNOWN;
}
