import Lexer from "$src/Lexer.js";
import Variation from "$src/Variation.js";
import TokenKind from "$src/constants/TokenKind.js";
import type { GameResult, PGNHeaders, Token } from "$src/typings/types.js";
import { UnexpectedTokenError } from "$src/utils/errors.js";

export default function parse(pgn: string) {
  const tokens = getTokens(pgn);
  const { headers, nextTokens } = parseHeaders(tokens);
  const mainLine = parseMoves(nextTokens);
  return {
    headers,
    mainLine,
    result: mainLine.result
  };
}

export function parseHeaders(tokens: Token[]) {
  const headers: PGNHeaders = {};
  const headerRegex = /\[(?<key>\w+)\s+"(?<value>[^"]*)"\]/;
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.kind !== TokenKind.Header)
      break;

    const matchArr = token.value.match(headerRegex);

    if (!matchArr)
      throw new UnexpectedTokenError(token);

    const { key, value } = matchArr.groups!;
    headers[key] = value;
    i++;
  }

  return {
    nextTokens: tokens.slice(i),
    headers
  };
}

export function parseMoves(tokens: Token[]) {
  const stack: Variation[] = [];
  let line = new Variation();
  let token: Token;

  for (let i = 0; i < tokens.length; i++) {
    token = tokens[i];

    switch (token.kind) {
      case TokenKind.MoveNumber:
        handleMoveNumber(line, token, getToken(tokens, ++i), getToken(tokens, ++i));
        break;
      case TokenKind.Notation:
        handleNotation(line, token);
        break;
      case TokenKind.NumericAnnotationGlyph:
        handleNAG(line, token);
        break;
      case TokenKind.Comment:
        handleComment(line, token);
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
  }

  if (stack.length > 0)
    throw new SyntaxError(`Unfinished variation at index ${token!.index}.`);

  return line;
}

export function getTokens(pgn: string) {
  const lexer = new Lexer(pgn);
  const tokens: Token[] = [];
  let token: Token;

  do {
    token = lexer.lex();
    if (token.kind !== TokenKind.Whitespace)
      tokens.push(token);
  } while (token.kind !== TokenKind.EndOfFile);

  return tokens;
}

function getToken(tokens: Token[], index: number) {
  return index >= tokens.length
    ? tokens[tokens.length - 1]
    : tokens[index];
}

function assertKind(token: Token, expectedKind: TokenKind) {
  if (token.kind !== expectedKind)
    throw new UnexpectedTokenError(token, {
      expected: TokenKind[expectedKind]
    });
}

function handleMoveNumber(line: Variation, token: Token, pointsToken: Token, notationToken: Token) {
  assertKind(pointsToken, TokenKind.Points);
  assertKind(notationToken, TokenKind.Notation);
  line.nodes.push({
    moveNumber: +token.value,
    notation: notationToken.value,
    isWhiteMove: pointsToken.value === "."
  });
}

function handleNotation(line: Variation, token: Token) {
  const prevNode = line.lastNode;
  line.nodes.push({
    moveNumber: prevNode?.moveNumber ?? 1,
    notation: token.value,
    isWhiteMove: prevNode ? !prevNode.isWhiteMove : true
  });
}

function handleComment(line: Variation, token: Token) {
  const moveNode = line.lastNode;

  if (!moveNode) {
    line.comment = token.value;
    return;
  }

  moveNode.comment = token.value;
}

function handleNAG(line: Variation, token: Token) {
  const moveNode = line.lastNode;

  if (moveNode)
    moveNode.NAG = token.value;
}