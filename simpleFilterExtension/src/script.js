// Code goes here
let startPoint = document.documentElement;
function deepSearch(node, arr) {
  if (node.nodeType === Node.TEXT_NODE) {
      for (let word of arr) {
        let text = node.textContent;
        // alert(word);
        if (text.includes(word)) {
          console.log(node);
          console.log(node.parentElement);
          node.parentElement.classList.add("spoiler");
          break;
        }
        // let regex = new RegExp(word,"ig");
        // node.textContent = text.replace(regex, "***");;
      }
    }
  if (node.firstChild) {
    deepSearch(node.firstChild,arr);
  }
  if (node.nextSibling) {
    deepSearch(node.nextSibling,arr);
  }
}


// check if the switch is on/off before filtering
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
}).then(() => {
  spoilerAlert('spoiler, .spoiler', {max: 10, partial: 4});
});