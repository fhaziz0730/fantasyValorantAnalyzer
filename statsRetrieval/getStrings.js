export async function getRawPlayerStrings(page) {
  //retrieve player information (except team)
  let playerElements = await page.$$("tr.group");
  let rawPlayerStrings = [];
  for (let element of playerElements) {
    rawPlayerStrings.push(await page.evaluate((el) => el.innerText, element));
  }
  return rawPlayerStrings;
}
export async function getRawTeamStrings(page) {
  //retrieve team names for each player
  let teamElements = await page.$$("div.flex.justify-center");
  let rawTeamStrings = [];
  for (let element of teamElements) {
    rawTeamStrings.push(await page.evaluate((el) => el.title, element));
  }
  return rawTeamStrings;
}
export async function getHistoricalLogStrings(page, numPlayers) {
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
export async function getOpponentTeamStrings(page, numPlayers) {
  let rawOpponentTeamStrings = [];
  for (let i = 1; i < numPlayers + 1; i++) {
    await page.waitForSelector(`tr.group:nth-child(${i})`);
    await page.click(`tr.group:nth-child(${i})`);
    let rawOpponentTeamString = [];
    for (let i = 2; i < 5; i++) {
      await page.waitForSelector(`div.group:nth-child(${i})`);
      let rawOpponentTeamElement = await page.$(
        `div.group:nth-child(${i}) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > img:nth-child(1)`,
      );
      rawOpponentTeamString.push(
        await page.evaluate((el) => el.alt, rawOpponentTeamElement),
      );
      rawOpponentTeamElement = await page.$(
        `div.group:nth-child(${i}) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > img:nth-child(1)`,
      );
      rawOpponentTeamString.push(
        await page.evaluate((el) => el.alt, rawOpponentTeamElement),
      );
    }
    rawOpponentTeamStrings.push(rawOpponentTeamString);
    await page.click("button.absolute");
  }
  return rawOpponentTeamStrings;
}
