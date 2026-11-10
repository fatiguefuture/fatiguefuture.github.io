import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const LINE_PATTERN =
  /^(\d{2})\.(\d{2})\.(\d{4})\s+(.+?)\s*$/;
const URL_SUFFIX_PATTERN = /^(.*)\s+\|\s+(https?:\/\/\S+)\s*$/;

const isValidDate = (year, month, day) => {
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const toIsoDate = (year, month, day) =>
  `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const splitLabelAndUrl = (rest) => {
  const match = rest.match(URL_SUFFIX_PATTERN);
  if (!match) {
    return { label: rest.trim() };
  }

  return {
    label: match[1].trim(),
    url: match[2],
  };
};

export const parseGigs = (text) => {
  const gigs = [];

  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const match = line.match(LINE_PATTERN);
    if (!match) {
      continue;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    if (!isValidDate(year, month, day)) {
      continue;
    }

    const { label, url } = splitLabelAndUrl(match[4]);
    if (!label) {
      continue;
    }

    const gig = {
      date: toIsoDate(year, month, day),
      label,
    };
    if (url) {
      gig.url = url;
    }
    gigs.push(gig);
  }

  return gigs.sort((a, b) => a.date.localeCompare(b.date));
};

const readStdin = async () => {
  const chunks = [];
  for await (const chunk of stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const main = async () => {
  const inputPath = process.argv[2];
  const text = inputPath
    ? readFileSync(inputPath, "utf8")
    : await readStdin();

  const payload = {
    updatedAt: new Date().toISOString(),
    gigs: parseGigs(text),
  };

  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
};

const entryPath = process.argv[1] ? resolve(process.argv[1]) : "";
const isCli = entryPath && import.meta.url === pathToFileURL(entryPath).href;

if (isCli) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
