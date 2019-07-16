// starting point for searching for keywords
let rootTop = document.documentElement;

/*
 * Tries to access two parents above and if possible, look for images among the children
 * and marks them for blurring.
 */
function filterImage(node) {
  let singleParent = node.parentElement;
  let doubleParent;
  // checks if singleParent exist
  if (singleParent) {
    // ensure that parent of parent exist and that it isn't body (avoid filtering everything)
    if (singleParent.parentElement && singleParent.tagName!= 'BODY') {
      doubleParent = node.parentElement.parentElement;
      let images = doubleParent.getElementsByTagName('IMG');
      for(let image of images) {
        image.classList.add("spoiler");
      }
    }
  }
}

/*
 * Returns an ancestor element that is div, span or p tag.
 * If the node is already in html/body tag, that body/html element will be returned.
 */
function findSurrTag(node) {
  let ancestor = node.parentElement;
  let prevElement;
  let allowedTagName = ["DIV", "SPAN", "P"];
  let unallowedTagName = ["BODY", "HTML"];
  let findAncestor = true;
  while (findAncestor) {
    // terminates if it detects body or html tag
    for (let word of unallowedTagName) {
      if (ancestor.tagName === word) {
        // in the case of the node being in the body text,
        // prevElement will be undefined so we will just return ancestor and
        // filter the entire body/html
        if (prevElement) {
          return prevElement;
        } else {
          return ancestor;
        }
      }
    }
    for (let word of allowedTagName) {
      if (ancestor.tagName === word) {
        findAncestor = false;
        break;
      }
    }
    // if still need to find ancestor, assign ancestor the parent of ancestor.
    // else return the element
    if (findAncestor) {
      prevElement = ancestor;
      ancestor = ancestor.parentElement;
    } else {
      return ancestor;
    }
  }
}

/*
 * searchAndFilter looks for text nodes within the DOM and and gives them a class that marks them for
 * filtering
 */
function searchAndFilter(node, arr) {
  if (node.nodeType === Node.TEXT_NODE) {
    for (let word of arr) {
      let regex = new RegExp(word,"ig");
      let text = node.textContent;
      // -1 is returned when search fails to find keyword
      if (text.search(regex) >= 0) {
        filterImage(node);
        let surroundingTag = findSurrTag(node);
        surroundingTag.classList.add("spoiler");
        break;
      }
    }
  }
  // check if there are children/siblings and perform searchAndFilter recursively
  if (node.firstChild) {
    searchAndFilter(node.firstChild,arr);
  }
  if (node.nextSibling) {
    searchAndFilter(node.nextSibling,arr);
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
          searchAndFilter(startPoint, item.bannedWordsArr);
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
