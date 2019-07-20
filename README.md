<!DOCTYPE html>
<html>
    <body>
        <h1> Spoiler Blocker</h1>
        <h3>Goals</h3>
        <ul>
            <li>Provide a solution to people who wish to continue to browse the internet as per normal while avoiding spoilers.</li>
        </ul>
        <h3>Current Features</h3>
        <ul>
            <li>Allows user to specify and add keywords</li>
            <li>Keywords can be cleared</li>
            <li>Instead of just clearing all the keywords, allow individual deletion of keywords</li>
            <li>Keywords are persistent</li>
            <li>Enabling the on/off switch</li>
            <li>block entire paragraphs instead of just words. This specifically targets</li>
            <li>hides spoilers by using blur effect</li>
            <li>Hiding images</li>
            <li>Check for modifications of DOM and filter DOM again if changes detected</li>
        </ul>
        <h3>Things to work on</h3>
        <ul>
            <li>Improve design of popup</li>
            <li>Create an option on how to delimit words (either comma, space, etc) Ppl might want to copy a paragraph of text and blocking the entire chunk of it.</li>
            <li>Create an option to whitelist/blacklist sites (or only apply script on certain websites)</li>
            <li>Work on cross browser compatability (minimally to work on both chrome/firefox)</li>
        </ul>
        <div style="text-decoration: line-through;">
        <h3>Known bugs</h3>
        <ul>
            <li>websites like reddit might tag their div with the class "spoiler" and that might trigger our blurring script to blur it incorrectly as we first mark spoiler related elements with the class "spoiler".</li>
                <ul>
                    <li>Fixed by changing the class name we mark with to dumb87-spoiler. Admittedly, this only temporarily resolves the problem as the same issue can occur if another website decides to have the same class name. Might come up with a less naive solution if time permits.</li>
                </ul>
        </ul>
        </div>
        <h3>Video Demo</h3>
        <a href="https://www.youtube.com/watch?v=ABHz1v017_w&feature=youtu.be">Youtube link</a>
    </body>
</html>