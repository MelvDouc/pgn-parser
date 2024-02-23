import { expect } from "chai";
import { describe, it } from "node:test";
import { getMoveDetail } from "$src/move-detail.js";

describe("piece move", () => {
  it("Qe4", () => {
    const detail = getMoveDetail("Qe4");
    if (detail.type === "piece-move") {
      expect(detail.pieceInitial).to.equal("Q");
      expect(detail.srcRank).to.be.undefined;
      expect(detail.srcFile).to.be.undefined;
      expect(detail.destSquare).to.equal("e4");
      return;
    }
    expect(false).to.be.true;
  });

  it("Rxa1+", () => {
    const detail = getMoveDetail("Rxa1+");
    if (detail.type === "piece-move") {
      expect(detail.pieceInitial).to.equal("R");
      expect(detail.srcRank).to.be.undefined;
      expect(detail.srcFile).to.be.undefined;
      expect(detail.destSquare).to.equal("a1");
      return;
    }
    expect(false).to.be.true;
  });

  it("N1d3", () => {
    const detail = getMoveDetail("N1d3");
    if (detail.type === "piece-move") {
      expect(detail.pieceInitial).to.equal("N");
      expect(detail.srcRank).to.equal("1");
      expect(detail.srcFile).to.be.undefined;
      expect(detail.destSquare).to.equal("d3");
      return;
    }
    expect(false).to.be.true;
  });

  it("B8xb2", () => {
    const detail = getMoveDetail("B8xb2");
    if (detail.type === "piece-move") {
      expect(detail.pieceInitial).to.equal("B");
      expect(detail.srcRank).to.equal("8");
      expect(detail.srcFile).to.be.undefined;
      expect(detail.destSquare).to.equal("b2");
      return;
    }
    expect(false).to.be.true;
  });

  it("Rad1#", () => {
    const detail = getMoveDetail("Rad1#");
    if (detail.type === "piece-move") {
      expect(detail.pieceInitial).to.equal("R");
      expect(detail.srcRank).to.be.undefined;
      expect(detail.srcFile).to.equal("a");
      expect(detail.destSquare).to.equal("d1");
      return;
    }
    expect(false).to.be.true;
  });

  it("Raxd1", () => {
    const detail = getMoveDetail("Raxd1");
    if (detail.type === "piece-move") {
      expect(detail.pieceInitial).to.equal("R");
      expect(detail.srcRank).to.be.undefined;
      expect(detail.srcFile).to.equal("a");
      expect(detail.destSquare).to.equal("d1");
      return;
    }
    expect(false).to.be.true;
  });
});

describe("pawn move", () => {
  it("e4", () => {
    const detail = getMoveDetail("e4");
    if (detail.type === "pawn-move") {
      expect(detail.srcFile).to.equal("e");
      expect(detail.destSquare).to.equal("e4");
      expect(detail.promotionInitial).to.be.undefined;
      return;
    }
    expect(false).to.be.true;
  });

  it("axb1=R+", () => {
    const detail = getMoveDetail("axb1=R+");
    if (detail.type === "pawn-move") {
      expect(detail.srcFile).to.equal("a");
      expect(detail.destSquare).to.equal("b1");
      expect(detail.promotionInitial).to.equal("R");
      return;
    }
    expect(false).to.be.true;
  });
});

describe("castling", () => {
  const detail1 = getMoveDetail("0-0-0");
  const detail2 = getMoveDetail("O-O");
  if (detail1.type === "castling" && detail2.type === "castling") {
    expect(detail1.isQueenSide).to.be.true;
    expect(detail2.isQueenSide).to.be.false;
    return;
  }
  expect(false).to.be.true;
});