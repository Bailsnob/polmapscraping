scrape("https://en.wikipedia.org/wiki/1932_United_States_presidential_election_in_New_York")
  .then((text) => console.log(text))

async function scrape(url) {
  let result;
  await fetch(url)
    .then((res) => res.text())
    .then((text) => {
      const headerIndex = text.indexOf(
        `<table class="wikitable" style="font-size: 95%;">`
      );
      //need to add restriction for if html unfound
      text = text.substring(headerIndex);
      const startIndex = text.indexOf("<tbody");
      const endIndex = text.indexOf("</tbody>") + 8;
      result = text.substring(startIndex, endIndex);
      result = replaceInBetweenAll(replaceInBetweenAll, "<", ">", "");
    });
  return result;
}

function replaceInBetweenAll(str, startStr, endStr, replacement) {
  let result = str;
  while (result.includes(startStr)) {
    result = result.replace(
      result.substring(
        result.indexOf(startStr),
        result.indexOf(endStr) + endStr.length
      ),
      replacement
    );
  }
  return result;
}