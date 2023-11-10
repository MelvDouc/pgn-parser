import Parser from "../src/Parser.ts";

const pgn = Deno.readTextFileSync("sample-PGNs/game1.pgn");

Deno.bench("Parse long game.", () => {
  const parser = new Parser(pgn);
  parser.mainLine;
});