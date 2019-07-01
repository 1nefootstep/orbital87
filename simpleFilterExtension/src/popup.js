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
    // let bannedWordsArr = browser.storage.local.get("bannedWordsArr")
    //     .then(function() {
    //         if (bannedWordsArr) {
    //             bannedWordsArr.concat(words);
    //         } else {
    //             bannedWordsArr = words;
    //         }
    //     }).then(function() {
    //         browser.storage.local.set({"bannedWordsArr": bannedWordsArr}).then(() => onSuccess(" set"), onError);
    //     }).then(function () {
    //         browser.storage.local.get("bannedWordsArr").then((obj)=>console.log(obj),onError);
    //     });
}
// function onError(error) {
//     console.log(error);
// }

// function onSuccess(text = "") {
//     console.log("OK" + text);
// }

// function initialiseList() {
//     // /* 
//     // Although this API is similar to Window.localStorage it is recommended that you don't use
//     // Window.localStorage in extension code. Firefox will clear data stored by extensions using the 
//     // localStorage API in various scenarios where users clear their browsing history and data for 
//     // privacy reasons, while data saved using the storage.local API will be correctly persisted in 
//     // these scenarios. => use browser.storage.local
//     //  */
//     console.log("1");
//     let bannedWordsArr = browser.storage.local.get("bannedWordsArr")
//         .then(() => onSuccess(" got list of banned words"), onError)
//         .then(function() {
//             console.log(bannedWordsArr)
//             if (bannedWordsArr) {
//                 populateList(bannedWordsArr);
//             }
//         });
// }

document.addEventListener("DOMContentLoaded", function() {
    // initialiseList();
    // console.log("1");
    let btn = document.getElementById("block");
    btn.addEventListener('click', moveTextToList);
});