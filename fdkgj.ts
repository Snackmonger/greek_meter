
import { GreekCharacterNodeFactory } from "./src/core/character_intermediary/character.factory"
import { TlgBetacodeParser } from "./src/core/parsers/betacode/tlg.parser"
import { TypegreekBetacodeParser } from "./src/core/parsers/betacode/typegreek.parser"

let sampleTextTLG = `*MH=NIN A)/EIDE QEA\ *PHLHI+A/DEW *)AXILH=OS`
let sampleTextUnicode = `Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος`
let sampleTextTypeGreek = "Mh=nin a)/eide qea\ Phlhi+a/dew A)xilh=os"
let resultTLG = new TlgBetacodeParser(GreekCharacterNodeFactory).parse(sampleTextTLG);
let resultTypeGreek = new TypegreekBetacodeParser(GreekCharacterNodeFactory).parse(sampleTextTypeGreek)


if (resultTLG.ok && resultTypeGreek.ok) {
    console.log(resultTLG.ast.length === resultTypeGreek.ast.length) // 33
}
