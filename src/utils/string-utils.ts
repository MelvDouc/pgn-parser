import GameResults from "$src/constants/GameResults.js";
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

const numericRegex = /^\d+$/;

export function isNumeric(str: string) {
  return numericRegex.test(str);
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