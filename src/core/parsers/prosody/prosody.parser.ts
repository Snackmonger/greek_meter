import { IGreekCharacterNode, IGreekProsodyNodeFactory } from "../../common/interfaces";
import { GreekLineNode } from "../../interpreters/prosody/prosody.nodes";

export default class ProsodyParser {
  private currentPosition: number;
  private characters: IGreekCharacterNode[];
  private errors: string[];
  private astNodeFactory: IGreekProsodyNodeFactory

  constructor(astNodeFactory: IGreekProsodyNodeFactory) {
    this.astNodeFactory = astNodeFactory
    this.currentPosition = 0;
    this.characters = [];
    this.errors = [];
  }

  public parse(characters: IGreekCharacterNode[]): GreekLineNode[] {
    return [];
  }

  private isAtEnd(): boolean {
    return this.currentPosition >= this.characters.length;
  }

  private advance(): IGreekCharacterNode {
    let node = this.characters[this.currentPosition];
    this.currentPosition += 1;
    return node
  }
}
