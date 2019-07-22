var API = chrome || browser;
  
function populateList(arr) {
    for (let word of arr) {
        let li = document.createElement('li');
        li.innerHTML = word + "<span class='close'>&times;</span>";
        li.lastChild.addEventListener("click", function() {
            let deletedWord = this.previousSibling.textContent;
            API.storage.local.get('bannedWordsArr', function(obj) {
                let newArr = obj.bannedWordsArr;
                for (let i = 0; i < newArr.length; i++) { 
                    if (newArr[i] === deletedWord) {
                        newArr.splice(i, 1); 
                    }
                }
                API.storage.local.set({bannedWordsArr: newArr});
            });
            this.parentElement.remove();
        });
        let banWords = document.getElementById("banWords");
        banWords.appendChild(li);
    }
}

function moveTextToList() {
    // console.log("start of movetexttolist");
    let text = document.getElementById("wordsAffected");
    let words = text.value.split(',');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].trim();
    }
    populateList(words);
    text.value = '';
    let bannedWordsArr = API.storage.local.get('bannedWordsArr', function(obj) {
        if (obj.bannedWordsArr && obj.bannedWordsArr.length > 0) {
            console.log("length > 0");
            console.log(obj.bannedWordsArr);
            //it breaks below
            /* for(let i = 0 ; i , words.length ; i++){
                if(obj.bannedWordsArr.includes(words[i])){
                    alert(words);
                    
                }
            } */
            newArr = obj.bannedWordsArr.concat(words);
        } else {
            console.log("else");
            newArr = words;
        }
        console.log(newArr);
        API.storage.local.set({bannedWordsArr: newArr})
    });
}
function reappear(name,classNameArr){
    //make sure everything disappear first then make the 1 you want appear
    for(let i = 0 ; i < classNameArr.length;i++){
        let elementTemp = document.getElementById(classNameArr[i]);
        elementTemp.classList.add('tabcontent');  
    } 
    let element =  document.getElementById(name);
    let elementName = element.className;
    element.classList.remove(elementName);
}

function clearBannedWords() {
    let ls = document.getElementById("banWords");
    ls.innerHTML = "<ul id = 'banWords'></ul>";
    API.storage.local.set({bannedWordsArr: []});
}

function onError(error) {
    console.log(error);
}

function onSuccess(text = "") {
    console.log("OK" + text);
}

function initialiseList() {
    // /* 
    // Although this API is similar to Window.localStorage it is recommended that you don't use
    // Window.localStorage in extension code. Firefox will clear data stored by extensions using the 
    // localStorage API in various scenarios where users clear their browsing history and data for 
    // privacy reasons, while data saved using the storage.local API will be correctly persisted in 
    // these scenarios. => use API.storage.local
    //  */
    console.log("initialise list");
    let bannedWordsArr = API.storage.local.get('bannedWordsArr', function(obj) {
        if (obj.bannedWordsArr) {
            if (obj.bannedWordsArr.length > 0) {
                populateList(obj.bannedWordsArr);
            } 
        }
    });
}

function initialiseButtons() {
    API.storage.local.get("onSwitch", function(obj) {
        if (typeof(obj.onSwitch) === "undefined") {
            console.log("set true");
            API.storage.local.set({onSwitch: true});
        } else if (obj.onSwitch === false) {
            let swHTML = document.getElementById("onSwitch");
            swHTML.innerHTML = "<input type='checkbox'><span class='slider round'></span>";
        }
    });
}

function toggleSwitch() {
    let togglePromise = API.storage.local.get("onSwitch", function(obj) {
        API.storage.local.set({onSwitch: !obj.onSwitch});
    });
}

document.addEventListener("DOMContentLoaded", function() {
    initialiseList();
    initialiseButtons();
    document.getElementById("block").addEventListener('click', moveTextToList);
    let clearBtn = document.getElementById("clear").addEventListener('click', clearBannedWords);
    let onSwitch = document.getElementById("onSwitch").addEventListener('click', toggleSwitch);
 /*    let tab1 = document.getElementById("tablink1");
    let tab2 = document.getElementById("tablink2");
    let classNameArr = [tab1.className, tab2.className];
    tab1.addEventListener('click',()=>reappear(tab1.className,classNameArr));
    tab2.addEventListener('click',()=>reappear(tab2.className,classNameArr)); */
<<<<<<< HEAD
    document.onkeydown = function (e) {
        var keyCode = e.keyCode;
        if(keyCode == 13) {
            moveTextToList();
        }
    };
    blockBtn.addEventListener('click', moveTextToList);
    clearBtn.addEventListener('click', clearBannedWords);
    onSwitch.addEventListener('click', toggleSwitch);
=======
>>>>>>> 5234cee59d2e60d4d6e307ee2b34f94ac06a7829
});