import type { PGNHeaders } from "$src/typings/types.js";

const resultRegex = /(\*|1\/2-1\/2|[01]-[01])\s*$/;

export function* splitPGNs(input: string) {
  const lines = input.split(/\r?\n/);
  let PGN = "";

  for (const line of lines) {
    PGN += line;

    if (resultRegex.test(line)) {
      yield PGN;
      PGN = "";
      continue;
    }

    PGN += " ";
  }
}

export function stringifyHeaders(headers: PGNHeaders) {
  return Object.entries(headers)
    .map(([key, value]) => `[${key} "${value}"]`)
    .join("\n");
}