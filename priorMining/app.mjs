import fetch from "node-fetch";
import { writeFile } from "fs";
// import { match } from "assert";

const years = [1932];
const states = [
  // "Alabama",
  // "Alaska",
  // "Arizona",
  // "Arkansas",
  // "California",
  // "Colorado",
  // "Connecticut",
  // "Delaware",
  // "District Of Columbia",
  // "Florida",
  // "Georgia",
  // "Hawaii",
  // "Idaho",
  // "Illinois",
  // "Indiana",
  // "Iowa",
  // "Kansas",
  // "Kentucky",
  // "Louisiana",
  // "Maine",
  // "Maryland",
  // "Massachusetts",
  // "Michigan",
  // "Minnesota",
  // "Mississippi",
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
  // "Rhode Island",
  // "South Carolina",
  // "South Dakota",
  // "Tennessee",
  "Texas",
  // "Utah",
  // "Vermont",
  // "Virginia",
  // "Washington",
  // "West Virginia",
  // "Wisconsin",
  // "Wyoming",
];

for (let year of years) {
  for (let state of states) {
    fetch(getUrl(year, state))
      .then((res) => res.text())
      .then((text) => {
        const headerIndex = text.indexOf(
          `<span class="mw-headline" id="Results_by_county">Results by county</span>`
        );
        text = text.substring(headerIndex);
        const startIndex = text.indexOf("<table");
        const endIndex = text.indexOf("</table>");
        text = text.substring(startIndex, endIndex + 8);
        // console.log(text)
        // let colsText = text.substring(text.indexOf("<tr>"), text.indexOf("</tr>") + 5);
        // let rawCountyArr = text.split("</tr>");
        // let countyArr = [];
        // for (let i = 2; i < rawCountyArr.length; ++i) {
        //   let countyPcts = [];
        //   for (let j = 0; j < rawCountyArr[i].split('\n').length; ++j) {
        //     if (rawCountyArr[i].split('\n')[j][rawCountyArr[i].split('\n')[j].length - 1] === '%') {
        //       countyPcts.push(Number(rawCountyArr[i].split('\n')[j].split('>')[1].substring(0, rawCountyArr[i].split('\n')[j].split('>')[1].length - 1)));
        //     }
        //   }
        //   countyArr.push(countyPcts);
        // }
        // console.log(Math.max(...countyArr[0]));

        //county name, winner name, winner party, pct
        
        
        writeFile(`${state}-${year}.table2`, text, (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
  }
}

console.log(states[0]);

function getUrl(year, state) {
  return `https://en.wikipedia.org/wiki/${year}_United_States_presidential_election_in_${state.replace(
    / /g,
    "_"
  )}`;
}

function linearSearch(arr, target) {
  let matchList = [];
  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] === target) matchList.push(i);
  }
  return matchList;
}