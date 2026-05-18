import puppeteer from "puppeteer";

function transformRawStringsToPlayers(
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

async function getRawPlayerStrings(page) {
  //retrieve player information (except team)
  let playerElements = await page.$$("tr.group");
  let rawPlayerStrings = [];
  for (let element of playerElements) {
    rawPlayerStrings.push(await page.evaluate((el) => el.innerText, element));
  }
  return rawPlayerStrings;
}
async function getRawTeamStrings(page) {
  //retrieve team names for each player
  let teamElements = await page.$$("div.flex.justify-center");
  let rawTeamStrings = [];
  for (let element of teamElements) {
    rawTeamStrings.push(await page.evaluate((el) => el.title, element));
  }
  return rawTeamStrings;
}
async function getHistoricalLogStrings(page, numPlayers) {
  let rawHistoricalLogStrings = [];
  for (let i = 1; i < numPlayers + 1; i++) {
    await page.waitForSelector(`tr.group:nth-child(${i})`);
    await page.click(`tr.group:nth-child(${i})`);
    await page.waitForSelector(
      `table.w-full:nth-child(2) > tbody:nth-child(2)`,
    );
    let rawHistoricalLogElement = await page.$(
      `table.w-full:nth-child(2) > tbody:nth-child(2)`,
    );
    rawHistoricalLogStrings.push(
      await page.evaluate((el) => el.innerText, rawHistoricalLogElement),
    );
    await page.click("button.absolute");
  }
  return rawHistoricalLogStrings;
}
async function main() {
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
  //transform the raw strings into an array of player objects
  let players = transformRawStringsToPlayers(
    rawPlayerStrings,
    rawTeamStrings,
    rawHistoricalLogStrings,
  );
  console.log(players[0]);
  console.log(players.length);
  await browser.close();
}

await main();
