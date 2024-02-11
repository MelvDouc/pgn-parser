
import { parse, type PGNify } from "$src/index.js";
import { readFile } from "fs/promises";
import { bench, run } from "mitata";

const pgn1 = await readFile("sample-PGNs/game1.pgn", "utf-8");
let mainLine: PGNify.Variation;

bench("Parse long game.", () => {
  mainLine = parse(pgn1).mainLine;
});

await run();