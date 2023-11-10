import { assert, assertEquals, assertStringIncludes } from "$dev_deps";
import GameResults from "../src/GameResults.ts";
import Parser from "../src/Parser.ts";

const pgn1 = Deno.readTextFileSync("sample-PGNs/game1.pgn");
const pgn2 = Deno.readTextFileSync("sample-PGNs/game2.pgn");
const pgn3 = Deno.readTextFileSync("sample-PGNs/game3.pgn");
const pgn4 = Deno.readTextFileSync("sample-PGNs/game4.pgn");

Deno.test("parse headers", () => {
  const parser = new Parser(pgn1);
  const { headers, moveTextResult } = parser;
  assertEquals(headers.Event, "CCRL 40/4");
  assertEquals(headers.Result, GameResults.DRAW);
  assertEquals(moveTextResult, headers.Result);
});

Deno.test("parse comments", () => {
  const parser = new Parser(pgn2);
  assert(parser.mainLine.comment?.startsWith("WhiteEngineOptions: Protocol=uci;"));
  assertEquals(parser.mainLine.moveNodes.at(-1)?.comment, "d=1, sd=1, pd=Qg5, mt=46, tl=134690, s=21, n=1, pv=Qxg5#, tb=0, h=0.0, ph=51.3, wv=M1, R50=50, Rd=-11, Rr=-1000, mb=-1+0+1+1+1, White mates");
});

Deno.test("PGN text", () => {
  const parser = new Parser(pgn3);
  const text = parser.getPGNText();
  assertStringIncludes(text, `1.e4 d5 2.exd5 Qxd5 3.Nc3 Qd8 4.Bc4 Nf6 5.Nf3 Bg4 6.h3 Bxf3 7.Qxf3 e6 8.Qxb7 Nbd7 9.Nb5 Rc8 10.Nxa7 Nb6 11.Nxc8 Nxc8 12.d4 Nd6 13.Bb5+ Nxb5 14.Qxb5+ Nd7 15.d5 exd5 16.Be3 Bd6 17.Rd1 Qf6 18.Rxd5 Qg6 19.Bf4 Bxf4 20.Qxd7+ Kf8 21.Qd8# 1-0`);
});

Deno.test("game 4", async () => {
  const parser = new Parser(pgn4);
  await Deno.writeTextFile("sample-PGNs/game4.test.pgn", parser.getPGNText());
});