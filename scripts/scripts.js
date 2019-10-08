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
//Asking for permission with the Notification API
if (typeof Notification !== typeof undefined) { //First check if the API is available in the browser
  Notification.requestPermission().then(function (result) {
    //If accepted, then save subscriberinfo in database
    if (result === "granted") {
      console.log("Browser: User accepted receiving notifications, save as subscriber data!");
      navigator.serviceWorker.ready.then(function (serviceworker) { //When the Service Worker is ready, generate the subscription with our Serice Worker's pushManager and save it to our list
        const VAPIDPublicKey = "BM8wFLc9CZMHQ3ztzyARv_zXlZNCvRlSKIXQAJs3V9BmpjcBQSHnmf75hUDAqAffitemahu-cMSJN-bagGiXWl8"; // Fill in your VAPID publicKey here
        const options = { applicationServerKey: VAPIDPublicKey, userVisibleOnly: true } //Option userVisibleOnly is neccesary for Chrome
        serviceworker.pushManager.subscribe(options).then((subscription) => {
          //POST the generated subscription to our saving script (this needs to happen server-side, (client-side) JavaScript can't write files or databases)
          let subscriberFormData = new FormData();
          subscriberFormData.append("json", JSON.stringify(subscription));
          console.log("test");
          fetch("data/saveSubscription.php", { method: "POST", body: subscriberFormData });
        });
      });
    }
  }).catch((error) => {
    console.log(error);
  });
}


/* Menu shizzle */
function openNav() {
  document.getElementById("myNav").style.width = "100%";
  var element = document.getElementById("xd");
  element.classList.toggle("overlay-closed");
  element.classList.toggle("overlay-open");
}
/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  var element = document.getElementById("xd");
  element.classList.toggle("overlay-open");
  element.classList.toggle("overlay-closed");
}
/* Hamburgah */
var intViewportHeight = window.innerHeight;
var intWebsiteHeight = document.body.clientHeight;
window.onscroll = () => {
  const nav = document.querySelector('#burger');
  if (this.scrollY <= intViewportHeight * 2) { nav.className = ''; }
  else if (this.scrollY == intWebsiteHeight - intViewportHeight) { nav.className = ''; }
  else { nav.className = 'scroll'; }
};

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

/* Duifmeneer */
function copy() {
  var copyText = document.getElementById("myInput");
  copyText.type = 'text';
  copyText.select();
  document.execCommand("copy");
  copyText.type = 'hidden';
  var tooltip = document.getElementsByClassName("copyconfirm");
  for (var i = 0, length = tooltip.length; i < length; i++) {
    tooltip[i].style.opacity = '1';
    tooltip[i].style.top = '100px';
  }
}