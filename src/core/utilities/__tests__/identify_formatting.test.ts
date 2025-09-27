import { GreekEncoding } from "../../../common/enums";
import {
  identifyEncoding,
  isCombiningGreek,
  isPrecomposedGreek,
  isTlgBetacode,
  isTypeGreekBetacode,
  isUnicodeGreek,
} from "../identify_formatting";

const TLGSpecimen = `@73~y1z"t" {1*I*L*I*A*D*O*S *A}1
~z1
*MH=NIN A)/EIDE QEA\ *PHLHI+A/DEW *)AXILH=OS
{2#15}2 OU)LOME/NHN, H(\ MURI/' *)AXAIOI=S A)/LGE' E)/QHKE,
{2#15}2 POLLA\S D' I)FQI/MOUS YUXA\S *)/AI+DI PROI/+AYEN
H(RW/WN, AU)TOU\S DE\ E(LW/RIA TEU=XE KU/NESSIN
{2#14}2 OI)WNOI=SI/ TE PA=SI, *DIO\S D' E)TELEI/ETO BOULH/,
E)C OU(= DH\ TA\ PRW=TA DIASTH/THN E)RI/SANTE
{2#14}2 *)ATREI/+DHS TE A)/NAC A)NDRW=N KAI\ DI=OS *)AXILLEU/S.`;

const typeGreekSpecimen = `Mh=nin a)/eide qea\ Phlhi+a/dew A)xilh=os
ou)lome/nhn, h(\ muri/' A)xaioi=s a)/lge' e)/qhke`;

const precomposedGreekSpecimen = `        ΙΛΙΑΔΟΣ Α    

Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος   (1)
>
οὐλομένην, ἣ μυρί’ Ἀχαιοῖς ἄλγε’ ἔθηκε,
>
πολλὰς δ’ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν
ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν
⸖
οἰωνοῖσί τε πᾶσι, Διὸς δ’ ἐτελείετο βουλή,    (5)
ἐξ οὗ δὴ τὰ πρῶτα διαστήτην ἐρίσαντε
⸖
Ἀτρεΐδης τε ἄναξ ἀνδρῶν καὶ δῖος Ἀχιλλεύς.
  Τίς τάρ σφωε θεῶν ἔριδι ξυνέηκε μάχεσθαι; @1`;

const combiningGreekSpecimen = `Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος
οὐλομένην, ἣ μυρί' Ἀχαιοῖς ἄλγε' ἔθηκε`;

const unicodeGreekMixedSpecimen = `Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος
οὐλομένην, ἣ μυρί' Ἀχαιοῖς ἄλγε' ἔθηκε,
πολλὰς δ’ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν
ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν`;

describe("identify formatting module", () => {
  describe("isTypeGreek", () => {
    it("tests positive for TypeGreek beta code", () => {
      expect(isTypeGreekBetacode(typeGreekSpecimen)).toBe(true);
    });
    it("tests negative for TLG beta code", () => {
      expect(isTypeGreekBetacode(TLGSpecimen)).toBe(false);
    });
    it("tests negative for Unicode Greek with precomposed diacritics", () => {
      expect(isTypeGreekBetacode(precomposedGreekSpecimen)).toBe(false);
    });
    it("tests negative for Unicode Greek with combining diacritics", () => {
      expect(isTypeGreekBetacode(combiningGreekSpecimen)).toBe(false);
    });
    it("tests negative for Unicode Greek with mixed formatting", () => {
      expect(isTypeGreekBetacode(unicodeGreekMixedSpecimen)).toBe(false);
    });
  });

  describe("isTLGBetacode", () => {
    it("tests positive for TLG beta code", () => {
      expect(isTlgBetacode(TLGSpecimen)).toBe(true);
    });
    it("tests positive for TypeGreek beta code (TypeGreek beta code is compatible with TLG, but loses capital letters)", () => {
      expect(isTlgBetacode(typeGreekSpecimen)).toBe(true);
    });
    it("tests negative for Unicode Greek with precomposed diacritics", () => {
      expect(isTlgBetacode(precomposedGreekSpecimen)).toBe(false);
    });
    it("tests negative for Unicode Greek with combining diacritics", () => {
      expect(isTlgBetacode(combiningGreekSpecimen)).toBe(false);
    });
    it("tests negative for Unicode Greek with mixed formatting", () => {
      expect(isTlgBetacode(unicodeGreekMixedSpecimen)).toBe(false);
    });
  });

  describe("isPrecomposedGreek", () => {
    it("tests positive for Unicode Greek with precomposed diacritics", () => {
      expect(isPrecomposedGreek(precomposedGreekSpecimen)).toBe(true);
    });
    it("tests negative for TLG beta code", () => {
      expect(isPrecomposedGreek(TLGSpecimen)).toBe(false);
    });
    it("tests negative for TypeGreek beta code", () => {
      expect(isPrecomposedGreek(typeGreekSpecimen)).toBe(false);
    });
    it("tests negative for Unicode Greek with combining diacritics", () => {
      expect(isPrecomposedGreek(combiningGreekSpecimen)).toBe(false);
    });
    it("tests negative for Unicode Greek with mixed formatting", () => {
      expect(isPrecomposedGreek(unicodeGreekMixedSpecimen)).toBe(false);
    });
  });

  describe("isCombiningGreek", () => {
    it("tests positive for Unicode Greek with combining diacritics", () => {
      expect(isCombiningGreek(combiningGreekSpecimen)).toBe(true);
    });
    it("tests negative for TLG beta code", () => {
      expect(isCombiningGreek(TLGSpecimen)).toBe(false);
    });
    it("tests negative for TypeGreek beta code", () => {
      expect(isCombiningGreek(typeGreekSpecimen)).toBe(false);
    });
    it("tests negative for Unicode Greek with precomposed diacritics", () => {
      expect(isCombiningGreek(precomposedGreekSpecimen)).toBe(false);
    });
    it("tests negative for Unicode Greek with mixed formatting", () => {
      expect(isCombiningGreek(unicodeGreekMixedSpecimen)).toBe(false);
    });
  });

  describe("isUnicodeGreek", () => {
    it("tests positive for Unicode Greek with precomposed diacritics", () => {
      expect(isUnicodeGreek(precomposedGreekSpecimen)).toBe(true);
    });
    it("tests positive for Unicode Greek with combining diacritics", () => {
      expect(isUnicodeGreek(combiningGreekSpecimen)).toBe(true);
    });
    it("tests positive for Unicode Greek with mixed formatting", () => {
      expect(isUnicodeGreek(unicodeGreekMixedSpecimen)).toBe(true);
    });
    it("tests negative for TLG beta code", () => {
      expect(isUnicodeGreek(TLGSpecimen)).toBe(false);
    });
    it("tests negative for TypeGreek beta code", () => {
      expect(isUnicodeGreek(typeGreekSpecimen)).toBe(false);
    });
  });

  describe("identifyEncoding", () => {
    it("identifies TLG beta code", () => {
      expect(identifyEncoding(TLGSpecimen)).toBe(GreekEncoding.TLG_BETA_CODE);
    });

    it("identifies TypeGreek beta code", () => {
      expect(identifyEncoding(typeGreekSpecimen)).toBe(
        GreekEncoding.TYPEGREEK_BETA_CODE
      );
    });

    it("identifies unicode Greek with precomposed diacritics", () => {
      expect(identifyEncoding(precomposedGreekSpecimen)).toBe(
        GreekEncoding.UNICODE_PRECOMPOSED
      );
    });

    it("identifies unicode Greek with combining diacritics", () => {
      expect(identifyEncoding(combiningGreekSpecimen)).toBe(
        GreekEncoding.UNICODE_COMBINING
      );
    });

    it("identifies unicode Greek with mixed formatting", () => {
      expect(identifyEncoding(unicodeGreekMixedSpecimen)).toBe(
        GreekEncoding.UNICODE
      );
    });

    it("identifies incompatible encoding as unknown", () => {
      expect(identifyEncoding(`\u{10000}`)).toBe(GreekEncoding.UNKNOWN);
    });
  });
});
