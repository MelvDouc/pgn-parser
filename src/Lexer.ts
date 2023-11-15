import TokenKind from "$src/TokenKind";
import {
  EOF,
  isDigit,
  isGameResult,
  isNotReservedPunctuationOrWhitespace,
  isWhiteSpace
} from "$src/string-utils";
import { Token } from "$src/typings/types";

export default class Lexer {
  private row = 0;
  private col = 0;
  private readonly lines: string[];

  public constructor(input: string) {
    this.lines = input.split(/\r?\n/);
  }

  private get currentChar(): string {
    if (this.row >= this.lines.length)
      return EOF;

    if (this.col >= this.lines[this.row].length) {
      this.row++;
      this.col = 0;
      return this.currentChar;
    }

    return this.lines[this.row][this.col];
  }

  public lex(): Token {
    switch (this.currentChar) {
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
    this.col++;
  }

  private getEndOfFileToken() {
    return {
      kind: TokenKind.EndOfFile,
      value: EOF,
      row: this.row,
      col: this.col
    };
  }

  private getParenToken(kind: TokenKind.OpeningParenthesis | TokenKind.ClosingParenthesis) {
    const { row, col } = this;
    this.advance(); // skip paren
    return {
      kind,
      value: "",
      row,
      col
    };
  }

  private scanWhile(predicate: (char: string, substring: string) => boolean) {
    let substring = "";

    for (
      let char = this.currentChar;
      char !== EOF && predicate(char, substring);
      char = this.currentChar
    ) {
      substring += char;
      this.advance();
    }

    return substring;
  }

  private scanHeader() {
    const { row, col } = this;
    const header = this.scanWhile((_, substring) => substring.at(-1) !== "]");
    return {
      kind: TokenKind.Header,
      value: header,
      row,
      col
    };
  }

  private scanComment() {
    const { row, col } = this;
    this.advance(); // skip '{'
    const comment = this.scanWhile((char) => char !== "}");
    this.advance(); // skip '}'
    return {
      kind: TokenKind.Comment,
      value: comment.trim(),
      row,
      col
    };
  }

  private scanPoints() {
    const { row, col } = this;
    const points = this.scanWhile((char) => char === ".");
    return {
      kind: TokenKind.Points,
      value: points,
      row,
      col
    };
  }

  private scanNAG() {
    const { row, col } = this;
    this.advance(); // skip '$'
    const value = "$" + this.scanWhile(isDigit);
    const kind = value.length === 0
      ? TokenKind.Bad
      : TokenKind.NumericAnnotationGlyph;

    return { kind, value, row, col };
  }

  private scanOther() {
    const { row, col } = this;

    if (isWhiteSpace(this.currentChar)) {
      this.scanWhile(isWhiteSpace);
      return {
        kind: TokenKind.Whitespace,
        value: "",
        row,
        col
      };
    }

    const value = this.scanWhile(isNotReservedPunctuationOrWhitespace);
    const kind = /^\d+$/.test(value)
      ? TokenKind.MoveNumber
      : isGameResult(value)
        ? TokenKind.GameResult
        : TokenKind.Notation;

    return { kind, value, row, col };
  }
}