var API = chrome || browser;

function addSingleToList(word) {
    let li = document.createElement('li');
    // adding a button that can delete a keyword individually
    li.innerHTML = word + "<span class='close'>&times;</span>";
    li.lastChild.addEventListener("click", function() {
        let deletedWord = this.previousSibling.textContent;
        API.storage.local.get('bannedWordsSet', function(obj) {
            let newSet = obj.bannedWordsSet;
            newSet.delete(deletedWord);
            API.storage.local.set({bannedWordsSet: newSet});
        });
        this.parentElement.remove();
    });
    document.getElementById("banWords").appendChild(li);
}

function populateList(set) {
    for(let word of set) {
        addSingleToList(word);
    }
}



function moveTextToList() {
    // console.log("start of movetexttolist");
    let text = document.getElementById("wordsAffected");
    let words = text.value.split(',');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].trim();
    }
    text.value = '';
    let bannedWordsSet = API.storage.local.get('bannedWordsSet', function(obj) {
        let newSet = obj.bannedWordsSet;
        if (newSet && newSet.size > 0) {
            for (let word of words) {
                if (!newSet.has(word)) {
                    newSet.add(word);
                    addSingleToList(word);
                }
            }
        } else {
            console.log("else");
            newSet = new Set(words);
            populateList(words);
        }
        console.log(newSet);
        API.storage.local.set({bannedWordsSet: newSet})
    });
}
/* function reappear(name,classNameArr){
    //make sure everything disappear first then make the 1 you want appear
    for(let i = 0 ; i < classNameArr.length;i++){
        let elementTemp = document.getElementById(classNameArr[i]);
        elementTemp.classList.add('tabcontent');  
    } 
    let element =  document.getElementById(name);
    let elementName = element.className;
    element.classList.remove(elementName);
} */
function clearBannedWords() {
    let ls = document.getElementById("banWords");
    ls.innerHTML = "<ul id = 'banWords'></ul>";
    API.storage.local.set({bannedWordsSet: new Set()});
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
    let bannedWordsSet = API.storage.local.get('bannedWordsSet', function(obj) {
        if (obj.bannedWordsSet) {
            if (obj.bannedWordsSet.size > 0) {
                populateList(obj.bannedWordsSet);
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
    let blockBtn = document.getElementById("block");
    let clearBtn = document.getElementById("clear");
    let onSwitch = document.getElementById("onSwitch");
 /*    let tab1 = document.getElementById("tablink1");
    let tab2 = document.getElementById("tablink2");
    let classNameArr = [tab1.className, tab2.className];
    tab1.addEventListener('click',()=>reappear(tab1.className,classNameArr));
    tab2.addEventListener('click',()=>reappear(tab2.className,classNameArr)); */
    document.getElementById("wordsAffected").onkeydown = function (e) {
        var keyCode = e.keyCode;
        if(keyCode == 13) {
            //preventDefault to prevent from making newLine
            e.preventDefault();
            moveTextToList();
        }
    };
    blockBtn.addEventListener('click', moveTextToList);
    clearBtn.addEventListener('click', clearBannedWords);
    onSwitch.addEventListener('click', toggleSwitch);
});