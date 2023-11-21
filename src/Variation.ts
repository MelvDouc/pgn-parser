import { GameResult, IVariation, MoveNode } from "$src/typings/types.ts";

export default class Variation implements IVariation {
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

  public addVariation(tokenIndex: number): Variation {
    const node = this.nodes.at(-1);

    if (!node)
      throw new SyntaxError(`A variation cannot start with a nested variation at index ${tokenIndex}.`);

    const variation = new Variation();
    node.variations ??= [];
    node.variations.push(variation);
    return variation;
  }

  public toString(): string {
    return this._toMoveText(0);
  }

  protected _toMoveText(depth: number): string {
    const leadingSpaces = "  ".repeat(depth);

    const moveString = this.nodes.reduce((acc, node, i, arr) => {
      let moveText = Variation.stringifyMoveNode(node, i === 0 || arr[i - 1].variations !== undefined);

      if (node.variations) {
        moveText += "\n";
        node.variations.forEach((variation) => {
          moveText += `${leadingSpaces + "  "}( ${(variation as Variation)._toMoveText(depth + 1)} )\n`;
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