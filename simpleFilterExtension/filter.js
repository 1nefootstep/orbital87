let badWords = "idiot,awful".split(","); // returns an array of string after splitting  


$("body").children().each(function() {
    $(this).html($(this).html().replace(/@/g,"$"));
});