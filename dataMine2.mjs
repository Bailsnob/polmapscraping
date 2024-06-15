import fetch from "node-fetch";
import { writeFile, readFile, writeFileSync } from "fs";

const states = [
  "Alabama",
  // "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut", //problem
  "Delaware", //problem
  // // // "District Of Columbia",
  "Florida", //ran but produced incorrect results
  "Georgia",
  // "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana", //problem
  "Maine",
  "Maryland",
  "Massachusetts", //problem
  "Michigan",
  "Minnesota",
  "Mississippi", //problem
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island", //problem
  "South Carolina", //problem
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia", //problem
  // "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const year = "1916";
const dName = "Woodrow Wilson";
const rName = "Charles Evans Hughes";
const iName = "Eugene V Debs";

for (let state of states) {
  await getUrl(year, state)
    .then((url) => scrape(url))
    .then((arr) => syncArrayToCsv(arr, `../Pol_Map3/db/Presidential/${year}/${state}.csv`))
    // .then((text) => writeFileSync(`./pastAttempts/${year}/${state}.csv`, text))
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
  let awef;
  await fetch(url)
    .then((res) => res.text())
    .then((text) => {
      const headerIndex = text.indexOf(
        `<span class="mw-headline" id="Results_by_county">Results by county</span>`
      );
      //need to add restriction for if html unfound
      text = text.substring(headerIndex);
      const startIndex = text.indexOf("<table");
      const endIndex = text.indexOf("</table>") + 8;
      result = text.substring(startIndex, endIndex);
      result = result.replace(/,/g, "");
      result = result.replace(/<br>/g, "&");
      result = result.replace(/<br\/>/g, "&&");
      result = result.replace(/<br \/>/g, "&&&");
      result = replaceInBetweenAll(result, "<", ">", "");
      result = replaceInBetweenAll(result, "[", "]", "");
      result = result.split("\n\n\n");
      for (let i = 1; i < result.length; ++i) {
        result[i] = result[i].split("\n\n").join(", ");
      }
      result = result.join("\n");

      let rfirst = result.indexOf("Repub") < result.indexOf("Democ");

      result = result.split("\n");

      // let rName = "";
      // let dName = "";
      // for (let i = 0; i < result.length; ++i) {
      //   if (rName !== "" && dName !== "") break;
      //   if (result[i].includes("Repub")) rName = result[i].split("&&&")[0];
      //   else if (result[i].includes("Democ")) dName = result[i].split("&&&")[0];
      // }
      // console.log(rName);
      // console.log(dName);

      let nawe = [];
      for (let i = 1; i < result.length; ++i) {
        if (result[i].includes(",") && result[i - 1].includes(","))
          nawe.push(result[i]);
      }

      result = nawe;
      result = result.join("\n");
      result = result.split("\n");
      for (let i = 0; i < result.length; ++i) {
        result[i] = result[i].split(", ");
      }

      let pctIndices = [];
      for (let i = 1; i < result[0].length; ++i) {
        if (result[0][i].includes("%")) pctIndices.push(i);
      }

      for (let i = 0; i < result.length; ++i) {
        result[i] = result[i].join(", ");
      }

      result = result.join("\n");
      awef = result;
      result = result.replace(/\%/g, "");
      result = result.split("\n");

      for (let i = 0; i < result.length; ++i) {
        result[i] = result[i].split(", ");
      }
      convertNumbersInArray(result);

      for (let i = 0; i < result.length; ++i) {
        let newRow = [result[i][0]];
        let pcts = [];
        for (let index of pctIndices) {
          pcts.push(result[i][index]);
        }
        if (Math.max(...pcts) === result[i][pctIndices[0]]) {
          if (rfirst) {
            newRow.push(rName);
            newRow.push("Republican");
          } else {
            newRow.push(dName);
            newRow.push("Democrat");
          }
          newRow.push(Math.max(...pcts));
        } else if (Math.max(...pcts) === result[i][pctIndices[1]]) {
          if (!rfirst) {
            newRow.push(rName);
            newRow.push("Republican");
          } else {
            newRow.push(dName);
            newRow.push("Democrat");
          }
          newRow.push(Math.max(...pcts));
        }
        else {
          newRow.push(iName);
          newRow.push("Progressive");
          newRow.push(Math.max(...pcts));
        }
        result[i] = newRow;
      }
      // console.log(result);
    });
  return result;
}

async function improveCsv(text) {
  let arr = text.split("\n");
  for (let i = 1; i < arr.length; ++i) {
    arr[i] = arr[i].split(", ");
  }
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

function convertNumbersInArray(theArray) {
  for (let row = 0; row < theArray.length; ++row) {
    for (let col = 0; col < theArray[row].length; ++col) {
      let n = Number(theArray[row][col]);
      if (!Number.isNaN(n)) {
        theArray[row][col] = n;
      }
    }
  }
}

function arrayToCsv(theArray, fileName) {
  return new Promise((resolve, reject) => {
    let output = "";
    for (let row = 0; row < theArray.length; ++row) {
      let line = theArray[row];
      if (line.length) {
        output += line[0];
      }
      for (let col = 1; col < line.length; ++col) {
        output += ", " + line[col];
      }
      output += "\n";
    }
    writeFile(fileName, output, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

async function syncArrayToCsv(theArray, fileName) {
  await arrayToCsv(theArray, fileName);
}