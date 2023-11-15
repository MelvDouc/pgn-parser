import GameResults from "$src/GameResults";
import Lexer from "$src/Lexer";
import TokenKind from "$src/TokenKind";
import Variation from "$src/Variation";
import { GameResult, MoveNode, PGNHeaders, Token } from "$src/typings/types";

export default class Parser {
  readonly headers: PGNHeaders;
  readonly mainLine: Variation;
  readonly result: GameResult;
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
    this.mainLine = this.parseCurrentLine();
    this.result = this.parseResult();
  }

  private get current() {
    return this.tokens[this.index];
  }

  getNormalizedPGN() {
    const headers = Object.entries(this.headers)
      .map(([key, value]) => `[${key} "${value}"]`)
      .join("\n");

    return `${headers}\n\n${this.mainLine.toString()} ${this.result}`;
  }

  private parseHeaders() {
    const headers: PGNHeaders = {};
    const headerRegex = /\[(?<key>\w+)\s+"(?<value>[^"]*)"\]/;
    let token = this.current;

    while (token.kind === TokenKind.Header) {
      const matchArr = token.value.match(headerRegex);

      if (!matchArr)
        throw new Error(`Invalid header «${token.value}» (${token.row}:${token.col}).`);

      const { key, value } = matchArr.groups!;
      headers[key] = value;
      this.advance();
      token = this.current;
    }

    return headers;
  }

  private parseCurrentLine() {
    const line = new Variation();
    let token: Token;

    do {
      token = this.current;
      this.advance();

      switch (token.kind) {
        case TokenKind.OpeningParenthesis:
          this.handleVarStart(line, token);
          break;
        case TokenKind.ClosingParenthesis:
          return line;
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
          if (this.index !== this.tokens.length - 1)
            throw new Error(`Unexpected game result «${token.value}» (${token.row}:${token.col}).`);
          break;
        case TokenKind.Header:
        case TokenKind.Points:
        case TokenKind.Bad:
          throw new Error(`Unexpected token: «${token.value}» (${token.row}:${token.col}).`);
      }
    } while (token.kind !== TokenKind.EndOfFile);

    return line;
  }

  private parseResult() {
    const resultToken = this.tokens.at(-2);

    if (!resultToken || resultToken.kind !== TokenKind.GameResult)
      return GameResults.NONE;

    return resultToken.value as GameResult;
  }

  private handleVarStart(line: Variation, { row, col }: Token) {
    if (line.nodes.length === 0)
      throw new Error(`A variation cannot start with a nested variation (${row}:${col}).`);

    const moveNode = line.nodes.at(-1) as MoveNode;
    moveNode.variations ??= [];
    moveNode.variations.push(this.parseCurrentLine());
  }

  private handleMoveNumber(line: Variation, token: Token) {
    this.assertKind(0, TokenKind.Points);
    const isWhiteMove = this.current.value.length === 1;
    this.assertKind(1, TokenKind.Notation);
    line.nodes.push({
      moveNumber: +token.value,
      notation: this.peek(1).value,
      isWhiteMove
    });
    this.advance(2);
  }

  private handleNotation(line: Variation, token: Token) {
    const prevNode = line.nodes.at(-1);
    line.nodes.push({
      moveNumber: prevNode?.moveNumber ?? 1,
      notation: token.value,
      isWhiteMove: prevNode ? !prevNode.isWhiteMove : true
    });
  }

  private handleComment(line: Variation, token: Token) {
    if (line.nodes.length === 0) {
      line.comment = token.value;
      return;
    }

    const moveNode = line.nodes.at(-1) as MoveNode;
    moveNode.comment = token.value;
  }

  private handleNAG(line: Variation, token: Token) {
    const moveNode = line.nodes.at(-1);

    if (moveNode)
      moveNode.NAG = token.value;
  }

  private advance(inc = 1) {
    this.index += inc;
  }

  private peek(offset: number) {
    const position = this.index + offset;
    return this.tokens[position] ?? this.tokens.at(-1) as Token;
  }

  private assertKind(offset: number, expectedKind: TokenKind) {
    const { kind, row, col } = this.peek(offset);

    if (kind !== expectedKind)
      throw new Error(`Unexpected ${TokenKind[kind]} (${row}:${col}); expected ${TokenKind[expectedKind]}.`);
  }
}