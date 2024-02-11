import type { PGNHeaders } from "$src/typings/types.js";

export function splitPGNs(input: string) {
  const resultRegex = /(\*|1\/2-1\/2|[01]-[01])\s*$/;
  const lines = input.split(/\r?\n/);
  let PGN = "";
  const result: string[] = [];

  for (const line of lines) {
    PGN += line;

    if (resultRegex.test(line)) {
      result.push(PGN);
      PGN = "";
      continue;
    }

    PGN += " ";
  }

  return result;
}

export function stringifyHeaders(headers: PGNHeaders) {
  return Object.entries(headers)
    .map(([key, value]) => `[${key} "${value}"]`)
    .join("\n");
}