import GameResults from "../GameResults.ts";
import Line from "../Line.ts";

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

export type NumericAnnotationGlyph = `$${string}`;
export type GameResult = typeof GameResults[keyof typeof GameResults];

// ===== ===== ===== ===== =====
// NODES
// ===== ===== ===== ===== =====

export interface MoveNode {
  notation: string;
  moveNumber: number;
  isWhiteMove: boolean;
  NAG?: NumericAnnotationGlyph;
  comment?: string;
  variations?: Line[];
};

export interface HeaderToken {
  kind: "header";
  value: string;
};

export interface MoveNumberToken {
  kind: "move-number";
  value: number;
  isWhite: boolean;
};

export interface CommentToken {
  kind: "comment";
  value: string;
};

export interface NotationToken {
  kind: "notation";
  value: string;
}

export interface NAGToken {
  kind: "NAG";
  value: NumericAnnotationGlyph;
}

export interface ResultToken {
  kind: "result";
  value: GameResult;
}

export type PGNToken =
  | {
    kind: "end-of-input" | "whitespace" | "opening-parenthesis" | "closing-parenthesis";
  }
  | ResultToken
  | NAGToken
  | CommentToken
  | HeaderToken
  | MoveNumberToken
  | NotationToken;