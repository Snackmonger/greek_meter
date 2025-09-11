import { TokenType } from "../../common/enums";
import Lexer from "../../common/lexer";
import Token from "../../common/token";

export let TlgBetacodeLexer = new Lexer(Token)
  // Alphabetic
  .addRule(TokenType.ALPHA, /a/i)
  .addRule(TokenType.BETA, /b/i)
  .addRule(TokenType.GAMMA, /g/i)
  .addRule(TokenType.DELTA, /d/i)
  .addRule(TokenType.EPSILON, /e/i)
  .addRule(TokenType.ZETA, /z/i)
  .addRule(TokenType.ETA, /h/i)
  .addRule(TokenType.THETA, /q/i)
  .addRule(TokenType.IOTA, /i/i)
  .addRule(TokenType.KAPPA, /k/i)
  .addRule(TokenType.LAMBDA, /l/i)
  .addRule(TokenType.MU, /m/i)
  .addRule(TokenType.NU, /n/i)
  .addRule(TokenType.XI, /c/i)
  .addRule(TokenType.OMICRON, /o/i)
  .addRule(TokenType.PI, /p/i)
  .addRule(TokenType.RHO, /r/i)
  .addRule(TokenType.SIGMA, /s/i)
  .addRule(TokenType.TAU, /t/i)
  .addRule(TokenType.UPSILON, /u/i)
  .addRule(TokenType.PHI, /f/i)
  .addRule(TokenType.CHI, /x/i)
  .addRule(TokenType.PSI, /y/i)
  .addRule(TokenType.OMEGA, /w/i)
  .addRule(TokenType.DIGAMMA, /v/i)
  .addRule(TokenType.UPPERCASE, /\*/)

  // Accents
  .addRule(TokenType.ACUTE, /\//)
  .addRule(TokenType.GRAVE, /\\/)
  .addRule(TokenType.CIRCUMFLEX, /[=]/)

  // Modifiers
  .addRule(TokenType.DIAERESIS, /[+]/)
  .addRule(TokenType.SUBSCRIPT, /[|]/)

  // Breathings
  .addRule(TokenType.ROUGH, /[(]/)
  .addRule(TokenType.SMOOTH, /[)]/)

  // Punctuation
  .addRule(TokenType.UNDERDOT, /\?/)
  .addRule(TokenType.PERIOD, /\./)
  .addRule(TokenType.COMMA, /,/)
  .addRule(TokenType.MIDDLEDOT, /:/)
  .addRule(TokenType.QUESTION, /;/)
  .addRule(TokenType.APOSTROPHE, /'/)
  .addRule(TokenType.EMDASH, /_/)
  .addRule(TokenType.ENDASH, /\-/)
  .addRule(TokenType.MISSING_LETTER, /!/)

  // Editorial & Control Symbols
  .addRule(TokenType.OPEN_BRACKET, /\[/)
  .addRule(TokenType.CLOSE_BRACKET, /\]/)
  .addRule(TokenType.PAGE_FORMATTING, /[@]/)
  .addRule(TokenType.ADDITIONAL_PUNCTUATION, /[%]/)
  .addRule(TokenType.ADDITIONAL_CHARACTER, /[#]/)
  .addRule(TokenType.OPEN_TEXT_FORMATTING, /[<]/)
  .addRule(TokenType.CLOSE_TEXT_FORMATTING, /[>]/)
  .addRule(TokenType.QUOTATION_MARK, /["]/)
  .addRule(TokenType.MARKUP, /[{]/)
  .addRule(TokenType.GREEK_STYLE, /[$]/)
  .addRule(TokenType.LATIN_STYLE, /[&]/)

  // Misc.
  .addRule(TokenType.WHITESPACE, /[ ]/)
  .addRule(TokenType.TAB, /[\t]/)
  .addRule(TokenType.NEWLINE, /[\n]/)
  .addRule(TokenType.DIGIT, /\d*/, (x: string) => +x);
