import puppeteer from "puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto("https://www.valorantfantasyleague.net/playerstats");

console.log("Page URL:", page.url());
await page.waitForSelector(
  "tr.group:nth-child(2) > td:nth-child(1) > div:nth-child(2) > span:nth-child(2)",
);
let playerElements = await page.$$("tr.group");
let players = [];
for (let element of playerElements) {
  players.push(await page.evaluate((el) => el.innerText, element));
}
console.log(players);

await browser.close();
