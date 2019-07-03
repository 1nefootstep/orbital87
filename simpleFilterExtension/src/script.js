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

let promiseArr = browser.storage.local.get('bannedWordsArr');
let promiseOnSwitch = browser.storage.local.get('onSwitch');
promiseOnSwitch.then(function(item) {
  // if onSwitch has yet to be defined, we define it as true
  if (typeof(item.onSwitch) === "undefined") {
    browser.storage.local.set({onSwitch: true});
  }
  // since onSwitch is a promise, it may still be undefined
  console.log("switch is " + item.onSwitch);
  if (typeof(item.onSwitch) === "undefined" || item.onSwitch) {
    console.log("switch is " + item.onSwitch);
    promiseArr.then(function(item) {
      if (item.bannedWordsArr.length > 0) {
        deepSearch(startPoint, item.bannedWordsArr);
      }
    });
  }
  
})


// let test = ["avenger", "endgame", "captain america", "ironman", "avengers", "captainamerica", "iron man"];
// deepSearch(startPoint, test);
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