var API = chrome || browser;

function addSingleToList(word) {
    if (word !== "") {
        let li = document.createElement('li');
        // adding a button that can delete a keyword individually
        li.innerHTML = word + "<span class='close'>&times;</span>";
        li.lastChild.addEventListener("click", function () {
            let deletedWord = this.previousSibling.textContent;
            API.storage.local.get('bannedWordsArr', function (obj) {
                let newSet = new Set(obj.bannedWordsArr);
                newSet.delete(deletedWord);
                API.storage.local.set({ bannedWordsArr: [...newSet] });
            });
            this.parentElement.remove();
        });
        document.getElementById("banWords").appendChild(li);
    }
}

function populateList(arr) {
    for (let word of arr) {
        addSingleToList(word);
    }
}

function moveTextToList() {
    let text = document.getElementById("wordsAffected");
    API.storage.local.get("dumb87SpoilerSettings", function (item) {
        let words = text.value.split(item.dumb87SpoilerSettings.delimiter);
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i].trim();
        }
        words = new Set(words);
        text.value = '';
        API.storage.local.get('bannedWordsArr', function (obj) {
            let newSet;
            if (obj.bannedWordsArr && obj.bannedWordsArr.length > 0) {
                newSet = new Set(obj.bannedWordsArr); // to ensure no duplicates
                for (let word of words) {
                    if (!newSet.has(word)) {
                        newSet.add(word);
                        addSingleToList(word);
                    }
                }
            } else {
                populateList(words);
                newSet = words;
            }
            API.storage.local.set({ bannedWordsArr: [...newSet] }); //using spread operator to spread the set into array
        });
    });
}

function reappear(tab, allTabElements, activeLink, links) {
    console.log("reappear called");
    //make sure everything disappear first then make the 1 you want appear
    for (let t of allTabElements) {
        // the class tabcontent makes the element, display:none
        t.classList.add('tabcontent');
    }
    for (let l of links) {
        l.classList.remove("active");
    }
    activeLink.classList.add("active");
    tab.classList.remove('tabcontent');
}

function clearBannedWords() {
    let ls = document.getElementById("banWords");
    ls.innerHTML = "<ul id = 'banWords'></ul>";
    API.storage.local.set({ bannedWordsArr: [] });
}

function initialiseList() {
    // /* 
    // Although this API is similar to Window.localStorage it is recommended that you don't use
    // Window.localStorage in extension code. Firefox will clear data stored by extensions using the 
    // localStorage API in various scenarios where users clear their browsing history and data for 
    // privacy reasons, while data saved using the storage.local API will be correctly persisted in 
    // these scenarios. => use API.storage.local
    //  */
    API.storage.local.get('bannedWordsArr', function (obj) {
        if (obj.bannedWordsArr) {
            if (obj.bannedWordsArr.length > 0) {
                populateList(obj.bannedWordsArr);
            }
        }
    });
}

function initialiseButtons() {
    API.storage.local.get("dumb87SpoilerSettings", function (obj) {
        console.log(obj);
        if (typeof (obj.dumb87SpoilerSettings) === "undefined") {
            let settings = {
                onSwitch: true,
                imgSwitch: true,
                delimiter: ','
            }
            API.storage.local.set({ dumb87SpoilerSettings: settings });
        } else {
            if (!obj.dumb87SpoilerSettings.onSwitch) {
                document.getElementById("onSwitch").innerHTML = "<input type='checkbox'><span class='slider round'></span>";
            }
            if (!obj.dumb87SpoilerSettings.imgSwitch) {
                document.getElementById("imgSwitch").innerHTML = "<input type='checkbox'><span class='slider round'></span>";
            }
            console.log(document.getElementById("delimiter"));
            console.log(obj.dumb87SpoilerSettings);
            document.getElementById("delimiter").getAttributeNode("value").value = obj.dumb87SpoilerSettings.delimiter;
        }
    });
}

function toggleSwitch(switchType) {
    API.storage.local.get("dumb87SpoilerSettings", function (obj) {
        let newSettings = obj.dumb87SpoilerSettings;
        switch (switchType) {
            case 'extension':
                newSettings.onSwitch = !newSettings.onSwitch;
                if (newSettings.onSwitch) {
                    browser.tabs.query({
                        currentWindow: true,
                        active: true
                    }).then(function(tabArray) {
                        console.log("sending msg 1");
                        for (let tab of tabArray) {
                            browser.tabs.sendMessage(
                                tab.id,
                                {execute: "searchAndFilter"}                        
                            );
                        }
                    });
                } else {
                    browser.tabs.query({
                        currentWindow: true,
                        active: true
                    }).then(function(tabArray) {
                        console.log("sending msg 2");
                        for (let tab of tabArray) {
                            browser.tabs.sendMessage(
                                tab.id,
                                {execute: "removeFilter"}                        
                            );
                        }
                    });
                }
                break;
            case 'img':
                newSettings.imgSwitch = !newSettings.imgSwitch;
                break;
            default:
                break;
        }
        API.storage.local.set({ dumb87SpoilerSettings: newSettings });
    });
}

function saveSettings() {
    API.storage.local.get("dumb87SpoilerSettings", function (obj) {
        let newSettings = obj.dumb87SpoilerSettings;
        newSettings.delimiter = document.getElementById("delimiter").value;
        API.storage.local.set({dumb87SpoilerSettings: newSettings});
    });
}

function defaultSetting(){
    API.storage.local.get("dumb87SpoilerSettings", function (obj) {
        let settings = {
            onSwitch: true,
            imgSwitch: true,
            delimiter: ','
        }
        document.getElementById("delimiter").value =",";
        document.getElementById("imgSwitch").innerHTML = "<input type='checkbox' checked><span class='slider round'></span>";
        API.storage.local.set({dumb87SpoilerSettings: settings});
    });  
}
function refreshPlaceholderText() {
    API.storage.local.get("dumb87SpoilerSettings", function (item) {
        if (typeof(item.dumb87SpoilerSettings) !== "undefined") {
            document.getElementById("wordsAffected").getAttributeNode("placeholder").value = "type spoiler-related keywords here (delimited by \'" + item.dumb87SpoilerSettings.delimiter + "\')";
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initialiseList();
    initialiseButtons();
    // gives the buttons functionality
    document.getElementById("block").addEventListener('click', moveTextToList);
    document.getElementById("clear").addEventListener('click', clearBannedWords);
    document.getElementById("onSwitch").addEventListener('click', () => toggleSwitch('extension'));
    document.getElementById("imgSwitch").addEventListener('click', () => toggleSwitch('img'));
    document.getElementById("save").addEventListener('click', saveSettings);
    // keep track of the possible tab contents and give the tab buttons functionality    
    let tabcontent1 = document.getElementById("spoiler_keywords");
    let tabcontent2 = document.getElementById("advanced_settings");
    let tabcontents = [
        tabcontent1,
        tabcontent2
    ];
    let t1 = document.getElementById("tablink1");
    let t2 = document.getElementById("tablink2");
    let tablinks = [
        t1,
        t2
    ];
    t1.addEventListener('click', () => {
        refreshPlaceholderText();
        reappear(tabcontent1, tabcontents, t1, tablinks);
    });
    t2.addEventListener('click', () => reappear(tabcontent2, tabcontents, t2, tablinks));
    // allows enter key to block the keywords on the text box.
    document.getElementById("wordsAffected").onkeydown = function (e) {
        var keyCode = e.keyCode;
        if (keyCode == 13) {
            //preventDefault to prevent from making newLine
            e.preventDefault();
            moveTextToList();
        }
    };
    document.getElementById("default").addEventListener('click', defaultSetting); 
    refreshPlaceholderText();    
});