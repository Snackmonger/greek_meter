/**
 * The literal form of some single-character symbols used by the program.
 */
export enum TextSymbol {
  NEWLINE = "\n",
  HYPHEN = "-",
  CARET = "^",
  PERIOD = ".",
  COMMA = ",",
  SEMICOLON = ";",
  QUESTION = "?",
  L_PAREN = "(",
  R_PAREN = ")",
  SLASH = "/",
  BACKSLASH = "\\",
  EQUALS = "=",
  PLUS = "+",
  SINGLE_QUOTE = "'",
  COLON = ":",
  UNDERSCORE = "_"

}

/**
 * Token types recognized by the lexers.
 */
export const TokenType = {
  UPPERCASE: "uppercase",
  WHITESPACE: "whitespace",
  TAB: "tab",
  NEWLINE: "newline",
  DIGIT: "digit",

  UNDERDOT: "underdot",
  PERIOD: "period",
  COMMA: "comma",
  MIDDLEDOT: "middledot",
  QUESTION: "question",
  APOSTROPHE: "apostrophe",
  EMDASH: "emdash",
  ENDASH: "endash",
  MISSING_LETTER: "missing_letter",
  ACUTE: "acute",
  GRAVE: "grave",
  CIRCUMFLEX: "circumflex",
  DIAERESIS: "diaeresis",
  SUBSCRIPT: "subscript",
  ROUGH: "rough",
  SMOOTH: "smooth",
  
  OPEN_BRACKET: "open_bracket",
  CLOSE_BRACKET: "close_bracket",
  OPEN_TEXT_FORMATTING: "open_text_formatting",
  CLOSE_TEXT_FORMATTING: "close_text_formatting",
  PAGE_FORMATTING: "page_formatting",
  ADDITIONAL_PUNCTUATION: "additional_punctuation",
  ADDITIONAL_CHARACTER: "additional_character",
  QUOTATION_MARK: "quotation_mark",
  MARKUP: "markup",
  GREEK_STYLE: "greek_style",
  LATIN_STYLE: "latin_style",

  ALPHA: "alpha",
  BETA: "beta",
  GAMMA: "gamma",
  DELTA: "delta",
  EPSILON: "epsilon",
  ZETA: "zeta",
  ETA: "eta",
  THETA: "theta",
  IOTA: "iota",
  KAPPA: "kappa",
  LAMBDA: "lambda",
  MU: "mu",
  NU: "nu",
  XI: "xi",
  OMICRON: "omicron",
  PI: "pi",
  RHO: "rho",
  SIGMA: "sigma",
  TAU: "tau",
  UPSILON: "upsilon",
  PHI: "phi",
  CHI: "chi",
  PSI: "psi",
  OMEGA: "omega",
  DIGAMMA: "digamma",
}



