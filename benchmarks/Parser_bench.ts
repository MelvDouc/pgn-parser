import Parser from "$src/Parser.ts";
import { bench, run } from "mitata";
import p from "../sample-PGNs/game1.pgn";

// const pgn = await Bun.file("sample-PGNs/game1.pgn").text();

bench("Parse long game.", () => {
  const parser = new Parser(p);
  parser.mainLine;
});

await run();