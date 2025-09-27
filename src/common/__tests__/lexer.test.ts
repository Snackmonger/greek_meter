import { UnexpectedCharacterError } from "../errors";
import Lexer from "../lexer";
import Token from "../token";


describe("Token", () => {
  let token: Token;

  beforeEach(() => {
    token = new Token("IDENTIFIER", "hello", 0, 5, 1, 1);
  });

  it("should initialize with correct properties", () => {
    expect(token.tokenType).toBe("IDENTIFIER");
    expect(token.lexeme).toBe("hello");
    expect(token.start).toBe(0);
    expect(token.end).toBe(5);
    expect(token.line).toBe(1);
    expect(token.column).toBe(1);
  });

  it("should calculate length correctly", () => {
    expect(token.length).toBe(5);
  });

  it("should return correct string representation", () => {
    expect(token.toString()).toBe("Token(IDENTIFIER, hello, 1[1])");
  });
});

describe("Lexer", () => {
  let lexer: Lexer;

  beforeEach(() => {
    lexer = new Lexer(Token);
  });

  describe("constructor", () => {
    it("should initialize with empty templates and tokens", () => {
      expect(lexer["templates"]).toEqual([]);
      expect(lexer["tokens"]).toEqual([]);
    });

    it("should set token constructor", () => {
      expect(lexer["tokenType"]).toBe(Token);
    });
  });

  describe("addRule", () => {
    it("should add rule and return lexer for chaining", () => {
      const result = lexer.addRule("NUMBER", /\d+/);

      expect(result).toBe(lexer);
      expect(lexer["templates"]).toHaveLength(1);
      expect(lexer["templates"][0]).toEqual({
        tokenType: "NUMBER",
        regexPattern: /\d+/,
        callback: undefined,
      });
    });

    it("should add rule with callback", () => {
      const callback = (lexeme: string) => parseInt(lexeme);
      lexer.addRule("NUMBER", /\d+/, callback);

      expect(lexer["templates"][0].callback).toBe(callback);
    });

    it("should allow method chaining", () => {
      const result = lexer
        .addRule("NUMBER", /\d+/)
        .addRule("IDENTIFIER", /[a-zA-Z_][a-zA-Z0-9_]*/);

      expect(result).toBe(lexer);
      expect(lexer["templates"]).toHaveLength(2);
    });
  });

  describe("match", () => {
    beforeEach(() => {
      lexer.addRule("NUMBER", /\d+/, (lexeme) => parseInt(lexeme));
    });

    it("should return token for valid match at start", () => {
      const template = lexer["templates"][0];
      const token = lexer.match(template, "123abc");

      expect(token).not.toBeNull();
      expect(token!.tokenType).toBe("NUMBER");
      expect(token!.lexeme).toBe("123");
      expect(token!.start).toBe(0);
      expect(token!.end).toBe(3);
      expect(token!.value).toBe(123);
    });

    it("should return null for no match", () => {
      const template = lexer["templates"][0];
      const token = lexer.match(template, "abc123");

      expect(token).toBeNull();
    });

    it("should return null for match not at start position", () => {
      const template = lexer["templates"][0];
      const token = lexer.match(template, "a123");

      expect(token).toBeNull();
    });

    it("should handle newlines in lexeme", () => {
      lexer.addRule("MULTILINE", /.*\n.*/s);
      const template = lexer["templates"][1];
      const token = lexer.match(template, "line0\nline1");

      expect(token).not.toBeNull();
      expect(token!.line).toBe(1); // Should increment line count
    });
  });

  describe("tokenize", () => {
    it("should tokenize simple input", () => {
      lexer
        .addRule("NUMBER", /\d+/, (lexeme) => parseInt(lexeme))
        .addRule("PLUS", /\+/)
        .addRule("WHITESPACE", /\s+/);

      const tokens = lexer.tokenize("123 + 456");

      expect(tokens).toHaveLength(5);
      expect(tokens[0].tokenType).toBe("NUMBER");
      expect(tokens[0].lexeme).toBe("123");
      expect(tokens[0].value).toBe(123);
      expect(tokens[1].tokenType).toBe("WHITESPACE");
      expect(tokens[2].tokenType).toBe("PLUS");
      expect(tokens[3].tokenType).toBe("WHITESPACE");
      expect(tokens[4].tokenType).toBe("NUMBER");
      expect(tokens[4].value).toBe(456);
    });

    it("should filter out specified token types", () => {
      lexer
        .addRule("NUMBER", /\d+/)
        .addRule("PLUS", /\+/)
        .addRule("WHITESPACE", /\s+/);

      const tokens = lexer.tokenize("123 + 456", "WHITESPACE");

      expect(tokens).toHaveLength(3);
      expect(tokens.every((t) => t.tokenType !== "WHITESPACE")).toBe(true);
    });

    it("should throw UnexpectedCharacterError for unmatched characters", () => {
      lexer.addRule("LETTER", /[a-z]/);

      expect(() => lexer.tokenize("a1b")).toThrow(UnexpectedCharacterError);
    });

    it("should handle empty input", () => {
      lexer.addRule("LETTER", /[a-z]/);
      const tokens = lexer.tokenize("");

      expect(tokens).toEqual([]);
    });

    it("should track line and column numbers correctly", () => {
      lexer.addRule("LETTER", /[a-z]/).addRule("NEWLINE", /\n/);

      const tokens = lexer.tokenize("a\nb");
      expect(tokens[0].line).toBe(0);
      expect(tokens[0].column).toBe(1);
      expect(tokens[1].line).toBe(1);
      expect(tokens[1].column).toBe(0);
      expect(tokens[2].line).toBe(1);
      expect(tokens[2].column).toBe(1);
    });

    it("should choose longest match when multiple rules match", () => {
      lexer.addRule("IF", /if/).addRule("IDENTIFIER", /[a-z]+/);

      const tokens = lexer.tokenize("ifx");

      expect(tokens).toHaveLength(1);
      expect(tokens[0].tokenType).toBe("IDENTIFIER");
      expect(tokens[0].lexeme).toBe("ifx");
    });
  });

  describe("best", () => {
    it("should prefer longer token", () => {
      const token1 = new Token("SHORT", "ab", 0, 2, 1, 1);
      const token2 = new Token("LONG", "abc", 0, 3, 1, 1);

      const result = lexer["best"](token1, token2);
      expect(result).toBe(token2);
    });

    it("should keep first token when lengths are equal", () => {
      const token1 = new Token("FIRST", "abc", 0, 3, 1, 1);
      const token2 = new Token("SECOND", "xyz", 0, 3, 1, 1);

      const result = lexer["best"](token1, token2);
      expect(result).toBe(token1);
    });
  });

  describe("accept", () => {
    it("should add token and advance position", () => {
      const token = new Token("TEST", "hello", 0, 5, 1, 1);

      lexer["accept"](token);

      expect(lexer["tokens"]).toContain(token);
      expect(lexer.start).toBe(5);
    });

    it("should update column when on same line", () => {
      const token = new Token("TEST", "hello", 0, 5, 0, 0);

      lexer["accept"](token);

      expect(lexer.column).toBe(5);
    });
  });

  describe("integration tests", () => {
    it("should tokenize complex expression", () => {
      lexer
        .addRule("NUMBER", /\d+(\.\d+)?/, (lexeme) => parseFloat(lexeme))
        .addRule("IDENTIFIER", /[a-zA-Z_][a-zA-Z0-9_]*/)
        .addRule("PLUS", /\+/)
        .addRule("MINUS", /-/)
        .addRule("MULTIPLY", /\*/)
        .addRule("DIVIDE", /\//)
        .addRule("LPAREN", /\(/)
        .addRule("RPAREN", /\)/)
        .addRule("EQUALS", /=/)
        .addRule("WHITESPACE", /\s+/);

      const input = "result = (price + tax) * 1.08";
      const tokens = lexer.tokenize(input, "WHITESPACE");

      expect(tokens).toHaveLength(9);
      expect(tokens.map((t) => t.tokenType)).toEqual([
        "IDENTIFIER",
        "EQUALS",
        "LPAREN",
        "IDENTIFIER",
        "PLUS",
        "IDENTIFIER",
        "RPAREN",
        "MULTIPLY",
        "NUMBER",
      ]);
      expect(tokens[8].value).toBe(1.08);
    });

    it("should handle multiline input with proper line tracking", () => {
      lexer
        .addRule("IDENTIFIER", /[a-z]+/)
        .addRule("NEWLINE", /\n/)
        .addRule("SPACE", / /);

      const input = "hello\nworld test";
      const tokens = lexer.tokenize(input);

      expect(tokens[0]).toMatchObject({ lexeme: "hello", line: 0, column: 5 });
      expect(tokens[1]).toMatchObject({ lexeme: "\n", line: 1, column: 0 });
      expect(tokens[2]).toMatchObject({ lexeme: "world", line: 1, column: 5 });
      expect(tokens[3]).toMatchObject({ lexeme: " ", line: 1, column: 6 });
      expect(tokens[4]).toMatchObject({ lexeme: "test", line: 1, column: 10 });
    });

    it("should handle edge case with only newlines", () => {
      lexer.addRule("NEWLINE", /\n/);

      const tokens = lexer.tokenize("\n\n\n");

      expect(tokens).toHaveLength(3);
      tokens.forEach((token) => {
        expect(token.tokenType).toBe("NEWLINE");
      });
    });
  });
});
