// Code goes here
let startPoint = document.documentElement;
function deepSearch(node, arr) {
  if (node.nodeType === Node.TEXT_NODE) {
      for (let word of arr) {
        let text = node.textContent;
        // alert(word);
        let regex = new RegExp(word,"ig");
        node.textContent = text.replace(regex, "***");;
      }
    }
  if (node.firstChild) {
    deepSearch(node.firstChild,arr);
  }
  if (node.nextSibling) {
    deepSearch(node.nextSibling,arr);
  }
}
let test = ["avenger", "endgame", "captain america", "ironman", "avengers", "captainamerica", "iron man"];
deepSearch(startPoint, test);
// testingThis();
// function onError(error) {
//   console.log(error);
// }

// function onSuccess(text = "") {
//   console.log("OK" + text);
// }

// let bannedWordsArr = browser.storage.local.get("listOfBanWords")
//   .then(() => onSuccess(" got list of banned words"), onError);

// document.addEventListener("DOMContentLoaded", function() {
//   // deepSearch(startPoint, bannedWordsArr.arr);
//   deepSearch(startPoint, test);
//   alert("test");
// });