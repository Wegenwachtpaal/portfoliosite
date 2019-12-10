//Service Worker
//See if the browser supports Service Workers, if so try to register one
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js", { scope: "/" }).then(function (registering) {
    // Registration was successful
    console.log("Browser: Service Worker registration is successful with the scope", registering.scope);
  }).catch(function (error) {
    //The registration of the service worker failed
    console.log("Browser: Service Worker registration failed with the error", error);
  });
} else {
  //The registration of the service worker failed
  console.log("Browser: I don't support Service Workers :(");
}
/* Nep laadscherm (Voorlopig nog) */
setTimeout(function(loading){
  var laadscherm = document.getElementById("loader");
  laadscherm.style.width = 0;
  var element = document.getElementById("loadercontent");
  element.classList.toggle("loader-open");
  element.classList.toggle("loader-closed");
  document.body.classList.remove("stop-scrolling"); 
},2000)

/* Open het hamburger menu */
function openNav() {
  document.getElementById("myNav").style.width = "100%";
  var element = document.getElementById("xd");
  element.classList.toggle("overlay-closed");
  element.classList.toggle("overlay-open");
}

/* Sluit het hamburger menu */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  var element = document.getElementById("xd");
  element.classList.toggle("overlay-open");
  element.classList.toggle("overlay-closed");
}

/* Hamburger animatie */
var intViewportHeight = window.innerHeight;
var intWebsiteHeight = document.body.clientHeight;
window.onscroll = () => {
  const nav = document.querySelector('#burger');
  if (this.scrollY <= intViewportHeight * 2) { nav.className = ''; }
  else if (this.scrollY == intWebsiteHeight - intViewportHeight) { nav.className = ''; }
  else { nav.className = 'scroll'; }
};

/* Hover effect op de hamburger menu knop
    Met behulp van jQuery en snap.svg.
*/ 
$(document).ready(function () {
  var svg = document.getElementById("geks");
  var s = Snap(svg);
  var burger = Snap.select('#step1');
  var hover = Snap.select('#step2');
  var simpleCupPoints = burger.node.getAttribute('d');
  var fancyCupPoints = hover.node.getAttribute('d');
  $("#burger").hover(function () {
    burger.animate({ d: fancyCupPoints }, 1000, mina.bounce);
  },
    function () {
      burger.animate({ d: simpleCupPoints }, 1000, mina.bounce);
    });
});

/* "Stuur een postduif" E-mail kopieer knop */
function copy() {
  var henk = navigator.clipboard.writeText("verwaalrick@gmail.com");
  var tooltip = document.getElementsByClassName("copyconfirm");
  for (var i = 0, length = tooltip.length; i < length; i++) {
    tooltip[i].style.opacity = '1';
    tooltip[i].style.top = '100px';
  }
}
