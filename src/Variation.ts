import type { GameResult, MoveNode } from "$src/typings/types.js";

export default class Variation {
  private static stringifyMoveNode({ notation, moveNumber, isWhiteMove, comment, NAG }: MoveNode, isVarStartOrAfterVar: boolean) {
    if (NAG)
      notation += ` ${NAG}`;

    if (comment)
      notation += ` { ${comment} }`;

    if (isWhiteMove)
      return `${moveNumber}.${notation}`;

    if (isVarStartOrAfterVar)
      return `${moveNumber}...${notation}`;

    return notation;
  }

  public readonly nodes: MoveNode[] = [];
  public comment?: string;
  public result?: GameResult;

  public get lastNode() {
    return this.nodes[this.nodes.length - 1];
  }

  public addVariation(tokenIndex: number) {
    if (this.nodes.length === 0)
      throw new SyntaxError(`A variation cannot start with a nested variation at index ${tokenIndex}.`);

    const node = this.nodes[this.nodes.length - 1];
    const variation = new Variation();
    node.variations ??= [];
    node.variations.push(variation);
    return variation;
  }

  public toString() {
    return this._toMoveText(0);
  }

  protected _toMoveText(depth: number): string {
    const leadingSpaces = "  ".repeat(depth);

    const moveString = this.nodes.reduce((acc, node, i, arr) => {
      let moveText = Variation.stringifyMoveNode(node, i === 0 || arr[i - 1].variations !== undefined);

      if (node.variations) {
        moveText += "\n";
        node.variations.forEach((variation) => {
          moveText += `${leadingSpaces + "  "}( ${variation._toMoveText(depth + 1)} )\n`;
        });
        moveText += leadingSpaces;
      } else if (i < arr.length - 1) {
        moveText += " ";
      }

      return acc + moveText;
    }, "");

    if (this.comment) {
      const separator = depth === 0 ? "\n" : " ";
      return `{ ${this.comment} }${separator + moveString}`;
    }

    return moveString;
  }
}