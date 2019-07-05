<!DOCTYPE html>
<html>
    <body>
        <h1> Spoiler Blocker</h1>
        <h3>Goals</h3>
        <ul>
            <li>Provide a solution to people who wish to continue to browse the internet as per normal despite wanting to avoid spoilers.</li>
        </ul>
        <h3>Current Features</h3>
        <ul>
            <li>Blocking spoilers: search the webpage for keywords then block the element that encloses the text by blurring it</li>
            <li>Allows user to specify and add keywords</li>
            <li>Keywords can be cleared</li>
            <li>Keywords are persistent</li>
            <li>Enabling the on/off switch</li>
            <li>block entire paragraphs instead of just words</li>
            <li>hides spoilers by using blur effect</li>
        </ul>
        <h3>Things to work on</h3>
        <ul>
            <li>Implement a smarter way of blocking paragraph that isn't naive (will ignore tags like em, b, i etc; or perhaps only whitelist certain tags like p, div, span?)</li>
            <li>Instead of just clearing all the keywords, allow individual deletion of keywords</li>
            <li>Hiding images</li>
            <li>Check for modifications of DOM and filter DOM again if changes detected</li>
            <li>Creating two buckets of keywords (high priority and low priority) and hide the censored words with different effects depending on the priority (red for high/ yellow for low).</li>
            <li>Improve design of popup</li>
        </ul>
        <h3>Video Demo</h3>
        <a href="https://www.youtube.com/watch?v=ABHz1v017_w&feature=youtu.be">Youtube link</a>
    </body>
</html>