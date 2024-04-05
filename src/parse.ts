import GameResults from "$src/GameResults.js";
import Lexer from "$src/Lexer.js";
import TokenKind from "$src/TokenKind.js";
import { UnexpectedTokenError } from "$src/errors.js";
import { getMove } from "$src/move.js";
import type { GameResult, PGNHeaders, Token, Variation } from "$src/typings/types.js";

export default function parse(pgn: string) {
  const tokens = getTokens(pgn);
  const { headers, nextTokens } = parseHeaders(tokens);
  const { mainLine, result } = parseMoves(nextTokens);
  return {
    headers,
    mainLine,
    result: result ?? headers.Result ?? GameResults.NONE
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
  let variation: Variation = [];
  let token: Token;
  let result: GameResult | null = null;
  let commentBefore = "";

  for (let i = 0; i < tokens.length; i++) {
    token = tokens[i];

    switch (token.kind) {
      case TokenKind.MoveNumber: {
        handleMoveNumber(variation, token, getToken(tokens, ++i), getToken(tokens, ++i));
        if (commentBefore) {
          variation[variation.length - 1].commentBefore = commentBefore;
          commentBefore = "";
        }
        break;
      }
      case TokenKind.Notation: {
        handleNotation(variation, token);
        break;
      }
      case TokenKind.NumericAnnotationGlyph: {
        handleNAG(variation, token);
        break;
      }
      case TokenKind.Comment: {
        variation.length === 0
          ? (commentBefore = token.value)
          : (variation[variation.length - 1].commentAfter = token.value);
        break;
      }
      case TokenKind.GameResult: {
        if (stack.length > 0)
          throw new UnexpectedTokenError(token);
        result = token.value as GameResult;
        break;
      }
      case TokenKind.OpeningParenthesis: {
        const lastNode = variation.at(-1);
        if (!lastNode)
          throw new UnexpectedTokenError(token);
        stack.push(variation);
        variation = [];
        lastNode.variations ??= [];
        lastNode.variations.push(variation);
        break;
      }
      case TokenKind.ClosingParenthesis: {
        const parentVar = stack.pop();
        if (!parentVar)
          throw new UnexpectedTokenError(token);
        variation = parentVar;
        break;
      }
      case TokenKind.Header:
      case TokenKind.Points:
      case TokenKind.Bad: {
        throw new UnexpectedTokenError(token);
      }
    }
  }

  if (stack.length > 0)
    throw new SyntaxError(`Unfinished variation at index ${token!.index}.`);

  return {
    mainLine: variation,
    result
  };
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

function handleMoveNumber(variation: Variation, token: Token, pointsToken: Token, notationToken: Token) {
  assertKind(pointsToken, TokenKind.Points);
  assertKind(notationToken, TokenKind.Notation);
  variation.push({
    moveNumber: +token.value,
    move: getMove(notationToken.value),
    isWhiteMove: pointsToken.value === "."
  });
}

function handleNotation(variation: Variation, token: Token) {
  const prevNode = variation.at(-1);
  variation.push({
    moveNumber: prevNode?.moveNumber ?? 1,
    move: getMove(token.value),
    isWhiteMove: prevNode ? !prevNode.isWhiteMove : true
  });
}

function handleNAG(variation: Variation, token: Token) {
  const moveNode = variation.at(-1);

  if (moveNode)
    moveNode.NAG = token.value;
}