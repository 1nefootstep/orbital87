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

let test = ["feedback", "events", "lmao", "support", "report", "ghost", "next", "merged", "dependency", "singapore"];
deepSearch(startPoint, test);
// testingThis();
