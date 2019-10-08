$(function pipa() {
    $.getJSON("http://localhost:1337/restaurants", function (json) {
        console.log("succes", json);                               
        document.getElementById("dump").innerHTML = shamwow;
    });
});
