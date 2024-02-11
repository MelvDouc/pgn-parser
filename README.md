# PGNify

A lightning fast [PGN](https://en.wikipedia.org/wiki/Portable_Game_Notation) parser.

## Usage

```typescript
import { parse, GameResults, type PGNify } from "pgnify";

const PGN = `
  [Result "1-0"]

  1.e4 e5 2.Qh5 Nc6 3.Bc4 Nf6 $4 4.Qxf7# 1-0
`;
const parseResult = parse(PGN);
console.log(parseResult);
```

## Benchmarks

| benchmark | time (avg) |  (min ... max) | p75 | p99 | p995 |
| ----- | :-----: | :-----: | :-----: | :-----: | :----- |
| Parse 820-ply game | 588.9 µs/iter | (505.2 µs … 2.63 ms) | 574.3 µs | 1.49 ms | 1.52 ms |
