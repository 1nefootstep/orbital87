function populateList(arr) {
    for (let word of arr) {
        let li = document.createElement('li');
        li.innerHTML = word;
        banWords.appendChild(li);
    }
}

function moveTextToList() {
    // console.log("start of movetexttolist");
    let text = document.getElementById("wordsAffected");
    let words = text.value.split(',');
    populateList(words);
    text.value = '';
    let bannedWordsArr = browser.storage.local.get('bannedWordsArr');
    bannedWordsArr.then(function(obj) {
        let newArr;
        if (obj.bannedWordsArr && obj.bannedWordsArr.length > 0) {
            console.log("length > 0");
            console.log(obj.bannedWordsArr);
            newArr = obj.bannedWordsArr.concat(words);
        } else {
            console.log("else");
            newArr = words;
        }
        console.log(newArr);
        browser.storage.local.set({bannedWordsArr: newArr})
            .then(()=>console.log("successfully saved"), (error)=>console.log(error));
    });
}
function clearBannedWords() {
    let ls = document.getElementById("banWords");
    ls.innerHTML = "<ul id = 'banWords'></ul>";
    browser.storage.local.set({bannedWordsArr: []});
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
    // these scenarios. => use browser.storage.local
    //  */
    console.log("initialise list");
    let bannedWordsArr = browser.storage.local.get('bannedWordsArr');
    bannedWordsArr.then((obj) => {
        console.log(obj);
        if (obj.bannedWordsArr) {
            if (obj.bannedWordsArr.length > 0) {
                console.log(obj.bannedWordsArr);
                console.log("populating list");
                populateList(obj.bannedWordsArr);
            }
        }
    }, onError);
}

document.addEventListener("DOMContentLoaded", function() {
    initialiseList();
    let blockBtn = document.getElementById("block");
    let clearBtn = document.getElementById("clear");
    blockBtn.addEventListener('click', moveTextToList);
    clearBtn.addEventListener('click', clearBannedWords);
});