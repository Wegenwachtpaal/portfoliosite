setTimeout(function(loading){
    var laadscherm = document.getElementById("loader");
    laadscherm.style.width = 0;
    var element = document.getElementById("loadercontent");
    element.classList.toggle("loader-open");
    element.classList.toggle("loader-closed");
},4000)