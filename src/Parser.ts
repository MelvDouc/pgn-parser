import Lexer from "$src/Lexer.js";
import Variation from "$src/Variation.js";
import GameResults from "$src/constants/GameResults.js";
import TokenKind from "$src/constants/TokenKind.js";
import type { GameResult, PGNHeaders, Token } from "$src/typings/types.js";
import { UnexpectedTokenError } from "$src/utils/errors.js";

export default class Parser {
  public static splitPGNs(input: string): string[] {
    const resultRegex = /(\*|1\/2-1\/2|[01]-[01])\s*$/;
    const lines = input.split(/\r?\n/);
    let PGN = "";
    const result: string[] = [];

    for (const line of lines) {
      PGN += line;

      if (resultRegex.test(line)) {
        result.push(PGN);
        PGN = "";
        continue;
      }

      PGN += " ";
    }

    return result;
  }

  public static stringifyHeaders(headers: PGNHeaders) {
    return Object.entries(headers)
      .map(([key, value]) => `[${key} "${value}"]`)
      .join("\n");
  }

  public readonly headers: PGNHeaders;
  public readonly mainLine: Variation;
  public readonly result: GameResult;
  private index = 0;
  private readonly tokens: Token[] = [];

  constructor(pgn: string) {
    const lexer = new Lexer(pgn);
    let token: Token;

    do {
      token = lexer.lex();
      if (token.kind !== TokenKind.Whitespace)
        this.tokens.push(token);
    } while (token.kind !== TokenKind.EndOfFile);

    this.headers = this.parseHeaders();
    this.mainLine = this.parseMoves();
    this.result = this.mainLine.result ?? GameResults.NONE;
  }

  private get current() {
    return this.peek(0);
  }

  public getNormalizedPGN() {
    const headers = Parser.stringifyHeaders(this.headers);
    return `${headers}\n\n${this.mainLine.toString()} ${this.result}`;
  }

  private parseHeaders() {
    const headers: PGNHeaders = {};
    const headerRegex = /\[(?<key>\w+)\s+"(?<value>[^"]*)"\]/;
    let token = this.current;

    while (token.kind === TokenKind.Header) {
      const matchArr = token.value.match(headerRegex);

      if (!matchArr)
        throw new UnexpectedTokenError(token);

      const { key, value } = matchArr.groups!;
      headers[key] = value;
      this.advance();
      token = this.current;
    }

    return headers;
  }

  private parseMoves() {
    const stack: Variation[] = [];
    let line = new Variation();
    let token: Token;

    do {
      token = this.current;
      this.advance();

      switch (token.kind) {
        case TokenKind.MoveNumber:
          this.handleMoveNumber(line, token);
          break;
        case TokenKind.Notation:
          this.handleNotation(line, token);
          break;
        case TokenKind.NumericAnnotationGlyph:
          this.handleNAG(line, token);
          break;
        case TokenKind.Comment:
          this.handleComment(line, token);
          break;
        case TokenKind.GameResult:
          if (stack.length > 0)
            throw new UnexpectedTokenError(token);
          line.result = token.value as GameResult;
          break;
        case TokenKind.OpeningParenthesis:
          stack.push(line);
          line = line.addVariation(token.index);
          break;
        case TokenKind.ClosingParenthesis:
          const parentLine = stack.pop();
          if (!parentLine)
            throw new UnexpectedTokenError(token);
          line = parentLine;
          break;
        case TokenKind.Header:
        case TokenKind.Points:
        case TokenKind.Bad:
          throw new UnexpectedTokenError(token);
      }
    } while (token.kind !== TokenKind.EndOfFile);

    if (stack.length > 0)
      throw new SyntaxError(`Unfinished variation at index ${token.index}.`);

    return line;
  }

  private peek(offset: number) {
    return this.tokens[this.index + offset] ?? this.tokens[this.tokens.length - 1];
  }

  private handleMoveNumber(line: Variation, token: Token) {
    this.assertKind(0, TokenKind.Points);
    const isWhiteMove = this.current.value === ".";
    this.assertKind(1, TokenKind.Notation);
    line.nodes.push({
      moveNumber: +token.value,
      notation: this.peek(1).value,
      isWhiteMove
    });
    this.advance(2);
  }

  private handleNotation(line: Variation, token: Token): void {
    const prevNode = line.lastNode;
    line.nodes.push({
      moveNumber: prevNode?.moveNumber ?? 1,
      notation: token.value,
      isWhiteMove: prevNode ? !prevNode.isWhiteMove : true
    });
  }

  private handleComment(line: Variation, token: Token): void {
    const moveNode = line.lastNode;

    if (!moveNode) {
      line.comment = token.value;
      return;
    }

    moveNode.comment = token.value;
  }

  private handleNAG(line: Variation, token: Token): void {
    const moveNode = line.lastNode;

    if (moveNode)
      moveNode.NAG = token.value;
  }

  private advance(inc = 1): void {
    this.index += inc;
  }

  private assertKind(offset: number, expectedKind: TokenKind) {
    const token = this.peek(offset);

    if (token.kind !== expectedKind) {
      const error = new UnexpectedTokenError(token, {
        expected: TokenKind[expectedKind]
      });
      throw error;
    }
  }
}