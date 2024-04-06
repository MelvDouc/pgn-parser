
import { parse, splitPGNs } from "$src/index.js";
import { readFile } from "fs/promises";
import { bench, run } from "mitata";

const pgn1 = await readFile("sample-PGNs/game1.pgn", "utf-8");
const morphyGames = await readFile("sample-PGNs/Morphy-games.pgn", "utf-8");

bench("Parse long game.", () => {
  parse(pgn1).mainLine;
});

bench("Parse 193 games", () => {
  for (const PGN of splitPGNs(morphyGames))
    parse(PGN);
});

await run();