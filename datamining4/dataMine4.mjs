import fetch from "node-fetch";
import { writeFile, readFile, writeFileSync } from "fs";

let url =
  "https://uselectionatlas.org/RESULTS/datagraph.php?year=2018&fips=27&f=1&off=3&elect=0&class=2";

fetch(url)
  .then((res) => res.text())
  .then((text) => {
    text = replaceInBetweenAll(text, "<script>", "</script>", "");
    text = replaceInBetweenAll(text, "<", ">", "");
    console.log(text);
});

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