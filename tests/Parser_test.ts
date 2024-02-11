import { parse, GameResults, splitPGNs } from "$src/index.js";
import Variation from "$src/Variation.js";
import { expect } from "chai";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const pgn1 = await readFile("sample-PGNs/game1.pgn", "utf-8");
const pgn2 = await readFile("sample-PGNs/game2.pgn", "utf-8");
const pgn4 = await readFile("sample-PGNs/game4.pgn", "utf-8");
const pgn5 = await readFile("sample-PGNs/game5.pgn", "utf-8");
const morphyGames = await readFile("sample-PGNs/Morphy-games.pgn", "utf-8");


describe("Parser", () => {
  it("should handle headers", () => {
    try {
      const { headers, result } = parse(pgn1);
      expect(headers.Event).to.equal("CCRL 40/4");
      expect(headers.Result).to.equal(GameResults.DRAW);
      expect(result).to.equal(headers.Result);
    } catch (error) {
      console.log({ error });
    }
  });

  it("should handle comments", () => {
    const movesStart = "d=1, sd=1, pd=Qg5, mt=46, tl=134690, s=21, n=1, pv=Qxg5#, tb=0, h=0.0, ph=51.3, wv=M1, R50=50, Rd=-11, Rr=-1000, mb=-1+0+1+1+1, White mates";
    const { mainLine } = parse(pgn2);
    expect((mainLine.comment ?? "").startsWith("WhiteEngineOptions: Protocol=uci;")).to.be.true;
    expect((mainLine.lastNode?.comment ?? "").startsWith(movesStart)).to.be.true;
  });

  it("should handle variations", () => {
    const { mainLine } = parse(pgn4);
    const firstVar = mainLine.nodes[2]?.variations?.at(0);
    const lastMoveNode = mainLine.nodes.at(-1);

    expect(firstVar).to.be.instanceOf(Variation);
    expect(firstVar?.nodes[0].moveNumber).to.equal(2);
    expect(firstVar?.nodes[0].notation).to.equal("Nf3");
    expect(lastMoveNode?.moveNumber).to.equal(7);
    expect(lastMoveNode?.notation).to.equal("Nxd5");
    expect(lastMoveNode?.isWhiteMove).not.to.be.true;
  });

  it("should handle an annotated PGN", async () => {
    const { mainLine } = parse(pgn5);
    expect(mainLine.nodes[5].comment).to.equal("This is a weak move\nalready.--Fischer");
  });
});

describe("Multi-PGN mode", () => {
  it("splitting", async () => {
    const PGNs = splitPGNs(morphyGames);
    expect(PGNs).to.have.length(193);
  });

  it("parsing", async () => {
    const PGNs = splitPGNs(morphyGames);
    for (const [index, PGN] of PGNs.entries()) {
      try {
        parse(PGN);
      } catch (error) {
        console.log({ index, error });
        expect(false).to.be.true;
        break;
      }
    }
  });
});