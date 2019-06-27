// Code goes here
let startPoint = document.documentElement;
function deepSearch(node, arr) {
  if (node.nodeType === Node.TEXT_NODE) {
      for (let word of arr) {
        let text = node.textContent;
        // alert(word);
        let regex = new RegExp(word,"i");
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
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    let allText = "";
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}
// window.onload() = function() {
  // const load = () => {
    // alert("this ran");
    // let str = readTextFile("./src/banwords.txt");
    // console.log(str);
  
    // function readArr(anotherVar, arr){
    //   alert(arr);
    // }
  
    // let test = str.split(/\r?\n/);
    let test = ["feedback", "events", "lmao", "support", "report", "ghost", "next"];
    deepSearch(startPoint, test);
    // alert("loaded");
  // } 
  // window.onload = load; 
// }