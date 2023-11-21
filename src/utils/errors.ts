import TokenKind from "$src/constants/TokenKind.ts";
import { Token } from "$src/typings/types.ts";

export class UnexpectedTokenError<T extends object> extends SyntaxError {
  public constructor(token: Token, details = {} as T) {
    const cause = {
      tokenKind: TokenKind[token.kind],
      value: token.value,
      index: token.index,
      ...details
    };
    super("Unexpected token.", { cause });
  }
}