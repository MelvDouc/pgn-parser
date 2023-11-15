# PGNify

A lightning fast [PGN](https://en.wikipedia.org/wiki/Portable_Game_Notation) parser.

## Usage

```typescript
import { PGNParser, GameResults, type PGNify } from "pgnify";

const PGN = `
  [Result "1-0"]

  1.e4 e5 2.Qh5 Nc6 3.Bc4 Nf6 $4 4.Qxf7# 1-0
`;
const parser = new PGNParser(PGN);
console.log(parser);
```

## Types

### PGNParser

- `PGNParser.prototype.headers` - Get the PGN's headers as an object.
- `PGNParser.prototype.mainLine` - Get the PGN's main `Variation` instance.
- `PGNParser.prototype.result` - Get result found at the end of the move string.

- `PGNParser.prototype.getNormalizedPGN()` - Get normalized PGN output.

### Variation

- `Variation.prototype.comment?` - An optional comment found before the variation.
- `Variation.prototype.nodes` - An array of `MoveNodes` following the input text's order.

### MoveNode

- `MoveNode.notation` - The node's half-move notation such as "e4" or "0-0-0#".
- `MoveNode.moveNumber` - number
- `MoveNode.isWhiteMove` - boolean
- `MoveNode.NAG?` - A [numeric annotation glyph](https://en.wikipedia.org/wiki/Numeric_Annotation_Glyphs).
- `MoveNode.comment?` - A comment found after the half-move.
- `MoveNode.variations?` - An array of `Variation` instances that correspond to the alternatives to the current node.

### GameResults

An enum-like object of the commonly accepted game results.

## Benchmarks

| benchmark | time (avg) |  (min ... max) | p75 | p99 | p995 |
| ----- | :-----: | :-----: | :-----: | :-----: | :----- |
| Parse 820-ply game | 588.9 µs/iter | (505.2 µs … 2.63 ms) | 574.3 µs | 1.49 ms | 1.52 ms |
