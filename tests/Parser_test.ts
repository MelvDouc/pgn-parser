import { PGNParser, GameResults } from "$src/index.js";
import Variation from "$src/Variation.js";
import { expect } from "chai";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const pgn1 = await readFile("sample-PGNs/game1.pgn", "utf-8");
const pgn2 = await readFile("sample-PGNs/game2.pgn", "utf-8");
const pgn3 = await readFile("sample-PGNs/game3.pgn", "utf-8");
const pgn4 = await readFile("sample-PGNs/game4.pgn", "utf-8");
const pgn5 = await readFile("sample-PGNs/game5.pgn", "utf-8");
const morphyGames = await readFile("sample-PGNs/Morphy-games.pgn", "utf-8");


describe("Parser", () => {
  it("should handle headers", () => {
    try {
      const parser = new PGNParser(pgn1);
      const { headers, result } = parser;
      expect(headers.Event).to.equal("CCRL 40/4");
      expect(headers.Result).to.equal(GameResults.DRAW);
      expect(result).to.equal(headers.Result);
    } catch (error) {
      console.log({ error });
    }
  });

  it("should handle comments", () => {
    const movesStart = "d=1, sd=1, pd=Qg5, mt=46, tl=134690, s=21, n=1, pv=Qxg5#, tb=0, h=0.0, ph=51.3, wv=M1, R50=50, Rd=-11, Rr=-1000, mb=-1+0+1+1+1, White mates";
    const parser = new PGNParser(pgn2);
    const { mainLine } = parser;
    expect((mainLine.comment ?? "").startsWith("WhiteEngineOptions: Protocol=uci;")).to.be.true;
    expect((mainLine.lastNode?.comment ?? "").startsWith(movesStart)).to.be.true;
  });

  it("should handle variations", () => {
    const parser = new PGNParser(pgn4);
    const firstVar = parser.mainLine.nodes[2]?.variations?.at(0);
    const lastMoveNode = parser.mainLine.nodes.at(-1);

    expect(firstVar).to.be.instanceOf(Variation);
    expect(firstVar?.nodes[0].moveNumber).to.equal(2);
    expect(firstVar?.nodes[0].notation).to.equal("Nf3");
    expect(lastMoveNode?.moveNumber).to.equal(7);
    expect(lastMoveNode?.notation).to.equal("Nxd5");
    expect(lastMoveNode?.isWhiteMove).not.to.be.true;
  });

  it("should handle an annotated PGN", async () => {
    const parser = new PGNParser(pgn5);
    expect(parser.mainLine.nodes[5].comment).to.equal("This is a weak move\nalready.--Fischer");
  });

  it("should be able to produce a normalized output", async () => {
    const parser = new PGNParser(pgn3);
    const normalized = parser.getNormalizedPGN();
    expect(normalized).to.contain(`1.e4 { This may be the oldest recorded game of chess. } d5 2.exd5 Qxd5 3.Nc3 Qd8 4.Bc4 Nf6 5.Nf3 Bg4 6.h3 Bxf3 7.Qxf3 e6 8.Qxb7 Nbd7 9.Nb5 Rc8 10.Nxa7 Nb6 11.Nxc8 Nxc8`);
  });
});

describe("Multi-PGN mode", () => {
  it("splitting", async () => {
    const PGNs = PGNParser.splitPGNs(morphyGames);
    expect(PGNs).to.have.length(193);
  });

  it("parsing", async () => {
    const PGNs = PGNParser.splitPGNs(morphyGames);
    for (const [index, PGN] of PGNs.entries()) {
      try {
        new PGNParser(PGN);
      } catch (error) {
        console.log({ index, error });
        expect(false).to.be.true;
        break;
      }
    }
  });
});