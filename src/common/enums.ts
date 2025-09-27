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
  UNDERSCORE = "_",
}

/**
 * Token types recognized by the lexers.
 */
export enum TokenType {
  UPPERCASE = "uppercase",
  WHITESPACE = "whitespace",
  TAB = "tab",
  NEWLINE = "newline",
  DIGIT = "digit",
  SECTION_NUMBER = "section_number",
  LINE_NUMBER = "line_number",
  NEW_PAGE = 'new_page',
  EDITORIAL_SYMBOL = 'editorial_symbol',


  UNDERDOT = "underdot",
  PERIOD = "period",
  COMMA = "comma",
  COLON = "colon",
  ELLIPSIS = "ellipsis",
  MIDDLEDOT = "middledot",
  QUESTION = "question",
  APOSTROPHE = "apostrophe",
  EMDASH = "emdash",
  ENDASH = "endash",
  HYPHEN = "hyphen",
  EXCLAMATION = "exclamation",
  MISSING_LETTER = "missing_letter",

  ACUTE = "acute",
  GRAVE = "grave",
  CIRCUMFLEX = "circumflex",

  DIAERESIS = "diaeresis",
  SUBSCRIPT = "subscript",

  ROUGH = "rough",
  SMOOTH = "smooth",

  MACRON = "macron",
  BREVE = "breve",

  OPEN_BRACKET = "open_bracket",
  CLOSE_BRACKET = "close_bracket",
  OPEN_PAREN = "open_paren",
  CLOSE_PAREN = "close_paren",
  OPEN_TEXT_FORMATTING = "open_text_formatting",
  CLOSE_TEXT_FORMATTING = "close_text_formatting",
  PAGE_FORMATTING = "page_formatting",
  ADDITIONAL_PUNCTUATION = "additional_punctuation",
  ADDITIONAL_CHARACTER = "additional_character",
  QUOTATION_MARK = "quotation_mark",
  OPEN_BRACE = "open_brace",
  CLOSE_BRACE = "close_brace",
  OPEN_GUILLEMET = "open_guillemet",
  CLOSE_GUILLEMET = "close_guillemet",
  GREEK_STYLE = "greek_style",
  LATIN_STYLE = "latin_style",
  TLG_CITATION = "tlg_citation",

  ALPHA = "alpha",
  BETA = "beta",
  GAMMA = "gamma",
  DELTA = "delta",
  EPSILON = "epsilon",
  ZETA = "zeta",
  ETA = "eta",
  THETA = "theta",
  IOTA = "iota",
  KAPPA = "kappa",
  LAMBDA = "lambda",
  MU = "mu",
  NU = "nu",
  XI = "xi",
  OMICRON = "omicron",
  PI = "pi",
  RHO = "rho",
  SIGMA = "sigma",
  TAU = "tau",
  UPSILON = "upsilon",
  PHI = "phi",
  CHI = "chi",
  PSI = "psi",
  OMEGA = "omega",
  DIGAMMA = "digamma",
  KOPPA = "koppa",
  STIGMA = "stigma",
  SANPI = "sanpi"
}

/**
 * Encoding types for Greek text.
 *
 * When unicode text is used, it will be normalized before parsing,
 * so the distinction between precomposed and combining is only relevant
 * for outputs.
 */
export enum GreekEncoding {
  TLG_BETA_CODE = "tlg_beta_code",
  TYPEGREEK_BETA_CODE = "typegreek_beta_code",
  UNICODE = "unicode",
  UNICODE_PRECOMPOSED = "unicode_precomposed",
  UNICODE_COMBINING = "unicode_combining",
  UNKNOWN = "unknown",
}

export enum CombiningDiacritics {
  GRAVE = "\u0300",
  ACUTE = "\u0301",
  GREEK_CIRCUMFLEX = "\u0342",
  LATIN_CIRCUMFLEX = "\u0302",
  TILDE = "\u0303",
  ROUGH = "\u0314",
  SMOOTH = "\u0313",
  DIAERESIS = "\u0308",
  SUBSCRIPT = "\u0345",
  UNDERDOT = "\u0323",
  DIAERESIS_TONOS = "\u0344",
  ACUTE_TONOS = "\u0340",
  GRAVE_TONOS = "\u0341",
  BREVE = "\u0306",
  MACRON = "\u0304",
}
