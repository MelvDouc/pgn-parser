import pgn1 from "$sample-PGNs/game1.pgn";
import pgn2 from "$sample-PGNs/game2.pgn";
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

test("parse annotated PGN", async () => {
  const operaGamePGN = await fetchPGN("https://www.chessgames.com/nodejs/game/viewGamePGN?text=1&gid=1233404");
  const parser = new Parser(operaGamePGN);
  expect(parser.mainLine.nodes[5].comment).toBe("This is a weak move\nalready.--Fischer");
});

test("normalized PGN", async () => {
  const oldestGamePGN = await fetchPGN("https://www.chessgames.com/nodejs/game/viewGamePGN?text=1&gid=1259987");
  const parser = new Parser(oldestGamePGN);
  const normalized = parser.getNormalizedPGN();
  expect(normalized).toInclude(`1.e4 { This may be the oldest recorded game of chess. } d5 2.exd5 Qxd5 3.Nc3 Qd8 4.Bc4 Nf6 5.Nf3 Bg4 6.h3 Bxf3 7.Qxf3 e6 8.Qxb7 Nbd7 9.Nb5 Rc8 10.Nxa7 Nb6 11.Nxc8 Nxc8`);
});

test("split PGNs", async () => {
  const PGNs = Parser.splitPGNs(morphyGames);
  expect(PGNs).toHaveLength(193);
});

test("parse many", async () => {
  const PGNs = Parser.splitPGNs(morphyGames);
  for (const [index, PGN] of PGNs.entries()) {
    try {
      new Parser(PGN);
    } catch (error) {
      if (error instanceof Error) {
        console.log({
          index,
          PGN,
          cause: error.cause
        });
      }
      expect(false).toBeTrue();
      break;
    }
  }
});


const morphyGames = await Bun.file("sample-PGNs/Morphy-games.pgn").text();

async function fetchPGN(url: string) {
  const response = await fetch(url);
  return response.text();
}