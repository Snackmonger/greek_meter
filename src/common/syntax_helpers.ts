import { TokenType } from "./enums";
import { NumberRange } from "./types";

export function isUpper(text: string): boolean {
  return text.toUpperCase() === text;
}

export function isLower(text: string): boolean {
  return text.toLowerCase() === text;
}

export function isBreathing(tokenType: string): boolean {
  return [TokenType.ROUGH, TokenType.SMOOTH]
    .map((it) => it.toString())
    .includes(tokenType);
}

export function isAccent(tokenType: string): boolean {
  return [TokenType.ACUTE, TokenType.GRAVE, TokenType.CIRCUMFLEX]
    .map((it) => it.toString())
    .includes(tokenType);
}

export function isModifier(tokenType: string): boolean {
  return [TokenType.SUBSCRIPT, TokenType.DIAERESIS]
    .map((it) => it.toString())
    .includes(tokenType);
}

export function numberIsInRange(
  num: number,
  range: NumberRange
): boolean {
  if (range[0] < range[1]) {
    if (range[0] <= num && range[1] >= num) {
      return true;
    }
    return false;
  }
  if (range[0] > range[1]) {
    if (range[1] <= num && range[0] >= num) {
      return true;
    }
    return false;
  }
  return num === range[0];
}
