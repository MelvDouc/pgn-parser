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

function isPieceInitial(ch: string) {
  return ch === "N"
    || ch === "B"
    || ch === "R"
    || ch === "Q"
    || ch === "K";
}

function isFile(ch: string) {
  return ch === "a"
    || ch === "b"
    || ch === "c"
    || ch === "d"
    || ch === "e"
    || ch === "f"
    || ch === "g"
    || ch === "h";
}

function isRank(ch: string) {
  return ch === "1"
    || ch === "2"
    || ch === "3"
    || ch === "4"
    || ch === "5"
    || ch === "6"
    || ch === "7"
    || ch === "8";
}

function getPieceMove(notation: string): PieceMove {
  const pieceInitial = notation[0];

  // Q5e4
  if (isRank(notation[1]))
    return {
      type: "piece-move",
      pieceInitial,
      srcRank: notation[1],
      destNotation: notation[2] + notation[3]
    };

  const srcOrDestFile = notation[1];

  // Qde4
  if (isFile(notation[2]))
    return {
      type: "piece-move",
      pieceInitial,
      srcFile: srcOrDestFile,
      destNotation: notation[2] + notation[3]
    };

  // Qd5e4
  if (isFile(notation[3]))
    return {
      type: "piece-move",
      pieceInitial,
      srcFile: srcOrDestFile,
      srcRank: notation[2],
      destNotation: notation[3] + notation[4]
    };

  // Qe4
  return {
    type: "piece-move",
    pieceInitial,
    destNotation: srcOrDestFile + notation[2]
  };
}

function getPawnMove(notation: string) {
  const isCapture = notation[1] === "x";
  const offset = isCapture ? 2 : 0;
  const move: PawnMove = {
    type: "pawn-move",
    srcFile: notation[0],
    destNotation: notation[offset] + notation[1 + offset]
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
  srcFile?: string;
  srcRank?: string;
  destNotation: string;
}

interface PawnMove {
  type: "pawn-move";
  srcFile: string;
  destNotation: string;
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