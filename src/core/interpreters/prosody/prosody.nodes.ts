import { IGreekAlphabeticData, IGreekVowelData } from "../../../common/interfaces/character";
import {
  IGreekLineData,
  IGreekProsodyNode,
  IGreekProsodyNodeVisitor,
  IGreekSyllableData,
  IGreekWordData,
} from "../../../common/interfaces/prosody";

export class GreekSyllableNode implements IGreekProsodyNode, IGreekSyllableData {
  constructor(
    public onset: IGreekAlphabeticData[],
    public nucleus: IGreekVowelData,
    public coda: IGreekAlphabeticData[]
  ) {}
  public accept(visitor: IGreekProsodyNodeVisitor) {
    return visitor.visitGreekSyllable(this);
  }
}

export class GreekWordNode implements IGreekProsodyNode, IGreekWordData {
  constructor(public syllables: GreekSyllableNode[]) {}
  public accept(visitor: IGreekProsodyNodeVisitor) {
    return visitor.visitGreekWord(this);
  }
}

export class GreekLineNode implements IGreekProsodyNode, IGreekLineData {
  constructor(public words: GreekWordNode[]) {}
  public accept(visitor: IGreekProsodyNodeVisitor) {
    return visitor.visitGreekLine(this);
  }
}
