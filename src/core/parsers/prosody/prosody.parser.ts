import { IGreekCharacterNode } from "../../../common/interfaces/character";
import {
  IGreekLineData,
  IGreekProsodyNode,
  IGreekProsodyNodeFactory,
} from "../../../common/interfaces/prosody";
import { ParserBase } from "../../../common/parser";
import { ParsingResult } from "../../../common/parser.types";

export default class ProsodyParser extends ParserBase<
  IGreekCharacterNode[],
  IGreekProsodyNode,
  ParsingResult<IGreekProsodyNode & IGreekLineData[]>,
  IGreekCharacterNode
> {
  protected currentPosition: number;
  protected characters: IGreekCharacterNode[];
  protected errors: string[];
  protected astNodeFactory: IGreekProsodyNodeFactory;

  constructor(astNodeFactory: IGreekProsodyNodeFactory) {
    super();
    this.astNodeFactory = astNodeFactory;
    this.currentPosition = 0;
    this.characters = [];
    this.errors = [];
  }
  protected check(identifier: IGreekProsodyNode): boolean {
    
    return true;
  }

  protected makeErrorMsg(errorMsg: string): string {}

  public parse(characters: IGreekCharacterNode[]): ParsingResult<IGreekProsodyNode & IGreekLineData[]> {


    return {ok: false, error: []};
  }

  protected isAtEnd(): boolean {
    return this.currentPosition >= this.characters.length;
  }

  protected advance(): IGreekCharacterNode {
    let node = this.characters[this.currentPosition];
    this.currentPosition += 1;
    return node;
  }
}
