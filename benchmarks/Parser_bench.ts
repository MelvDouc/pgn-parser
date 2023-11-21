
import { PGNParser, type Variation } from "$src/index.js";
import { readFile } from "fs/promises";
import { bench, run } from "mitata";

const pgn1 = await readFile("sample-PGNs/game1.pgn", "utf-8");
let mainLine: Variation;

bench("Parse long game.", () => {
  const parser = new PGNParser(pgn1);
  mainLine = parser.mainLine;
});

await run();