import {
  IGreekAlphabeticChar,
  IGreekLine,
  IGreekProsodyNode,
  IGreekProsodyNodeVisitor,
  IGreekSyllable,
  IGreekVowel,
  IGreekWord,
} from "../../../common/interfaces";

export class GreekSyllableNode implements IGreekProsodyNode, IGreekSyllable {
  constructor(
    public onset: IGreekAlphabeticChar[],
    public nucleus: IGreekVowel,
    public coda: IGreekAlphabeticChar[]
  ) {}
  public accept(visitor: IGreekProsodyNodeVisitor) {
    return visitor.visitGreekSyllable(this);
  }
}

export class GreekWordNode implements IGreekProsodyNode, IGreekWord {
  constructor(public syllables: GreekSyllableNode[]) {}
  public accept(visitor: IGreekProsodyNodeVisitor) {
    return visitor.visitGreekWord(this);
  }
}

export class GreekLineNode implements IGreekProsodyNode, IGreekLine {
  constructor(public words: GreekWordNode[]) {}
  public accept(visitor: IGreekProsodyNodeVisitor) {
    return visitor.visitGreekLine(this);
  }
}
