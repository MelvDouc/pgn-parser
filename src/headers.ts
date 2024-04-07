import type { PGNHeaders } from "$src/typings/types.js";

const headerRegex = /^\[(?<key>\w+)\s+"(?<value>[^"]*)"\]/;

export function parseHeaders(pgn: string) {
  const headers: PGNHeaders = {};
  pgn = pgn.trim();
  let matchArr = pgn.match(headerRegex);

  while (matchArr) {
    const { key, value } = matchArr.groups as { [key: string]: string; };
    headers[key] = value;
    pgn = pgn.slice(matchArr[0].length).trimStart();
    matchArr = pgn.match(headerRegex);
  }

  return {
    headers,
    moveString: pgn
  };
}

export function stringifyHeaders(headers: PGNHeaders) {
  return Object.entries(headers)
    .map(([key, value]) => `[${key} "${value}"]`)
    .join("\n");
}