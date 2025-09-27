import { TokenType } from "../../../common/enums";
import {
  IGreekAlphabeticNode,
  IGreekCharacterNodeVisitor,
  IGreekEditorialNode,
  IGreekPunctuationNode,
  IGreekSpaceNode,
  IGreekVowelNode,
} from "../../../common/interfaces/character";
import Token from "../../../common/token";
import { GreekCharacterNodeFactory } from "../character.factory";
import {
  GreekConsonantNode,
  GreekEditorialSymbolNode,
  GreekPunctuationNode,
  GreekSpaceNode,
  GreekVowelNode,
} from "../character.nodes";

describe("Greek character nodes", () => {
  // Dummy positions of 0, 0, 0, 0 for all tokens since
  // text-token tracking is tested in the lexer test suite.
  let alpha_plain = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.ALPHA, "a", 0, 0, 0, 0),
  });
  let epsilon_plain = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.EPSILON, "e", 0, 0, 0, 0),
  });
  let eta_plain = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.ETA, "h", 0, 0, 0, 0),
  });
  let upsilon_plain = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.UPSILON, "u", 0, 0, 0, 0),
  });
  let omicron_plain = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.OMICRON, "o", 0, 0, 0, 0),
  });
  let omega_plain = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.OMEGA, "w", 0, 0, 0, 0),
  });
  let iota_plain = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.IOTA, "i", 0, 0, 0, 0),
  });
  let iota_diaeresis = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.IOTA, "i", 0, 0, 0, 0),
    modifier: new Token(TokenType.DIAERESIS, "+", 0, 0, 0, 0),
  });
  let upsilon_diaeresis = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.UPSILON, "u", 0, 0, 0, 0),
    modifier: new Token(TokenType.DIAERESIS, "+", 0, 0, 0, 0),
  });

  let alpha_acute = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.ALPHA, "a", 0, 0, 0, 0),
    accent: new Token(TokenType.ACUTE, "/", 0, 0, 0, 0),
  });
  let epsilon_acute = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.EPSILON, "e", 0, 0, 0, 0),
    accent: new Token(TokenType.ACUTE, "/", 0, 0, 0, 0),
  });
  let eta_acute = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.ETA, "h", 0, 0, 0, 0),
    accent: new Token(TokenType.ACUTE, "/", 0, 0, 0, 0),
  });
  let omega_acute = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.OMEGA, "w", 0, 0, 0, 0),
    accent: new Token(TokenType.ACUTE, "/", 0, 0, 0, 0),
  });
  let upsilon_acute = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.UPSILON, "u", 0, 0, 0, 0),
    accent: new Token(TokenType.ACUTE, "/", 0, 0, 0, 0),
  });
  let iota_acute = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.IOTA, "i", 0, 0, 0, 0),
    accent: new Token(TokenType.ACUTE, "/", 0, 0, 0, 0),
  });
  let omicron_acute = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.OMICRON, "o", 0, 0, 0, 0),
    accent: new Token(TokenType.ACUTE, "/", 0, 0, 0, 0),
  });

  let alpha_rough = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.ALPHA, "a", 0, 0, 0, 0),
    accent: new Token(TokenType.ROUGH, "(", 0, 0, 0, 0),
  });
  let epsilon_rough = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.ROUGH, "(", 0, 0, 0, 0),
    breathing: new Token(TokenType.ROUGH, "(", 0, 0, 0, 0),
  });
  let eta_rough = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.ETA, "h", 0, 0, 0, 0),
    breathing: new Token(TokenType.ROUGH, "(", 0, 0, 0, 0),
  });
  let omega_rough = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.OMEGA, "w", 0, 0, 0, 0),
    breathing: new Token(TokenType.ROUGH, "(", 0, 0, 0, 0),
  });
  let upsilon_rough = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.UPSILON, "u", 0, 0, 0, 0),
    breathing: new Token(TokenType.ROUGH, "(", 0, 0, 0, 0),
  });
  let iota_rough = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.IOTA, "i", 0, 0, 0, 0),
    breathing: new Token(TokenType.ROUGH, "(", 0, 0, 0, 0),
  });
  let omicron_rough = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.OMICRON, "o", 0, 0, 0, 0),
    breathing: new Token(TokenType.ROUGH, "(", 0, 0, 0, 0),
  });

  let alpha_circumflex = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.ALPHA, "a", 0, 0, 0, 0),
    accent: new Token(TokenType.CIRCUMFLEX, "=", 0, 0, 0, 0),
  });
  let eta_circumflex = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.ETA, "h", 0, 0, 0, 0),
    accent: new Token(TokenType.CIRCUMFLEX, "=", 0, 0, 0, 0),
  });
  let omega_circumflex = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.OMEGA, "w", 0, 0, 0, 0),
    accent: new Token(TokenType.CIRCUMFLEX, "=", 0, 0, 0, 0),
  });
  let upsilon_circumflex = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.UPSILON, "u", 0, 0, 0, 0),
    accent: new Token(TokenType.CIRCUMFLEX, "=", 0, 0, 0, 0),
  });
  let iota_circumflex = GreekCharacterNodeFactory.GreekVowel({
    name: new Token(TokenType.IOTA, "i", 0, 0, 0, 0),
    accent: new Token(TokenType.CIRCUMFLEX, "=", 0, 0, 0, 0),
  });

  let beta = GreekCharacterNodeFactory.GreekConsonant({
    name: new Token(TokenType.BETA, "b", 0, 0, 0, 0),
  });
  let period = GreekCharacterNodeFactory.GreekPunctuation({
    punctuationType: new Token(TokenType.PERIOD, ".", 0, 0, 0, 0),
  });
  let space = GreekCharacterNodeFactory.GreekSpace({
    token: new Token(TokenType.TAB, "\t", 0, 0, 0, 0),
  });
  let symbol = GreekCharacterNodeFactory.GreekEditorialSymbol({
    symbolType: new Token(TokenType.PAGE_FORMATTING, "]", 0, 0, 0, 0),
  });

  describe("Greek character node factory", () => {
    it("returns instances of the correct types", () => {
      expect(alpha_acute).toBeInstanceOf(GreekVowelNode);
      expect(beta).toBeInstanceOf(GreekConsonantNode);
      expect(period).toBeInstanceOf(GreekPunctuationNode);
      expect(symbol).toBeInstanceOf(GreekEditorialSymbolNode);
      expect(space).toBeInstanceOf(GreekSpaceNode);
    });
  });

  describe("GreekConsonantNode", () => {
    describe("constructor", () => {
      it("can initialize with implicit null values", () => {
        expect(
          new GreekConsonantNode(new Token(TokenType.BETA, "a", 0, 0, 0, 0))
        );
      });
    });
  });

  describe("GreekEditorialSymbolNode", () => {
    describe("constructor", () => {
      it("can initialize with implicit null values", () => {
        expect(
          new GreekEditorialSymbolNode(
            new Token(TokenType.BETA, "a", 0, 0, 0, 0)
          )
        );
      });
    });
  });

  describe("GreekVowelNode", () => {
    describe("constructor", () => {
      it("can initialize with implicit null values", () => {
        expect(new GreekVowelNode(new Token(TokenType.ALPHA, "a", 0, 0, 0, 0)));
      });
    });

    describe("canFormDiphthong", () => {
      describe("context: an unmarked vowel node is followed by an unmarked vowel node", () => {
        // POSITIVE
        it("recognizes diphthong between unmarked alpha and unmarked iota", () => {
          expect(alpha_plain.canFormDiphthong(iota_plain)).toBe(true);
        });
        it("recognizes diphthong between unmarked epsilon and unmarked iota", () => {
          expect(epsilon_plain.canFormDiphthong(iota_plain)).toBe(true);
        });
        it("recognizes diphthong between unmarked eta and unmarked iota (as adscript)", () => {
          expect(eta_plain.canFormDiphthong(iota_plain)).toBe(true);
        });
        it("recognizes diphthong between unmarked upsilon and unmarked iota", () => {
          expect(upsilon_plain.canFormDiphthong(iota_plain)).toBe(true);
        });
        it("recognizes diphthong between unmarked omicron and unmarked iota", () => {
          expect(omicron_plain.canFormDiphthong(iota_plain)).toBe(true);
        });
        it("recognizes diphthong between unmarked alpha and unmarked upsilon", () => {
          expect(alpha_plain.canFormDiphthong(upsilon_plain)).toBe(true);
        });
        it("recognizes diphthong between unmarked epsilon and unmarked upsilon", () => {
          expect(epsilon_plain.canFormDiphthong(upsilon_plain)).toBe(true);
        });
        it("recognizes diphthong between unmarked eta and unmarked upsilon", () => {
          expect(eta_plain.canFormDiphthong(upsilon_plain)).toBe(true);
        });
        it("recognizes diphthong between unmarked upsilon and unmarked iota", () => {
          expect(upsilon_plain.canFormDiphthong(iota_plain)).toBe(true);
        });
        it("recognizes diphthong between unmarked omicron and unmarked upsilon", () => {
          expect(omicron_plain.canFormDiphthong(upsilon_plain)).toBe(true);
        });
        it("recognizes diphthong between unmarked omega and unmarked iota (as adscript)", () => {
          expect(omega_plain.canFormDiphthong(iota_plain)).toBe(true);
        });
        it("recognizes diphthong between unmarked omega and unmarked upsilon (as special crasis of ho autos)", () => {
          expect(omega_plain.canFormDiphthong(upsilon_plain)).toBe(true);
        });

        // NEGATIVE
        it("does not recognize a diphthong between unmarked vowels when the second vowel is anything other than iota or upsilon", () => {
          expect(alpha_plain.canFormDiphthong(omega_plain)).toBe(false);
          expect(alpha_plain.canFormDiphthong(epsilon_plain)).toBe(false);
          expect(eta_plain.canFormDiphthong(alpha_plain)).toBe(false);
          expect(iota_plain.canFormDiphthong(omicron_plain)).toBe(false);
        });
        it("does not recognize a diphthong between two unmarked vowels of the same type", () => {
          expect(iota_plain.canFormDiphthong(iota_plain)).toBe(false);
          expect(upsilon_plain.canFormDiphthong(upsilon_plain)).toBe(false);
          expect(alpha_plain.canFormDiphthong(alpha_plain)).toBe(false);
          expect(eta_plain.canFormDiphthong(eta_plain)).toBe(false);
          expect(epsilon_plain.canFormDiphthong(epsilon_plain)).toBe(false);
          expect(omega_plain.canFormDiphthong(omega_plain)).toBe(false);
        });
      });

      describe("context: a marked vowel node is followed by an unmarked vowel node", () => {
        // POSITIVE
        it("recognizes a diphthong between marked eta and unmarked iota (as adscript)", () => {
          expect(eta_acute.canFormDiphthong(iota_plain)).toBe(true);
          expect(eta_circumflex.canFormDiphthong(iota_plain)).toBe(true);
          expect(eta_rough.canFormDiphthong(iota_plain)).toBe(true);
        });
        it("recognizes a diphthong between rough omega and unmarked upsilon (as special crasis of ho autos)", () => {
          expect(eta_rough.canFormDiphthong(iota_plain)).toBe(true);
        });
        it("recognizes a diphthong between marked omega and unmarked iota (as adscript)", () => {
          expect(omega_acute.canFormDiphthong(iota_plain)).toBe(true);
          expect(omega_circumflex.canFormDiphthong(iota_plain)).toBe(true);
          expect(omega_rough.canFormDiphthong(iota_plain)).toBe(true);
        });

        // NEGATIVE
        it("recognizes a diphthong between marked alpha and unmarked iota", () => {
          expect(alpha_acute.canFormDiphthong(iota_plain)).toBe(false);
          expect(alpha_circumflex.canFormDiphthong(iota_plain)).toBe(false);
        });
        it("recognizes a diphthong between marked omicron and unmarked iota", () => {
          expect(omicron_acute.canFormDiphthong(iota_plain)).toBe(false);
          expect(omicron_rough.canFormDiphthong(iota_plain)).toBe(false);
        });
        it("recognizes a diphthong between marked epsilon and unmarked iota", () => {
          expect(epsilon_acute.canFormDiphthong(iota_plain)).toBe(false);
          expect(epsilon_rough.canFormDiphthong(iota_plain)).toBe(false);
        });
        it("recognizes a diphthong between marked upsilon and unmarked iota", () => {
          expect(upsilon_acute.canFormDiphthong(iota_plain)).toBe(false);
          expect(upsilon_circumflex.canFormDiphthong(iota_plain)).toBe(false);
          expect(upsilon_rough.canFormDiphthong(iota_plain)).toBe(false);
        });
        it("recognizes a diphthong between marked iota and unmarked iota", () => {
          expect(iota_acute.canFormDiphthong(iota_plain)).toBe(false);
          expect(iota_circumflex.canFormDiphthong(iota_plain)).toBe(false);
          expect(iota_rough.canFormDiphthong(iota_plain)).toBe(false);
        });
      });

      describe("context: an unmarked vowel node is followed by a marked vowel node", () => {
        // POSITIVE
        it("recognizes a diphthong between unmarked alpha and acute iota", () => {
          expect(alpha_plain.canFormDiphthong(iota_acute)).toBe(true);
        });
        it("recognizes a diphthong between unmarked epsilon and acute iota", () => {
          expect(epsilon_plain.canFormDiphthong(iota_acute)).toBe(true);
        });
        it("recognizes a diphthong between unmarked upsilon and acute iota", () => {
          expect(upsilon_plain.canFormDiphthong(iota_acute)).toBe(true);
        });
        it("recognizes a diphthong between unmarked alpha and acute upsilon", () => {
          expect(alpha_plain.canFormDiphthong(upsilon_acute)).toBe(true);
        });
        it("recognizes a diphthong between unmarked epsilon and acute upsilon", () => {
          expect(epsilon_plain.canFormDiphthong(upsilon_acute)).toBe(true);
        });
        it("recognizes a diphthong between unmarked eta and acute upsilon", () => {
          expect(eta_plain.canFormDiphthong(upsilon_acute)).toBe(true);
        });

        // NEGATIVE
        it("does not recognize a diphthong between unmarked omega and acute iota", () => {
          expect(omega_plain.canFormDiphthong(iota_acute)).toBe(false);
        });
        it("does not recognize a diphthong cannot between unmarked eta and acute iota", () => {
          expect(eta_plain.canFormDiphthong(iota_acute)).toBe(false);
        });
        it("does not recognize a diphthong cannot between unmarked omega and acute upsilon", () => {
          expect(omega_plain.canFormDiphthong(upsilon_acute)).toBe(false);
        });
        it("does not recognize a diphthong cannot between an unmarked iota and an acute iota", () => {
          expect(iota_plain.canFormDiphthong(iota_acute)).toBe(false);
        });
        it("does not recognize a diphthong cannot between an unmarked alpha and an iota with diaeresis", () => {
          expect(alpha_plain.canFormDiphthong(iota_diaeresis)).toBe(false);
        });
      });
    });
    describe("length assessment", () => {});
  });

  describe("accept", () => {
    class TestVisitor implements IGreekCharacterNodeVisitor {
      visitGreekConsonant(node: IGreekAlphabeticNode) {
        return "consonant";
      }
      visitGreekEditorialSymbol(node: IGreekEditorialNode) {
        return "editorial";
      }
      visitGreekPunctuation(node: IGreekPunctuationNode) {
        return "punctuation";
      }
      visitGreekSpace(node: IGreekSpaceNode) {
        return "space";
      }
      visitGreekVowel(node: IGreekVowelNode) {
        return "vowel";
      }
    }
    let visitor = new TestVisitor();

    it("accepts the associated visitor interface and returns the visitor's method for its class", () => {
      expect(alpha_acute.accept(visitor)).toBe("vowel");
      expect(period.accept(visitor)).toBe("punctuation");
      expect(beta.accept(visitor)).toBe("consonant");
      expect(symbol.accept(visitor)).toBe("editorial");
      expect(space.accept(visitor)).toBe("space");
    });
  });
});
