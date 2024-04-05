import { isPieceInitial, isFile, isRank } from "$src/string-utils.js";

const files: Readonly<Record<string, number>> = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7
};

const ranks: Readonly<Record<string, number>> = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 4,
  "6": 5,
  "7": 6,
  "8": 7
};

export function getMove(notation: string): Move {
  if (isPieceInitial(notation[0]))
    return getPieceMove(notation.replace("x", ""));

  if (isFile(notation[0]))
    return getPawnMove(notation);

  if (notation[0] === "0" || notation[0] === "O")
    return getCastlingMove(notation);

  return {
    type: "unknown",
    notation
  };
}

function getPieceMove(notation: string): PieceMove {
  const pieceInitial = notation[0];

  // Q5e4
  if (isRank(notation[1]))
    return {
      type: "piece-move",
      pieceInitial,
      srcY: ranks[notation[1]],
      destX: files[notation[2]],
      destY: ranks[notation[3]]
    };

  const srcOrDestX = files[notation[1]];

  // Qde4
  if (isFile(notation[2]))
    return {
      type: "piece-move",
      pieceInitial,
      srcX: srcOrDestX,
      destX: files[notation[2]],
      destY: ranks[notation[3]]
    };

  // Qd5e4
  if (isFile(notation[3]))
    return {
      type: "piece-move",
      pieceInitial,
      srcX: srcOrDestX,
      srcY: ranks[notation[2]],
      destX: files[notation[3]],
      destY: ranks[notation[4]]
    };

  // Qe4
  return {
    type: "piece-move",
    pieceInitial,
    destX: srcOrDestX,
    destY: ranks[notation[2]]
  };
}

function getPawnMove(notation: string) {
  const isCapture = notation[1] === "x";
  const offset = isCapture ? 2 : 0;
  const move: PawnMove = {
    type: "pawn-move",
    srcX: files[notation[0]],
    destX: files[notation[offset]],
    destY: ranks[notation[1 + offset]]
  };

  if (notation[2 + offset] === "=")
    move.promotionInitial = notation[3 + offset];

  return move;
}

function getCastlingMove(notation: string): CastlingMove {
  return {
    type: "castling",
    isQueenSide: notation[4] === notation[0]
  };
}

// ===== ===== ===== ===== =====
// TYPES
// ===== ===== ===== ===== =====

interface PieceMove {
  type: "piece-move";
  pieceInitial: string;
  srcX?: number;
  srcY?: number;
  destX: number;
  destY: number;
}

interface PawnMove {
  type: "pawn-move";
  srcX: number;
  destX: number;
  destY: number;
  promotionInitial?: string;
}

interface CastlingMove {
  type: "castling";
  isQueenSide: boolean;
}

interface UnknownMove {
  type: "unknown";
  notation: string;
}

export type Move = PieceMove | PawnMove | CastlingMove | UnknownMove;