// Code goes here
let rootTop = document.documentElement;
function deepSearch(node, arr) {
  if (node.nodeType === Node.TEXT_NODE) {
      for (let word of arr) {
        let regex = new RegExp(word,"ig");
        let text = node.textContent;
        
        // alert(word);
        if (text.search(regex) >= 0) {
          console.log(text.search(regex));
          // console.log(node.E);
          // console.log(node.parentElement);
          let singleParent = node.parentElement;
        let doubleParent;
        if (singleParent) {
          if (singleParent.parentElement && singleParent.tagName!= 'BODY')
            doubleParent = node.parentElement.parentElement;
            let images = doubleParent.getElementsByTagName('IMG');
            for(let image of images) {
              image.classList.add("spoiler");
            }
        }
        console.log("temp");
        console.log(node);
        console.log(singleParent);
        console.log("Duality");
        console.log(doubleParent);
        console.log("cen");
        node.parentElement.classList.add("spoiler");
       /*  if (childOfDoubleParent != "body") {
          childOfDoubleParent.classList.add("spoiler");
        } */
          node.parentElement.classList.add("spoiler");
          break;
        }
        
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
let filter = function(startPoint) {
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
      promiseArr.then(function(item) {
        if (item.bannedWordsArr.length > 0) {
          deepSearch(startPoint, item.bannedWordsArr);
        }
      });
    }
  }).then(() => {
    spoilerAlert('spoiler, .spoiler', {max: 10, partial: 4});
  });
}
// document.addEventListener("load", function() {
//   console.log("start2");
// });

filter(rootTop);
// const observer = new MutationObserver((mutations) => {
//   console.log("mutation detected");
//   mutations.forEach((mutation) => {
//     if (mutation.addedNodes && mutation.addedNodes.length > 0) {
//       // This DOM change was new nodes being added. Run our substitution
//       // algorithm on each newly added node.
//       for (let i = 0; i < mutation.addedNodes.length; i++) {
//         const newNode = mutation.addedNodes[i];
//         // console.log("mutation2");
//         filter(newNode);
//       }
//     }
//   });
// });
// observer.observe(document.body, {
//   childList: true,
//   subtree: true
// });
