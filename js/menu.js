function menu() {
    var x = document.getElementsByTagName("nav").item(0);
    var body = document.getElementsByTagName('body').item(0);
    var li = document.getElementById('navInscription');
    if (x.className === "topnav") {
        x.className += " responsive";
        body.className += "responsive";
        li.className += "responsive";
    } else {
        x.className = "topnav";
        body.className = "";
        li.className = "";
    }
}

function scrollToElement(id)
{
    $('html, body').animate({
        scrollTop: $(id).offset().top
    }, 2000);
}
