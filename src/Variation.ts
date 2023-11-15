import { MoveNode } from "$src/typings/types";

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

  public comment?: string;
  public readonly nodes: MoveNode[] = [];

  public toString() {
    return this.toMoveText(0);
  }

  protected toMoveText(depth: number) {
    const leadingSpaces = "  ".repeat(depth);

    const moveString = this.nodes.reduce((acc, node, i, arr) => {
      let moveText = Variation.stringifyMoveNode(node, i === 0 || arr[i - 1].variations !== undefined);

      if (node.variations) {
        moveText += "\n";
        node.variations.forEach((variation) => {
          moveText += `${leadingSpaces + "  "}( ${variation.toMoveText(depth + 1)} )\n`;
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