const GameResults = {
  NONE: "*",
  DRAW: "1/2-1/2",
  WHITE_WIN: "1-0",
  BLACK_WIN: "0-1",
  DOUBLE_WIN: "1-1",
  DOUBLE_LOSS: "0-0"
} as const;

export default GameResults;