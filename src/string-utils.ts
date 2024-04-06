import GameResults from "$src/GameResults.js";
import type { GameResult } from "$src/typings/types.js";

export const EOF = "\0";

export function isDigit(ch: string) {
  return ch === "0"
    || ch === "1"
    || ch === "2"
    || ch === "3"
    || ch === "4"
    || ch === "5"
    || ch === "6"
    || ch === "7"
    || ch === "8"
    || ch === "9";
}

export function isNumeric(str: string) {
  for (const ch of str)
    if (!isDigit(ch))
      return false;

  return true;
}

export function isWhiteSpace(ch: string) {
  return ch === " "
    || ch === "\n"
    || ch === "\t"
    || ch === "\r"
    || ch === "\f"
    || ch === "\v"
    || ch === "\u00a0"
    || ch === "\u1680"
    || ch === "\u2000"
    || ch === "\u200a"
    || ch === "\u2028"
    || ch === "\u2029"
    || ch === "\u202f"
    || ch === "\u205f"
    || ch === "\u3000"
    || ch === "\ufeff";
}

export function isBracket(ch: string) {
  return ch === "("
    || ch === ")"
    || ch === "["
    || ch === "]"
    || ch === "{"
    || ch === "}";
}

export function isNotReservedPunctuationOrWhitespace(ch: string) {
  return ch !== "."
    && ch !== "$"
    && !isBracket(ch)
    && !isWhiteSpace(ch);
}

export function isGameResult(arg: string): arg is GameResult {
  return arg === GameResults.NONE
    || arg === GameResults.DRAW
    || arg === GameResults.WHITE_WIN
    || arg === GameResults.BLACK_WIN;
}

export function isPieceInitial(ch: string) {
  return ch === "N"
    || ch === "B"
    || ch === "R"
    || ch === "Q"
    || ch === "K";
}

export function isFile(ch: string) {
  return ch === "a"
    || ch === "b"
    || ch === "c"
    || ch === "d"
    || ch === "e"
    || ch === "f"
    || ch === "g"
    || ch === "h";
}

export function isRank(ch: string) {
  return ch === "1"
    || ch === "2"
    || ch === "3"
    || ch === "4"
    || ch === "5"
    || ch === "6"
    || ch === "7"
    || ch === "8";
}