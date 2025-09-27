import {
  IGreekLineData,
  IGreekProsodyNode,
  IGreekProsodyNodeVisitor,
  IGreekSyllableData,
  IGreekWordData,
} from "../../../common/interfaces/prosody";

export class GreekMetricalVisitor implements IGreekProsodyNodeVisitor {
  visitGreekLine(node: IGreekProsodyNode & IGreekLineData): any {
    // Analyze how syllables at the end of words are affected by syllables
    // at the beginning of the following word
  }
  visitGreekWord(node: IGreekProsodyNode & IGreekWordData): any {
    // Analyze how syllables are affected by following syllables
    // in the same word
  }
  visitGreekSyllable(node: IGreekProsodyNode & IGreekSyllableData): any {
    // Analyze the surface length of the syllable
  }
}
