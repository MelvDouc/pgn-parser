import GameResults from "$src/constants/GameResults.ts";
import { GameResult } from "$src/typings/types.ts";

export const EOF = "\0";

export function isDigit(char: string): boolean {
  return char === "0"
    || char === "1"
    || char === "2"
    || char === "3"
    || char === "4"
    || char === "5"
    || char === "6"
    || char === "7"
    || char === "8"
    || char === "9";
}

export function isWhiteSpace(char: string): boolean {
  return char === " "
    || char === "\n"
    || char === "\t"
    || char === "\r"
    || char === "\f"
    || char === "\v"
    || char === "\u00a0"
    || char === "\u1680"
    || char === "\u2000"
    || char === "\u200a"
    || char === "\u2028"
    || char === "\u2029"
    || char === "\u202f"
    || char === "\u205f"
    || char === "\u3000"
    || char === "\ufeff";
}

export function isBracket(char: string): boolean {
  return char === "("
    || char === ")"
    || char === "["
    || char === "]"
    || char === "{"
    || char === "}";
}

export function isNotReservedPunctuationOrWhitespace(char: string): boolean {
  return char !== "."
    && char !== "$"
    && !isBracket(char)
    && !isWhiteSpace(char);
}

export function isGameResult(arg: string): arg is GameResult {
  return arg === GameResults.NONE
    || arg === GameResults.DRAW
    || arg === GameResults.WHITE_WIN
    || arg === GameResults.BLACK_WIN;
}