import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseGigs } from "./parse-gigs.mjs";

describe("parseGigs", () => {
  it("parses valid dated lines into sorted ISO gigs", () => {
    const text = `
Auftritte ab nov 2026:

31.10.2026 Kafe Kult München mit Alien Boy
18.12.2026 Gasteig München
29.08.2026 Cyclocamp Nürnberg mit Fuchsbau und Still Pissed
`;

    assert.deepEqual(parseGigs(text), [
      {
        date: "2026-08-29",
        label: "Cyclocamp Nürnberg mit Fuchsbau und Still Pissed",
      },
      {
        date: "2026-10-31",
        label: "Kafe Kult München mit Alien Boy",
      },
      {
        date: "2026-12-18",
        label: "Gasteig München",
      },
    ]);
  });

  it("ignores blank lines and hash comments", () => {
    const text = `
# Archiv
\t
18.12.2026 Gasteig München
`;

    assert.deepEqual(parseGigs(text), [
      { date: "2026-12-18", label: "Gasteig München" },
    ]);
  });

  it("drops invalid calendar dates", () => {
    const text = `
32.13.2026 Broken Gig
00.01.2026 Also Broken
18.12.2026 Gasteig München
`;

    assert.deepEqual(parseGigs(text), [
      { date: "2026-12-18", label: "Gasteig München" },
    ]);
  });

  it("extracts an optional trailing ticket url", () => {
    const text =
      "20.03.2027 Some Venue Berlin | https://example.com/tickets";

    assert.deepEqual(parseGigs(text), [
      {
        date: "2027-03-20",
        label: "Some Venue Berlin",
        url: "https://example.com/tickets",
      },
    ]);
  });

  it("rejects non-http trailing pipes as part of the label", () => {
    const text = "18.12.2026 Gasteig München | ohne link";

    assert.deepEqual(parseGigs(text), [
      { date: "2026-12-18", label: "Gasteig München | ohne link" },
    ]);
  });

  it("returns an empty list for empty input", () => {
    assert.deepEqual(parseGigs(""), []);
    assert.deepEqual(parseGigs("nur text ohne datum"), []);
  });
});
