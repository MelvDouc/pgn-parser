export function getMoveDetail(notation: string): MoveDetail {
  if (isPieceInitial(notation[0]))
    return getPieceMoveDetail(notation.replace("x", ""));

  if (isFile(notation[0]))
    return getPawnMoveDetail(notation);

  if (notation[0] === "0" || notation[0] === "O")
    return getCastlingMoveDetail(notation);

  return {
    type: "unknown",
    notation
  };
}

function isPieceInitial(char: string) {
  return char === "N"
    || char === "B"
    || char === "R"
    || char === "Q"
    || char === "K";
}

function isFile(char: string) {
  return char === "a"
    || char === "b"
    || char === "c"
    || char === "d"
    || char === "e"
    || char === "f"
    || char === "g"
    || char === "h";
}

function isRank(char: string) {
  return char === "1"
    || char === "2"
    || char === "3"
    || char === "4"
    || char === "5"
    || char === "6"
    || char === "7"
    || char === "8";
}


function getPieceMoveDetail(notation: string): PieceMoveDetail {
  const pieceInitial = notation[0];

  // Q5e4
  if (isRank(notation[1]))
    return {
      type: "piece-move",
      pieceInitial,
      srcRank: notation[1],
      destSquare: notation[2] + notation[3],
    };

  const srcOrDestFile = notation[1];

  // Qde4
  if (isFile(notation[2]))
    return {
      type: "piece-move",
      pieceInitial,
      srcFile: srcOrDestFile,
      destSquare: notation[2] + notation[3]
    };

  // Qd5e4
  if (isFile(notation[3]))
    return {
      type: "piece-move",
      pieceInitial,
      srcFile: srcOrDestFile,
      srcRank: notation[2],
      destSquare: notation[3] + notation[4]
    };

  // Qe4
  return {
    type: "piece-move",
    pieceInitial,
    destSquare: srcOrDestFile + notation[2]
  };
}

function getPawnMoveDetail(notation: string) {
  const isCapture = notation[1] === "x";
  const promotionOffset = isCapture ? 2 : 0;
  const move: PawnMoveDetail = {
    type: "pawn-move",
    srcFile: notation[0],
    destSquare: isCapture ? (notation[2] + notation[3]) : notation
  };

  if (notation[2 + promotionOffset] === "=")
    move.promotionInitial = notation[3 + promotionOffset];

  return move;
}

function getCastlingMoveDetail(notation: string): CastlingMoveDetail {
  return {
    type: "castling",
    isQueenSide: notation[4] === notation[0]
  };
}

// ===== ===== ===== ===== =====
// TYPES
// ===== ===== ===== ===== =====

interface PieceMoveDetail {
  type: "piece-move";
  pieceInitial: string;
  srcFile?: string;
  srcRank?: string;
  destSquare: string;
}

interface PawnMoveDetail {
  type: "pawn-move";
  srcFile: string;
  destSquare: string;
  promotionInitial?: string;
}

interface CastlingMoveDetail {
  type: "castling";
  isQueenSide: boolean;
}

interface UnknownMoveDetail {
  type: "unknown";
  notation: string;
}

export type MoveDetail = PieceMoveDetail | PawnMoveDetail | CastlingMoveDetail | UnknownMoveDetail;