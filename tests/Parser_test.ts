import pgn1 from "$sample-PGNs/game1.pgn";
import pgn2 from "$sample-PGNs/game2.pgn";
import pgn3 from "$sample-PGNs/game3.pgn";
import pgn4 from "$sample-PGNs/game4.pgn";
import GameResults from "$src/GameResults";
import Parser from "$src/Parser";
import Variation from "$src/Variation";
import { GameResult } from "$src/typings/types";
import { expect, test } from "bun:test";

test("parse headers", () => {
  const parser = new Parser(pgn1);
  const { headers, result } = parser;
  expect(headers.Event).toBe("CCRL 40/4");
  expect(headers.Result).toBe(GameResults.DRAW);
  expect(result).toBe(headers.Result as GameResult);
});

test("parse comments", () => {
  const parser = new Parser(pgn2);
  const { mainLine } = parser;
  expect(mainLine.comment ?? "").toStartWith("WhiteEngineOptions: Protocol=uci;");
  expect(mainLine.nodes.at(-1)?.comment ?? "").toStartWith("d=1, sd=1, pd=Qg5, mt=46, tl=134690, s=21, n=1, pv=Qxg5#, tb=0, h=0.0, ph=51.3, wv=M1, R50=50, Rd=-11, Rr=-1000, mb=-1+0+1+1+1, White mates");
});

test("parse variations", () => {
  const parser = new Parser(pgn4);
  const firstVar = parser.mainLine.nodes[2]?.variations?.at(0);
  const lastMoveNode = parser.mainLine.nodes.at(-1);

  expect(firstVar).toBeInstanceOf(Variation);
  expect(firstVar?.nodes[0].moveNumber).toBe(2);
  expect(firstVar?.nodes[0].notation).toBe("Nf3");
  expect(lastMoveNode?.moveNumber).toBe(7);
  expect(lastMoveNode?.notation).toBe("Nxd5");
  expect(lastMoveNode?.isWhiteMove).toBeFalse();
});

test("PGN text", () => {
  const parser = new Parser(pgn3);
  const text = parser.getNormalizedPGN();
  expect(text).toInclude(`1.e4 d5 2.exd5 Qxd5 3.Nc3 Qd8 4.Bc4 Nf6 5.Nf3 Bg4 6.h3 Bxf3 7.Qxf3 e6 8.Qxb7 Nbd7 9.Nb5 Rc8 10.Nxa7 Nb6 11.Nxc8 Nxc8 12.d4 Nd6 13.Bb5+ Nxb5 14.Qxb5+ Nd7 15.d5 exd5 16.Be3 Bd6 17.Rd1 Qf6 18.Rxd5 Qg6 19.Bf4 Bxf4 20.Qxd7+ Kf8 21.Qd8# 1-0`);
});