import assert from "assert";
import puppeteer from "puppeteer";
import { describe, it } from "node:test";
import {
  getHistoricalLogStrings,
  getOpponentTeamStrings,
  getRawPlayerStrings,
  getRawTeamStrings,
} from "./getStrings.js";

describe("Raw String Retrieval", () => {
  it("gets players strings", async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //go to stats page and wait for table to load up
    await page.goto("https://www.valorantfantasyleague.net/playerstats", {
      waitUntil: "networkidle0",
    });
    let rawPlayerStrings = await getRawPlayerStrings(page);
    assert.strictEqual(
      rawPlayerStrings[0],
      "LAKIA\n\t\n\t\nINITIATOR\n\t5.5\t0\t27\t5.4",
    );
    assert.strictEqual(rawPlayerStrings.length, 180);
    await browser.close();
  });

  it("get team strings", async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //go to stats page and wait for table to load up
    await page.goto("https://www.valorantfantasyleague.net/playerstats", {
      waitUntil: "networkidle0",
    });
    let rawTeamStrings = await getRawTeamStrings(page);
    assert.strictEqual(rawTeamStrings[0], "Gen.G");
    assert.strictEqual(rawTeamStrings.length, 360);
    await browser.close();
  });

  it("get historcal log strings", { skip: true }, async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //go to stats page and wait for table to load up
    await page.goto("https://www.valorantfantasyleague.net/playerstats", {
      waitUntil: "networkidle0",
    });
    let rawHistoricalLogStrings = await getHistoricalLogStrings(page, 180);
    assert.strictEqual(
      rawHistoricalLogStrings[0],
      "01\t3\t0\t0\t3\n02\t3\t3\t0\t6\n03\t2\t-1\t0\t1\n04\t7\t3\t0\t10\n05\t6\t1\t0\t7",
    );
    assert.strictEqual(rawHistoricalLogStrings.length, 180);
    await browser.close();
  });

  it("get opponent team strings", async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //go to stats page and wait for table to load up
    await page.goto("https://www.valorantfantasyleague.net/playerstats", {
      waitUntil: "networkidle0",
    });
    let rawOpponentTeamStrings = await getOpponentTeamStrings(page, 180);
    assert.strictEqual(
      rawOpponentTeamStrings[0],
      "01\t3\t0\t0\t3\n02\t3\t3\t0\t6\n03\t2\t-1\t0\t1\n04\t7\t3\t0\t10\n05\t6\t1\t0\t7",
    );
    assert.strictEqual(rawOpponentTeamStrings.length, 180);
    await browser.close();
  });
});
