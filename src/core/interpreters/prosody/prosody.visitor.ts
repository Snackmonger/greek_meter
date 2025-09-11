import {
  IGreekLine,
  IGreekProsodyNode,
  IGreekProsodyNodeVisitor,
  IGreekSyllable,
  IGreekWord,
} from "../../../common/interfaces";

export class GreekMetricalVisitor implements IGreekProsodyNodeVisitor {
  visitGreekLine(node: IGreekProsodyNode & IGreekLine): any {
    // Analyze how syllables at the end of words are affected by syllables
    // at the beginning of the following word
  }
  visitGreekWord(node: IGreekProsodyNode & IGreekWord): any {
    // Analyze how syllables are affected by following syllables
    // in the same word
  }
  visitGreekSyllable(node: IGreekProsodyNode & IGreekSyllable): any {
    // Analyze the surface length of the syllable
  }
}
