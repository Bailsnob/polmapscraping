import fetch from "node-fetch";
import { writeFile, readFile, writeFileSync } from "fs";
// import { match } from "assert";

let totals;

//TODO: test if page is valid so we don't have to hardcode
const states = [
  "Alabama",
  // // "Alaska",
  // "Arizona",
  // "Arkansas",
  // "California",
  // "Colorado",
  // "Connecticut", //problem
  // "Delaware", //problem
  // // "District Of Columbia",
  // "Florida", //ran but produced incorrect results
  // "Georgia",
  // // "Hawaii",
  // "Idaho",
  // "Illinois",
  // "Indiana",
  // "Iowa",
  // "Kansas",
  // "Kentucky",
  // "Louisiana", //problem
  // "Maine",
  // "Maryland",
  // "Massachusetts", //problem
  // "Michigan",
  // "Minnesota",
  // "Mississippi", //problem
  // "Missouri",
  // "Montana",
  // "Nebraska",
  // "Nevada",
  // "New Hampshire",
  // "New Jersey",
  // "New Mexico",
  // "New York",
  // "North Carolina",
  // "North Dakota",
  // "Ohio",
  // "Oklahoma",
  // "Oregon",
  // "Pennsylvania",
  // "Rhode Island", //problem
  // "South Carolina", //problem
  // "South Dakota",
  // "Tennessee",
  // "Texas",
  // "Utah",
  // "Vermont",
  // "Virginia", //problem
  // "Washington",
  // "West Virginia",
  // "Wisconsin",
  // "Wyoming",
];

let year = 1984;
// let state = "Alabama";

// // console.log(state);
// await getUrl(year, state)
//   .then((url) => scrape(url))
  // .then((url) => console.log(url))
  // .then((text) => removeTbodyTtable(text))
  // .then((text) => convertTr(text))
  // .then((text) => convertTh(text))
  // .then((text) => convertTd(text))
  // .then((text) => removeAref(text))
  // .then((text) => removeH2(text))
  // .then((text) => removeLineBreaks(text))
  // .then((text) => makeCommas(text))
  // .then((text) => makeLineBreaks(text))
  // .then((text) => fixFirstLine(text))
  // .then((text) => fixLastLine(text))
  // .then((text) => improveCsv(text))
  // .then((text) => saveAsCsv(text, year, state))
  // .then((text) => writeFileSync(`${state}-${year}2.csv`, text))
  // .catch((err) => console.error(err));

for (let state of states) {
  console.log(state); 
  await getUrl(year, state)
    .then((url) => scrape(url))
    .then((text) => removeTbodyTtable(text))
    .then((text) => convertTr(text))
    .then((text) => convertTh(text))
    .then((text) => convertTd(text))
    .then((text) => removeAref(text))
    .then((text) => removeH2(text))
    .then((text) => removeLineBreaks(text))
    .then((text) => makeCommas(text))
    .then((text) => makeLineBreaks(text))
    .then((text) => fixFirstLine(text))
    .then((text) => fixLastLine(text))
    .then((text) => improveCsv(text))
    .then((text) => saveAsCsv(text, year, state))
    .then((text) => writeFileSync(`../pastAttempts/${year}/${state}.csv`, text))
    .catch((err) => console.error(err));
}

async function getUrl(year, state) {
  return `https://en.wikipedia.org/wiki/${year}_United_States_presidential_election_in_${state.replace(
    / /g,
    "_"
  )}`;
}

async function scrape(url) {
  let result;
  await fetch(url)
    .then((res) => res.text())
    .then((text) => {
      const headerIndex = text.indexOf(
        `<span class="mw-headline" id="Results_by_county">Results by county</span>`
      );
      console.log("a");
      //need to add restriction for if html unfound
      text = text.substring(headerIndex);
      const startIndex = text.indexOf("<table");
      const endIndex = text.indexOf("</table>") + 8;
      result = text.substring(startIndex, endIndex);
      result = result.replace(/,/g, "");
      console.log("b");
      console.log("c");
      result = result.replace(/<br>/g, "&");
      result = result.replace(/<br\/>/g, "&&");
      result = result.replace(/<br \/>/g, "&&&");
      result = replaceInBetweenAll(result, "<", ">", "");
      console.log("d");
      result = replaceInBetweenAll(result, "[", "]", "");
      console.log("e");
      result = result.split("\n\n\n");
      for (let i = 2; i < result.length; ++i) {
        result[i] = result[i].split("\n\n").join(", ");
      }
      result = result.join("\n");
    });
  return result;
}

async function removeTbodyTtable(text) {
  // console.log(text);
  text = text.substring(text.indexOf("<tbody>") + 7);
  text = text.substring(0, text.indexOf("</tbody>"));
  return text;
}

async function convertTr(text) {
  let index = -1;
  let leftIndex = 0;
  let result = "";
  while (++index + 9 < text.length) {
    //finding opening tr
    if (text.charAt(index) !== "<") continue;
    if (text.charAt(index + 1) !== "t" || text.charAt(index + 2) !== "r")
      continue;
    result += text.substring(leftIndex, index) + "<tr>";
    //finding end of tr
    while (++index < text.length) {
      if (text.charAt(index) === ">") break;
    }
    leftIndex = index + 1;
  }
  result += text.substring(leftIndex);
  return result;
}

async function convertTh(text) {
  let index = -1;
  let leftIndex = 0;
  let result = "";
  while (++index + 9 < text.length) {
    //finding opening th
    if (text.charAt(index) !== "<") continue;
    if (text.charAt(index + 1) !== "t" || text.charAt(index + 2) !== "h")
      continue;
    result += text.substring(leftIndex, index) + "<th>";
    //finding end of th
    while (++index < text.length) {
      if (text.charAt(index) === ">") break;
    }
    leftIndex = index + 1;
  }
  result += text.substring(leftIndex);
  return result;
}

async function convertTd(text) {
  let index = -1;
  let leftIndex = 0;
  let result = "";
  while (++index + 9 < text.length) {
    //finding opening td
    if (text.charAt(index) !== "<") continue;
    if (text.charAt(index + 1) !== "t" || text.charAt(index + 2) !== "d")
      continue;
    result += text.substring(leftIndex, index) + "<td>";
    //finding end of td
    while (++index < text.length) {
      if (text.charAt(index) === ">") break;
    }
    leftIndex = index + 1;
  }
  result += text.substring(leftIndex);
  return result;
}

async function removeAref(text) {
  let index = -1;
  let leftIndex = 0;
  let result = "";
  while (++index + 9 < text.length) {
    //finding opening aref
    if (text.charAt(index) !== "<") continue;
    if (text.charAt(index + 1) !== "a") continue;
    result += text.substring(leftIndex, index) + "<a>";
    //finding end of aref
    while (++index < text.length) {
      if (text.charAt(index) === ">") break;
    }
    leftIndex = index + 1;
  }
  result += text.substring(leftIndex);
  result = result.replace(/<a>/g, "");
  result = result.replace(/<\/a>/g, "");
  return result;
}

async function removeH2(text) {
  let result = text.replace(
    text.substring(
      text.indexOf("<tr>", text.indexOf("<tr>") + 1),
      text.indexOf("</tr", text.indexOf("</tr>") + 1) + 5
    ),
    ""
  );
  return result;
}

async function removeLineBreaks(text) {
  let result = text.replace(/\n/g, "");
  return result;
}

async function makeCommas(text) {
  let result = text.replace(/<td>/g, "");
  result = result.replace(/,/g, "");
  result = result.replace(/<\/td>/g, ", ");
  return result;
}

async function makeLineBreaks(text) {
  let result = text.replace(/<tr>/g, "");
  result = result.replace(/<\/tr>/g, "\n");
  result = result.replace();
  return result;
}

//this function is really omnibus now
//`<th>County</th><th>Franklin D. Roosevelt<br />Democratic</th><th>Herbert Hoover<br />Republican</th><th>Norman Thomas<sup id="cite_ref-Geoelections_5-0" class="reference">&#91;4&#93;</sup><br />Socialist</th><th>William Hope Harvey<sup id="cite_ref-Geoelections_5-1" class="reference">&#91;4&#93;</sup><br />Liberty</th><th>William Z. Foster\n\n<sup id="cite_ref-Geoelections_5-2" class="reference">&#91;4&#93;</sup><br />Communist</th><th>Margin</th><th>Total votes cast<sup id="cite_ref-6" class="reference">&#91;5&#93;</sup></th>`
async function fixFirstLine(text) {
  let index = -1;
  let leftIndex = 0;
  let result = "";
  while (++index + 9 < text.length) {
    //finding opening sup
    if (text.charAt(index) !== "<") continue;
    if (text.charAt(index + 1) !== "s" || text.charAt(index + 2) !== "u")
      continue;
    result += text.substring(leftIndex, index) + "<sup>";
    //finding end of sup
    while (++index < text.length) {
      if (text.charAt(index) === ">") break;
    }
    leftIndex = index + 1;
  }
  result += text.substring(leftIndex);
  while (result.includes("<sup>")) {
    result = result.replace(
      result.substring(result.indexOf("<sup>"), result.indexOf("</sup>") + 6),
      ""
    );
  }
  //<sup>...</sup> --> ""

  let lineText = result.split("\n");
  let firstLine = lineText[0];
  // firstLine = first
  let lastLine = lineText[lineText.length - 1];
  while (firstLine.includes("<")) {
    firstLine = firstLine.replace(
      firstLine.substring(firstLine.indexOf("<"), firstLine.indexOf(">") + 1),
      "*"
    );
  }
  //<...> --> *
  let words1 = firstLine.split("*");
  let words2 = [];
  for (let i = 0; i < words1.length; ++i) {
    if (words1[i] !== "") words2.push(words1[i].replace(/\*/g, ""));
  }
  //creates an array of
  // console.log(words1);
  lineText[0] = words2.join(", ");
  return lineText.join("\n");
}

async function fixLastLine(text) {
  let lineText = text.split("\n");
  let lastLine = lineText[lineText.length - 2];
  while (lastLine.includes("<")) {
    lastLine = lastLine.replace(
      lastLine.substring(lastLine.indexOf("<"), lastLine.indexOf(">") + 1),
      "*"
    );
  }

  let lastLineWords = lastLine.split("*");
  let newLine = [];
  for (let i = 0; i < lastLineWords.length; ++i) {
    if (lastLineWords[i] !== "")
      newLine.push(lastLineWords[i].replace(/\*/g, ""));
  }
  lineText[lineText.length - 2] = newLine.join(", "); //TODO
  return lineText.join("\n");
}

//TODO: make this func
async function improveCsv(text) {
  let arr = text.split("\n");
  for (let i = 0; i < arr.length; ++i) {
    arr[i] = arr[i].split(", ");
  }
  arr.pop();
  totals = arr.pop();

  let cols = arr[0];
  let pctFirst = arr[1][1].includes("%");
  let newCsv = [];
  for (let i = 1; i < arr.length; ++i) {
    let rowI = arr[i];
    let newRow = [rowI[0]];
    let maxPct = -1;
    let maxIndex = -1;
    for (let j = 1; j < rowI.length; ++j) {
      if (
        rowI[j].includes("%") &&
        Number(rowI[j].substring(0, rowI[j].length - 1)) > maxPct
      ) {
        maxPct = Number(rowI[j].substring(0, rowI[j].length - 1));
        maxIndex = j;
      }
    }
    if (pctFirst) {
      newRow.push(cols[maxIndex]);
      newRow.push(cols[maxIndex + 1]);
      newRow.push(maxPct);
    } else {
      newRow.push(cols[maxIndex - 1]);
      newRow.push(cols[maxIndex]);
      newRow.push(maxPct);
    }
    newCsv.push(newRow);
  }

  let output = "";
  for (let row = 0; row < newCsv.length; ++row) {
    let line = newCsv[row];
    if (line.length) {
      output += line[0];
    }
    for (let col = 1; col < line.length; ++col) {
      output += ", " + line[col];
    }
    output += "\n";
  }
  return output;
}

async function saveAsCsv(text, year, state) {
  // console.log(text);
  // return;
  writeFile(`./${year}/${state}-${year}.csv`, text, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function lastIndexOf(str, char) {
  return str.length - str.split("").reverse().join("").indexOf(char) - 1;
}

function isLetter(char) {
  return "abcdefghijklmnopqrstuvwxyz".includes(char.toLowerCase());
  //(/[a-zA-Z]/).test(char)
  //char.toLowerCase() !== char.toUpperCase()
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
//read in .table file --> done

//remove tbody and table tags (unneccessary) --> done

//convert every <tr...> to <tr> --> done

//convert every <th...> and <td...> to <th> and <td> --> done

//remove <a...> and </a> --> done

//remove unneccessary second header row --> done

//remove line breaks (\n) --> done

//convert every </td> into , and remove every <td> --> done

//convert </tr> into \n and remove <tr> --> done

//then save as csv (should be comma separated values by now)
