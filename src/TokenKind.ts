enum TokenKind {
  EndOfFile,
  Bad,
  Whitespace,
  OpeningParenthesis,
  ClosingParenthesis,
  Points,
  Header,
  MoveNumber,
  Notation,
  NumericAnnotationGlyph,
  Comment,
  GameResult
}

export default TokenKind;