import puppeteer from "puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto("https://www.valorantfantasyleague.net/playerstats");

console.log("Page URL:", page.url());
await page.waitForSelector(
  "tr.group:nth-child(2) > td:nth-child(1) > div:nth-child(2) > span:nth-child(2)",
);
let playerElements = await page.$$("tr.group");
let rawPlayerStrings = [];
for (let element of playerElements) {
  rawPlayerStrings.push(await page.evaluate((el) => el.innerText, element));
}
console.log(rawPlayerStrings);
let players = [];
let teamElements = await page.$$("div.flex.justify-center");
let rawTeamStrings = [];
for (let element of teamElements) {
  rawTeamStrings.push(await page.evaluate((el) => el.title, element));
}
console.log(rawTeamStrings);
let i = 0;
for (let rawPlayerString of rawPlayerStrings) {
  let name = rawPlayerString.slice(0, rawPlayerString.indexOf("\n\t\n\t\n"));
  let restOfString = rawPlayerString.slice(
    rawPlayerString.indexOf("\n\t\n\t\n") + 5,
  );
  let role = restOfString.slice(0, 1);
  let restRestOfString = restOfString.slice(restOfString.indexOf("\n\t") + 2);
  let values = restRestOfString.split("\t");
  players.push({
    name: name,
    role: role,
    price: values[0],
    gw_pts: values[1],
    tot_pts: values[2],
    ppg: values[3],
    team: rawTeamStrings[i],
  });
  i = i + 2;
}
console.log(players[0]);
console.log(players.length);
await browser.close();
