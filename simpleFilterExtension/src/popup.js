var API = chrome || browser;

function addSingleToList(word) {
    if (word !== "") {
        let li = document.createElement('li');
        // adding a button that can delete a keyword individually
        li.innerHTML = word + "<span class='close'>&times;</span>";
        li.lastChild.addEventListener("click", function () {
            let deletedWord = this.previousSibling.textContent;
            API.storage.local.get('bannedWordsSet', function (obj) {
                let newSet = obj.bannedWordsSet;
                newSet.delete(deletedWord);
                API.storage.local.set({ bannedWordsSet: newSet });
            });
            this.parentElement.remove();
        });
        document.getElementById("banWords").appendChild(li);
    }
}

function populateList(set) {
    for (let word of set) {
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
        text.value = '';
        let bannedWordsSet = API.storage.local.get('bannedWordsSet', function (obj) {
            let newSet = obj.bannedWordsSet;
            if (newSet && newSet.size > 0) {
                for (let word of words) {
                    if (!newSet.has(word)) {
                        newSet.add(word);
                        addSingleToList(word);
                    }
                }
            } else {
                newSet = new Set(words);
                populateList(words);
            }
            console.log(newSet);
            API.storage.local.set({ bannedWordsSet: newSet })
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
    // let element =  document.getElementById(name);
    // let elementName = element.className;
    // // this removes all classes from the element. Is this desired?
    // element.classList.remove('tabcontent');
    tab.classList.remove('tabcontent');
}
function clearBannedWords() {
    let ls = document.getElementById("banWords");
    ls.innerHTML = "<ul id = 'banWords'></ul>";
    API.storage.local.set({ bannedWordsSet: new Set() });
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
    API.storage.local.get('bannedWordsSet', function (obj) {
        if (obj.bannedWordsSet) {
            if (obj.bannedWordsSet.size > 0) {
                populateList(obj.bannedWordsSet);
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
    console.log("saving settings");
    API.storage.local.get("dumb87SpoilerSettings", function (obj) {
        let newSettings = obj.dumb87SpoilerSettings;
        newSettings.delimiter = document.getElementById("delimiter").value;
        console.log(newSettings);
        API.storage.local.set({dumb87SpoilerSettings: newSettings});
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
    refreshPlaceholderText();    
});