import {
  CharacterAnnotation,
  TextSymbol,
  TokenType,
} from "../../../common/enums";
import {
  IGreekAlphabeticData,
  IGreekCharacterNode,
  IGreekCharacterNodeVisitor,
  IGreekEditorialSymbolData,
  IGreekPunctuationData,
  IGreekSpaceData,
  IGreekVowelData,
} from "../../../common/interfaces/character";

/**
 * Convert character intermediary nodes into TLG style beta code.
 */
export class TlgBetacodeVisitor implements IGreekCharacterNodeVisitor {
  public visitGreekVowel(node: IGreekVowelData & IGreekCharacterNode): string {
    let prefix = "";
    let suffix: string = "";
    let letter: string = "";
    switch (node.name.tokenType) {
      case TokenType.ALPHA: {
        letter = TextSymbol.A;
        break;
      }
      case TokenType.EPSILON: {
        letter = TextSymbol.E;
        break;
      }
      case TokenType.ETA: {
        letter = TextSymbol.H;
        break;
      }
      case TokenType.IOTA: {
        letter = TextSymbol.I;
        break;
      }
      case TokenType.OMICRON: {
        letter = TextSymbol.O;
        break;
      }
      case TokenType.UPSILON: {
        letter = TextSymbol.U;
        break;
      }
      case TokenType.OMEGA: {
        letter = TextSymbol.W;
        break;
      }
    }
    if (node.breathing) {
      switch (node.breathing.tokenType) {
        case TokenType.ROUGH: {
          suffix += TextSymbol.L_PAREN;
          break;
        }
        case TokenType.SMOOTH: {
          suffix += TextSymbol.R_PAREN;
          break;
        }
        default:
          throw `Unrecognized breathing token: ${node.breathing.tokenType}`;
      }
    }
    if (node.accent) {
      switch (node.accent.tokenType) {
        case TokenType.ACUTE: {
          suffix += TextSymbol.SLASH;
          break;
        }
        case TokenType.GRAVE: {
          suffix += TextSymbol.BACKSLASH;
          break;
        }
        case TokenType.CIRCUMFLEX: {
          suffix += TextSymbol.EQUALS;
          break;
        }
        default:
          throw `Unexpected accent token: ${node.accent.tokenType}`;
      }
    }
    if (node.isUppercase) {
      prefix += TextSymbol.ASTERISK + suffix;
      suffix = "";
    }
    if (node.modifier) {
      switch (node.modifier.tokenType) {
        case TokenType.DIAERESIS: {
          suffix += TextSymbol.PLUS;
          break;
        }
        case TokenType.SUBSCRIPT: {
          suffix += TextSymbol.PIPE;
          break;
        }
        default:
          throw `Unexpected modifier token: ${node.modifier.tokenType}`;
      }
    }
    return prefix + letter + suffix
  }

  public visitGreekConsonant(
    node: IGreekAlphabeticData & IGreekCharacterNode
  ): string {
    let output = "";
    if (node.isUppercase) {
      output += TextSymbol.ASTERISK;
    }

    // Rho follows uppercase convention for vowels with breathing mark
    if (node.name.tokenType === TokenType.RHO) {
      let letter: string = TextSymbol.R;
      let mark: string = "";
      if (node.annotation) {
        if (node.annotation === CharacterAnnotation.SMOOTH) {
          mark = TextSymbol.R_PAREN;
        }
        if (node.annotation === CharacterAnnotation.ROUGH) {
          mark = TextSymbol.L_PAREN;
        }
        if (node.isUppercase) {
          return output + mark + letter;
        }
      }
      return output + letter + mark;
    }

    // Sigma may be suffixed with a number to indicate its typographic form
    if (node.name.tokenType === TokenType.SIGMA) {
      let letter: string = TextSymbol.S;
      let suffix: string = "";
      if (node.annotation) {
        if (!node.isUppercase) {
          if (node.annotation === CharacterAnnotation.OPEN) {
            suffix = TextSymbol.TWO;
          }
          if (node.annotation === CharacterAnnotation.CLOSED) {
            suffix = TextSymbol.ONE;
          }
        }
        if (node.annotation === CharacterAnnotation.LUNATE) {
          suffix = TextSymbol.THREE;
        }
      }
      return output + letter + suffix;
    }

    // 1:1 conversions
    switch (node.name.tokenType) {
      case TokenType.ALPHA: {
        output += TextSymbol.A;
        break;
      }
      case TokenType.BETA: {
        output += TextSymbol.B;
        break;
      }
      case TokenType.GAMMA: {
        output += TextSymbol.G;
        break;
      }
      case TokenType.DELTA: {
        output += TextSymbol.D;
        break;
      }
      case TokenType.ZETA: {
        output += TextSymbol.Z;
        break;
      }
      case TokenType.THETA: {
        output += TextSymbol.Q;
        break;
      }
      case TokenType.KAPPA: {
        output += TextSymbol.K;
        break;
      }
      case TokenType.LAMBDA: {
        output += TextSymbol.L;
        break;
      }
      case TokenType.MU: {
        output += TextSymbol.M;
        break;
      }
      case TokenType.NU: {
        output += TextSymbol.N;
        break;
      }
      case TokenType.XI: {
        output += TextSymbol.C;
        break;
      }
      case TokenType.PI: {
        output += TextSymbol.P;
        break;
      }
      case TokenType.TAU: {
        output += TextSymbol.T;
        break;
      }
      case TokenType.PHI: {
        output += TextSymbol.F;
        break;
      }
      case TokenType.CHI: {
        output += TextSymbol.X;
        break;
      }
      case TokenType.PSI: {
        output += TextSymbol.Y;
        break;
      }
      case TokenType.DIGAMMA: {
        output += TextSymbol.V;
        break;
      }
      default: {
        throw `Unrecognized consonant: ${node.name.tokenType}`;
      }
    }
    return output;
  }

  public visitGreekPunctuation(
    node: IGreekPunctuationData & IGreekCharacterNode
  ): string {}

  public visitGreekEditorialSymbol(
    node: IGreekEditorialSymbolData & IGreekCharacterNode
  ): string {}

  public visitGreekSpace(node: IGreekSpaceData & IGreekCharacterNode): string {}
}
