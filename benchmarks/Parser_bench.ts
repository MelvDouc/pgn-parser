import pgn from "$sample-PGNs/game1.pgn";
import Parser from "$src/Parser";
import { Variation } from "$src/typings/types";
import { bench, run } from "mitata";

let mainLine: Variation;

bench("Parse long game.", () => {
  const parser = new Parser(pgn);
  mainLine = parser.mainLine;
});

await run();