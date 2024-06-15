import fetch from "node-fetch";
import { writeFile, readFile, writeFileSync } from "fs";

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut", //problem
  "Delaware", //problem
  // // // "District Of Columbia",
  "Florida", //ran but produced incorrect results
  "Georgia",
  "Hawaii",
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

const mode = "Presidential";
// const year = "1932";
// const state = "Colorado";
let masterThing = {Presidential: {},
  Senatorial: {},
  Gubernatorial: {},
  Other: {}
};
let banana = "I like to eat the food I make for my mother because I know that I am the greatest cook I have ever encountered.";

// jsonToObjLiteral("answers.json")
//   .then((objLiteral) => {
//     console.log(objLiteral);
//     masterThing = objLiteral;
//   })

for (let year = 1932; year <= 2016; year += 4) {
  console.log(year);
  masterThing[`${mode}`][`${year}`] = {};
  for (let state of states) {
    if (year < 1960 && (state === "Alaska" || state === "Hawaii")) continue;
    if (year === 2008 && (state === "California" || state === "Massachusetts")) continue;
    if (year === 2016 && (state === "Colorado" || state === "Oregon" || state === "Pennsylvania" || state === "Texas" || state === "Wisconsin")) continue;
    console.log(state);
    masterThing[`${mode}`][`${year}`][`${state}`] = {};
    await getUrl(year, state).then((url) => scrape(url, state, year));
  }
}

objLiteralToJson(masterThing, "answers.json");

function objLiteralToJson(theObjLiteral, fileName) {
  return new Promise((resolve, reject) => {
    writeFile(fileName, JSON.stringify(theObjLiteral), (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

function jsonToObjLiteral(theJson) {
  return new Promise((resolve, reject) => {
    readFile(theJson, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}

// console.log(banana[findIndexOf(banana, "the", 2) + 1]);
// console.log(2);

// for (let state of states) {
//   await getUrl(year, state).then((url) => scrape(url, state));
// }

// console.log(masterThing["Presidential"]["1932"]["Mississippi"]);
// console.log(masterThing["Presidential"]["1932"]["South Carolina"]);

  // .then((text) => writeFileSync(`./ColoradoTest.txt`, text))
async function getUrl(year, state) {
  return `https://en.wikipedia.org/wiki/${year}_United_States_presidential_election_in_${state.replace(
    / /g,
    "_"
  )}`;
}

function lastIndexOf(str, char) {
  return str.length - str.split("").reverse().join("").indexOf(char) - 1;
}

async function scrape(url, state, year) {
  let result;
  let awef;
  await fetch(url)
    .then((res) => res.text())
    .then((text) => {
      // console.log(text[text.indexOf("Party")]);
      let times = 0;
      let endIndex;
      for (let i = text.indexOf("Party"); i < text.length - 5; ++i) {
        if (text.substring(i, i + 5) === "</tr>") {
          if (times == 5) {
            endIndex = i;
            break;
          }
          times++;
        }
      }
      result = text.substring(text.indexOf("Party"), endIndex);/*.substring(text.indexOf("Party"), text.indexOf("</tr>"/*, text.indexOf("</tr>", text.indexOf("</tr>", text.indexOf("</tr>") + 1) + 1) + 1) + 5)*/
      result = replaceInBetweenAll(result, "<", ">", "");
      let nums = [];
      let arr = result.split("\n");
      for (let i = 0; i < arr.length; ++i) {
        if (arr[i].includes("%")) nums.push(Number(arr[i].substring(0, arr[i].length - 1)));
      }
      // console.log(nums);
      nums = nums.sort(function(a,b){return b-a});
      let diff = Math.round(100 * (nums[0] - nums[1])) / 100;

      // console.log("aweofij");
      // console.log(arr[2].includes("Democrat"));
      if (arr[2] === "Democratic") masterThing[`${mode}`][`${year}`][`${state}`] = `d${diff}`;
      else if (arr[2].includes("Republican")) masterThing[`${mode}`][`${year}`][`${state}`] = `r${diff}`;
      else masterThing[`${mode}`][`${year}`][`${state}`] = `o${diff}`;
    });
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

function findIndexOf(str, subject, time) {
  let a = str;
  let index = 0;

  for (let i = 0; i < time; ++i) {
    index += a.indexOf(subject, a.indexOf(subject, a.indexOf(subject)));
    a = a.substring(index + 1);
  }
  return index + 1;
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