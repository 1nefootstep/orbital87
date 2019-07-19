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
        if (!image.classList.contains("dumb87-spoiler")) {
          image.classList.add("dumb87-spoiler");
          modifiedSpoilerAlert(image);
        }
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
        let surroundingElement = findSurrTag(node);
        if (!surroundingElement.classList.contains("dumb87-spoiler")) {
          surroundingElement.classList.add("dumb87-spoiler");
          modifiedSpoilerAlert(surroundingElement);
          filterImage(node);
        }
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
function filter(startPoint) {
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
  });
}

// below are the codes that will be executed.
// starts filtering from the very top of DOM.
filter(document.documentElement);
// creates an observer that watches for changes.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      // The DOM change detected will be "added nodes"
      // Filter will be run on these newly added nodes to check
      // if they contain censored keywords.
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        filter(mutation.addedNodes[i]);
      }
    }
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});
