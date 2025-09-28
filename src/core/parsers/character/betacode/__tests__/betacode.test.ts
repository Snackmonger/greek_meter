import { TokenType } from "../../../../common/enums";
import { GreekCharacterNodeFactory } from "../../../character_intermediary/character.factory";
import { GreekVowelNode } from "../../../character_intermediary/character.nodes";
import { TlgBetacodeParser } from "../tlg.parser";
import { TypegreekBetacodeParser } from "../typegreek.parser";

describe("betacode parsing module", () => {
  let Iliad_1_1_TLG = `*MH=NIN A)/EIDE QEA\ *PHLHI+A/DEW *)AXILH=OS`;
  let Iliad_1_1_UnicodePrecomposed = `Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος`;
  let Iliad_1_1_TypeGreek = "Mh=nin a)/eide qea Phlhi+a/dew A)xilh=os";

  let TlgParser = new TlgBetacodeParser(GreekCharacterNodeFactory);
  let TypeGreekParser = new TypegreekBetacodeParser(GreekCharacterNodeFactory);

  describe("parser-to-AST equivalency tests for different input formats with same meaning", () => {
    describe("Iliad 1.1: Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", () => {
      let TlgAst = TlgParser.parse(Iliad_1_1_TLG);
      let TypeGreekAst = TypeGreekParser.parse(Iliad_1_1_TypeGreek);
      it("is able to parse the TLG formatted Greek into an AST", () => {
        expect(TlgAst.ok).toBe(true);
      });
      it("is able to parse the TypeGreek formatted Greek into an AST", () => {
        expect(TypeGreekAst.ok).toBe(true);
      });

      it("converts the input into exactly 33 character nodes, regardless of which parser is used", () => {
        if (TlgAst.ok && TypeGreekAst.ok) {
          expect(TlgAst.ast.length).toBe(33);
          expect(TypeGreekAst.ast.length).toBe(33);
        }
      });
      it("returns an AST with an eta node at position 1 with a circumflex accent, regardless of which parser is used", () => {
        if (TlgAst.ok && TypeGreekAst.ok) {
          expect(TlgAst.ast[1]).toBeInstanceOf(GreekVowelNode);
          expect(TypeGreekAst.ast[1]).toBeInstanceOf(GreekVowelNode);

          if (TlgAst.ast[1] instanceof GreekVowelNode) {
            expect(TlgAst.ast[1].name.tokenType).toBe(TokenType.ETA);
            expect(TlgAst.ast[1].accent!.tokenType).toBe(TokenType.CIRCUMFLEX);
          }
          if (TypeGreekAst.ast[1] instanceof GreekVowelNode) {
            expect(TypeGreekAst.ast[1].name.tokenType).toBe(TokenType.ETA);
            expect(TypeGreekAst.ast[1].accent!.tokenType).toBe(
              TokenType.CIRCUMFLEX
            );
          }
        }
      });
      it("returns an AST with an alpha node at position 6 with a smooth breathing and acute accent, regardless of which parser is used", () => {
        if (TlgAst.ok && TypeGreekAst.ok) {
          expect(TlgAst.ast[6]).toBeInstanceOf(GreekVowelNode);
          expect(TypeGreekAst.ast[6]).toBeInstanceOf(GreekVowelNode);

          if (TlgAst.ast[6] instanceof GreekVowelNode) {
            expect(TlgAst.ast[6].name.tokenType).toBe(TokenType.ALPHA);
            expect(TlgAst.ast[6].accent!.tokenType).toBe(TokenType.ACUTE);
            expect(TlgAst.ast[6].breathing!.tokenType).toBe(TokenType.SMOOTH);
          }
          if (TypeGreekAst.ast[6] instanceof GreekVowelNode) {
            expect(TypeGreekAst.ast[6].name.tokenType).toBe(TokenType.ALPHA);
            expect(TypeGreekAst.ast[6].accent!.tokenType).toBe(TokenType.ACUTE);
            expect(TypeGreekAst.ast[6].breathing!.tokenType).toBe(
              TokenType.SMOOTH
            );
          }
        }
      });
    });
  });
});
