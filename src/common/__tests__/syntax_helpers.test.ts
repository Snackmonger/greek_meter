import { TokenType } from "../enums";
import {
  isAccent,
  isBreathing,
  isLower,
  isModifier,
  isUpper,
  numberIsInRange,
} from "../syntax_helpers";

describe("syntax helpers module", () => {
  describe("isUpper", () => {
    it("returns true for uppercase text", () => {
      expect(isUpper("UPPERCASE")).toBe(true);
    });
    it("returns true for uppercase text, including punctuation", () => {
      expect(isUpper("U*P^P%E$R#C@A,S.E!")).toBe(true);
    });
    it("returns false for lowercase text", () => {
      expect(isUpper("lowercase")).toBe(false);
    });
    it("returns false for mixed-case text", () => {
      expect(isUpper("lowercase AND UPPERCASE")).toBe(false);
    });
  });

  describe("isLower", () => {
    it("returns false for uppercase text", () => {
      expect(isLower("UPPERCASE")).toBe(false);
    });
    it("returns true for lowercase text, including punctuation", () => {
      expect(isLower("l*o^w%e$r#c@a,s.e!")).toBe(true);
    });
    it("returns true for lowercase text", () => {
      expect(isLower("lowercase")).toBe(true);
    });
    it("returns false for mixed-case text", () => {
      expect(isLower("lowercase AND UPPERCASE")).toBe(false);
    });
  });

  describe("isBreathing", () => {
    it("returns true if the string is a rough breathing", () => {
      expect(isBreathing("rough")).toBe(true);
    });
    it("returns true if the string is a smooth breathing", () => {
      expect(isBreathing("smooth")).toBe(true);
    });
    it("returns true if the string is a rough breathing enum value", () => {
      expect(isBreathing(TokenType.ROUGH)).toBe(true);
    });
    it("returns true if the string is a smooth breathing enum value", () => {
      expect(isBreathing(TokenType.SMOOTH)).toBe(true);
    });
    it("returns false for empty string", () => {
      expect(isBreathing("")).toBe(false);
    });
    it("returns false for any other string", () => {
      expect(isBreathing(TokenType.DIAERESIS)).toBe(false);
      expect(isBreathing(TokenType.SUBSCRIPT)).toBe(false);
      expect(isBreathing(TokenType.ACUTE)).toBe(false);
      expect(isBreathing(TokenType.GRAVE)).toBe(false);
    });
  });

  describe("isAccent", () => {
    it("returns true if the string is an acute accent", () => {
      expect(isAccent("acute")).toBe(true);
    });
    it("returns true if the string is a grave accent", () => {
      expect(isAccent("grave")).toBe(true);
    });
    it("returns true if the string is a circumflex accent", () => {
      expect(isAccent("circumflex")).toBe(true);
    });
    it("returns true if the string is an acute accent", () => {
      expect(isAccent(TokenType.ACUTE)).toBe(true);
    });
    it("returns true if the string is an acute accent", () => {
      expect(isAccent(TokenType.ACUTE)).toBe(true);
    });
    it("returns true if the string is a circumflex accent", () => {
      expect(isAccent(TokenType.CIRCUMFLEX)).toBe(true);
    });
    it("returns false for empty string", () => {
      expect(isAccent("")).toBe(false);
    });
    it("returns false for any other string", () => {
      expect(isAccent(TokenType.DIAERESIS)).toBe(false);
      expect(isAccent(TokenType.SUBSCRIPT)).toBe(false);
      expect(isAccent(TokenType.ROUGH)).toBe(false);
      expect(isAccent(TokenType.SMOOTH)).toBe(false);
    });
  });

  describe("isModifier", () => {
    it("returns true if the string is a diaeresis", () => {
      expect(isModifier("diaeresis")).toBe(true);
    });
    it("returns true if the string is a subscript", () => {
      expect(isModifier("subscript")).toBe(true);
    });
    it("returns true if the string is an diaeresis ", () => {
      expect(isModifier(TokenType.DIAERESIS)).toBe(true);
    });
    it("returns true if the string is an subscript ", () => {
      expect(isModifier(TokenType.SUBSCRIPT)).toBe(true);
    });
    it("returns false for empty string", () => {
      expect(isModifier("")).toBe(false);
    });
    it("returns false for any other string", () => {
      expect(isModifier(TokenType.CIRCUMFLEX)).toBe(false);
      expect(isModifier(TokenType.GRAVE)).toBe(false);
      expect(isModifier(TokenType.ACUTE)).toBe(false);
      expect(isModifier(TokenType.ROUGH)).toBe(false);
      expect(isModifier(TokenType.SMOOTH)).toBe(false);
    });
  });

  describe("numberIsInRange", () => {
    type N = [number, number]
    const testRange1: N = [1, 100];
    const testRange2: N = [-1, -100]
    const testRange3: N = [-1, 100]
    const testRange4: N = [100, 1]
    it("returns true for 1 if the range is [1, 100]", () =>{
        expect(numberIsInRange(1, testRange1)).toBe(true)
    })
    it("returns true for 100 if the range is [1, 100]", () =>{
        expect(numberIsInRange(100, testRange1)).toBe(true)
    })
    it("returns false for 0 if the range is [1, 100]", () =>{
        expect(numberIsInRange(0, testRange1)).toBe(false)
    })
    it("returns false for 101 if the range is [1, 100]", () =>{
        expect(numberIsInRange(101, testRange1)).toBe(false)
    })
    it("returns false for -1 if the range is [1, 100]", () =>{
        expect(numberIsInRange(-1, testRange1)).toBe(false)
    })
    it("returns false for 1 if the range is [-1, -100]", () =>{
        expect(numberIsInRange(1, testRange2)).toBe(false)
    })
    it("returns true for -1 if the range is [-1, -100]", () =>{
        expect(numberIsInRange(-1, testRange2)).toBe(true)
    })
    it("returns true for 1 if the range is [-1, 100]", () =>{
        expect(numberIsInRange(1, testRange3)).toBe(true)
    })
    it("returns true for -1 if the range is [-1, 100]", () =>{
        expect(numberIsInRange(-1, testRange3)).toBe(true)
    })
    it("returns false for -2 if the range is [-1, 100]", () =>{
        expect(numberIsInRange(-2, testRange3)).toBe(false)
    })
    it("returns true for 1 if the range is [100, 1]", () =>{
        expect(numberIsInRange(1, testRange4)).toBe(true)
    })
    it("returns false for -1 if the range is [100, 1]", () =>{
        expect(numberIsInRange(-1, testRange4)).toBe(false)
    })
  })
});
