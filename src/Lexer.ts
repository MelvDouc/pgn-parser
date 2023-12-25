import TokenKind from "$src/constants/TokenKind.js";
import {
  EOF,
  isDigit,
  isGameResult,
  isNotReservedPunctuationOrWhitespace,
  isWhiteSpace
} from "$src/utils/string-utils.js";

export default class Lexer {
  private index = 0;
  private readonly input: string;

  public constructor(input: string) {
    this.input = input;
  }

  private get current(): string {
    if (this.index >= this.input.length)
      return EOF;

    return this.input[this.index];
  }

  public lex() {
    switch (this.current) {
      case EOF:
        return this.getEndOfFileToken();
      case "(":
        return this.getParenToken(TokenKind.OpeningParenthesis);
      case ")":
        return this.getParenToken(TokenKind.ClosingParenthesis);
      case "[":
        return this.scanHeader();
      case "{":
        return this.scanComment();
      case ".":
        return this.scanPoints();
      case "$":
        return this.scanNAG();
      default:
        return this.scanOther();
    }
  }

  private advance() {
    this.index++;
  }

  private getEndOfFileToken() {
    return {
      kind: TokenKind.EndOfFile,
      value: EOF,
      index: this.index
    };
  }

  private getParenToken(kind: TokenKind.OpeningParenthesis | TokenKind.ClosingParenthesis) {
    const { index } = this;
    this.advance(); // skip paren
    return {
      kind,
      value: "",
      index
    };
  }

  private scanWhile(predicate: (char: string, substring: string) => boolean): string {
    let substring = "";

    for (
      let char = this.current;
      char !== EOF && predicate(char, substring);
      char = this.current
    ) {
      substring += char;
      this.advance();
    }

    return substring;
  }

  private scanHeader() {
    const { index } = this;
    const header = this.scanWhile((_, substring) => substring[substring.length - 1] !== "]");
    return {
      kind: TokenKind.Header,
      value: header,
      index
    };
  }

  private scanComment() {
    const { index } = this;
    this.advance(); // skip '{'
    const comment = this.scanWhile((char, substring) => {
      return char !== "}" && substring[substring.length - 1] !== "\\";
    });
    this.advance(); // skip '}'
    return {
      kind: TokenKind.Comment,
      value: comment.trim(),
      index
    };
  }

  private scanPoints() {
    const { index } = this;
    const points = this.scanWhile((char) => char === ".");
    return {
      kind: TokenKind.Points,
      value: points,
      index
    };
  }

  private scanNAG() {
    const { index } = this;
    this.advance(); // skip '$'
    const digits = this.scanWhile(isDigit);
    const kind = digits.length === 0
      ? TokenKind.Bad
      : TokenKind.NumericAnnotationGlyph;

    return { kind, value: "$" + digits, index };
  }

  private scanOther() {
    const { index } = this;

    if (isWhiteSpace(this.current)) {
      this.scanWhile(isWhiteSpace);
      return {
        kind: TokenKind.Whitespace,
        value: "",
        index
      };
    }

    const value = this.scanWhile(isNotReservedPunctuationOrWhitespace);

    if (isGameResult(value))
      return {
        kind: TokenKind.GameResult,
        value,
        index
      };

    if (isDigit(this.current))
      return {
        kind: TokenKind.MoveNumber,
        value,
        index
      };

    return {
      kind: TokenKind.Notation,
      value,
      index
    };
  }
}