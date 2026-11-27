import { describe, expect, it } from "vitest";
import { linkLabel, orderedLinks } from "./affiliates";
import type { ActivityLink } from "./schema";

const official: ActivityLink = { label: "Official tickets", url: "https://example.com/official", kind: "official" };
const klook: ActivityLink = { label: "Klook", url: "https://example.com/klook", kind: "affiliate", partner: "klook" };
const gyg: ActivityLink = { label: "GetYourGuide", url: "https://example.com/gyg", kind: "affiliate", partner: "getyourguide" };

describe("orderedLinks", () => {
  it("puts affiliate links first and keeps each link's original index", () => {
    expect(orderedLinks([official, klook, gyg])).toEqual([
      { link: klook, index: 1 },
      { link: gyg, index: 2 },
      { link: official, index: 0 },
    ]);
  });

  it("falls back to the official link when there is no affiliate", () => {
    expect(orderedLinks([official])).toEqual([{ link: official, index: 0 }]);
  });
});

describe("linkLabel", () => {
  it("labels affiliate links as a booking action", () => {
    expect(linkLabel(klook)).toBe("Book on Klook");
    expect(linkLabel(official)).toBe("Official tickets");
  });
});
