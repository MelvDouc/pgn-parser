import GameResults from "$src/GameResults.ts";
import TokenKind from "$src/TokenKind.ts";
import Variation from "$src/Variation.ts";

// ===== ===== ===== ===== =====
// HEADERS
// ===== ===== ===== ===== =====

interface BaseHeaders {
  White: string;
  Black: string;
  Site: string;
  Event: string;
  /** Should be in the format `YYYY.MM.DD`. */
  Date: string;
  Result: GameResult;
  EventDate: string;
  Round: string;
  TimeControl: string;
  FEN: string;
  ECO: string;
  Opening: string;
  Variation: string;
  PlyCount: string;
  SetUp: string;
  Termination: string;
  WhiteElo: string;
  BlackElo: string;
  BlackTitle: string;
  WhiteTitle: string;
}

export type PGNHeaders = Partial<BaseHeaders> & {
  [key: string]: string;
};

// ===== ===== ===== ===== =====
// SPECIAL
// ===== ===== ===== ===== =====

export type GameResult = typeof GameResults[keyof typeof GameResults];

// ===== ===== ===== ===== =====
// NODES
// ===== ===== ===== ===== =====

export type { TokenKind, Variation };

export interface Token {
  readonly kind: TokenKind;
  readonly value: string;
  readonly index: number;
}

export interface MoveNode {
  notation: string;
  moveNumber: number;
  isWhiteMove: boolean;
  NAG?: string;
  comment?: string;
  variations?: Variation[];
};