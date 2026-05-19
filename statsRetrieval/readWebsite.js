import puppeteer from "puppeteer";
import fs from "fs";
import {
  getHistoricalLogStrings,
  getOpponentTeamStrings,
  getRawPlayerStrings,
  getRawTeamStrings,
} from "./getStrings.js";
export function transformRawStringsToPlayers(
  rawPlayerStrings,
  rawTeamStrings,
  rawHistoricalLogStrings,
) {
  let players = [];
  let index = 0;
  let index2 = 0;
  for (let rawPlayerString of rawPlayerStrings) {
    //get name from raw player string by slicing it out
    let name = rawPlayerString.slice(0, rawPlayerString.indexOf("\n\t\n\t\n"));
    //get the rest of the raw player string excluding player names
    let rawPlayerStringWithoutPlayerName = rawPlayerString.slice(
      rawPlayerString.indexOf("\n\t\n\t\n") + 5,
    );
    //get the role of the raw player
    let role = rawPlayerStringWithoutPlayerName.slice(0, 1);
    //get the rest of the raw player string excluding the role
    let rawPlayerStringOnlyStats = rawPlayerStringWithoutPlayerName.slice(
      rawPlayerStringWithoutPlayerName.indexOf("\n\t") + 2,
    );
    //get the individual stats from the rest of the raw string
    let values = rawPlayerStringOnlyStats.split("\t");
    let historicalLog = rawHistoricalLogStrings[index2]
      .split("\n")
      .map(function (ln) {
        return ln.split("\t");
      });
    historicalLog = historicalLog.slice(1, 4);
    historicalLog[0] = historicalLog[0].slice(1);
    historicalLog[1] = historicalLog[1].slice(1);
    historicalLog[2] = historicalLog[2].slice(1);
    for (let i = 0; i < historicalLog.length; i++) {
      for (let j = 0; j < historicalLog[0].length; j++) {
        historicalLog[i][j] = Number(historicalLog[i][j]);
      }
    }
    historicalLog.forEach(
      (log, index) =>
        (historicalLog[index] = {
          killPoints: log[0],
          mapPoints: log[1],
          bonusPoints: log[2],
          totalPoints: log[3],
        }),
    );
    players.push({
      name: name,
      role: role,
      price: Number(values[0]),
      gw_pts: Number(values[1]),
      tot_pts: Number(values[2]),
      ppg: Number(values[3]),
      team: rawTeamStrings[index],
      historicalLog: historicalLog,
    });
    index = index + 2;
    index2 = index2 + 1;
  }
  return players;
}

export async function main() {
  //open a headless chrome browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  //go to stats page and wait for table to load up
  await page.goto("https://www.valorantfantasyleague.net/playerstats", {
    waitUntil: "networkidle0",
  });
  console.log("Page URL:", page.url());

  //get the raw player and team strings from the page
  console.log("Getting players");
  let rawPlayerStrings = await getRawPlayerStrings(page);
  console.log("Getting teams");
  let rawTeamStrings = await getRawTeamStrings(page);
  console.log("Getting historical logs");
  let rawHistoricalLogStrings = await getHistoricalLogStrings(
    page,
    rawPlayerStrings.length,
  );
  console.log("Getting opponent teams");
  let rawOpponentTeamStrings = await getOpponentTeamStrings(
    page,
    rawPlayerStrings.length,
  );
  console.log(rawOpponentTeamStrings);
  await browser.close();
  //transform the raw strings into an array of player objects
  let players = transformRawStringsToPlayers(
    rawPlayerStrings,
    rawTeamStrings,
    rawHistoricalLogStrings,
  );
  console.log(players[0]);
  console.log(players.length);
  fs.writeFile(
    "myjsonfile.json",
    JSON.stringify(players), //change your variable name here instead of myObject (if needed)
    (err) => {
      if (err) throw err;
      console.log("complete");
    },
  );
}

await main();
