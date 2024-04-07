enum TokenKind {
  EndOfFile,
  Bad,
  Whitespace,
  OpeningParenthesis,
  ClosingParenthesis,
  Points,
  MoveNumber,
  Notation,
  NumericAnnotationGlyph,
  Comment,
  GameResult
}

export default TokenKind;