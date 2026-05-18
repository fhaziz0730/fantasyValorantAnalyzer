import puppeteer from "puppeteer";

function transformRawStringsToPlayers(rawPlayerStrings, rawTeamStrings) {
  let players = [];
  let index = 0;
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
    players.push({
      name: name,
      role: role,
      price: values[0],
      gw_pts: values[1],
      tot_pts: values[2],
      ppg: values[3],
      team: rawTeamStrings[index],
    });
    index = index + 2;
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

async function main() {
  //open a headless chrome browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  //go to stats page and wait for table to load up
  await page.goto("https://www.valorantfantasyleague.net/playerstats");
  console.log("Page URL:", page.url());
  await page.waitForSelector(
    "tr.group:nth-child(2) > td:nth-child(1) > div:nth-child(2) > span:nth-child(2)",
  );

  //get the raw player and team strings from the page
  let rawPlayerStrings = await getRawPlayerStrings(page);
  let rawTeamStrings = await getRawTeamStrings(page);

  //transform the raw strings into an array of player objects
  let players = transformRawStringsToPlayers(rawPlayerStrings, rawTeamStrings);
  console.log(players[0]);
  console.log(players.length);
  await browser.close();
}

await main();
