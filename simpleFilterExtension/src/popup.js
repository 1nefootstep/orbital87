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
function reappear(tab,allTabElements){
    console.log("reappear called");
    //make sure everything disappear first then make the 1 you want appear
    for(let t of allTabElements){
        // the class tabcontent makes the element, display:none
        t.classList.add('tabcontent');
    } 
    // let element =  document.getElementById(name);
    // let elementName = element.className;
    // // this removes all classes from the element. Is this desired?
    // element.classList.remove('tabcontent');
    tab.classList.remove('tabcontent');
}
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
    // gives the buttons functionality
    document.getElementById("block").addEventListener('click', moveTextToList);
    document.getElementById("clear").addEventListener('click', clearBannedWords);
    document.getElementById("onSwitch").addEventListener('click', toggleSwitch);
    // keep track of the possible tab contents and give the tab buttons functionality
    let tab1 = document.getElementById("spoiler_keywords");
    let tab2 = document.getElementById("advanced_settings");
    let tabs = [tab1, tab2];
    document.getElementById("tablink1").addEventListener('click',()=>reappear(tab1,tabs));
    document.getElementById("tablink2").addEventListener('click',()=>reappear(tab2,tabs));
    document.getElementById("wordsAffected").onkeydown = function (e) {
        var keyCode = e.keyCode;
        if(keyCode == 13) {
            //preventDefault to prevent from making newLine
            e.preventDefault();
            moveTextToList();
        }
    };
});