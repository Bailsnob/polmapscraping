function linearSearch(arr, target) {
  let matchList = [];
  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] === target) matchList.push(i);
  }
  return matchList;
}

let aoiefj = `<th>County</th><th>Franklin D. Roosevelt<br />Democratic</th><th>Herbert Hoover<br />Republican</th><th>Norman Thomas<sup id="cite_ref-Geoelections_5-0" class="reference">&#91;4&#93;</sup><br />Socialist</th><th>William Hope Harvey<sup id="cite_ref-Geoelections_5-1" class="reference">&#91;4&#93;</sup><br />Liberty</th><th>William Z. Foster\n\n<sup id="cite_ref-Geoelections_5-2" class="reference">&#91;4&#93;</sup><br />Communist</th><th>Margin</th><th>Total votes cast<sup id="cite_ref-6" class="reference">&#91;5&#93;</sup></th>`;
// console.log(replaceInBetweenAll(aoiefj, "<", ">", ""));
// console.log(aoiefj[aoiefj.indexOf("the")]);
// console.log(aoiefj.lastIndexOf("the"));
// console.log(lastIndexOf(aoiefj, 'the'));
// console.log(aoiefj[lastIndexOf(aoiefj, 'the')]);

// let b = [1, 2, 3, 4, 5, 6]
// try {
//   console.log(b.substring(3));
// }
// catch(err) {
//   console.error(err);
// }

function lastIndexOf(str, searchedStr) {
  return (
    str.length -
    str
      .split("")
      .reverse()
      .join("")
      .indexOf(searchedStr.split("").reverse().join("")) -
    1
  );
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

//<tr...> --> <tr>

// let banana = "I like to eat the food I make for my mother because I know that I am the greatest cook I have ever encountered.";

// console.log(banana[banana.indexOf("I", banana.indexOf("I") + 1)]);

// let man = [1, 3, 2, 6, 5, 4, 90, 345, 34, 23, 3, 2];
// man = man.sort(function(a, b) { return b - a; });
// console.log(man);

let a = {"West Virginia": 234};