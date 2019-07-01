function moveTextToList()
{
    // alert("works");
    let text = document.getElementById("wordsAffected");
    let words = text.value.split(',');
    for(let word of words){
        let li = document.createElement('li');
        li.innerHTML = word;
        banWords.appendChild(li);
    }
    text.value = '';
}
function testingThis() {
    alert("works");
}