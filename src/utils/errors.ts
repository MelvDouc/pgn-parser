import TokenKind from "$src/constants/TokenKind.js";
import type { Token } from "$src/typings/types.js";

export class UnexpectedTokenError<T extends object> extends SyntaxError {
  declare public cause?: object;

  public constructor(token: Token, details = {} as T) {
    super("Unexpected token.");
    this.cause = {
      tokenKind: TokenKind[token.kind],
      value: token.value,
      index: token.index,
      ...details
    };
  }
}