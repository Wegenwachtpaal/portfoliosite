const cacheName = "nattesokV1";
const appFiles = [
  "manifest.json",
  "scripts/scripts.js",
  "css/portfolio.css",
];


// Offline page troep
const CACHE_VERSION = 1;
let CURRENT_CACHES = {
  offline: 'offline-v' + CACHE_VERSION
};
const OFFLINE_URL = 'offline.html';

function createCacheBustedRequest(url) {
  let request = new Request(url, {cache: 'reload'});
  // See https://fetch.spec.whatwg.org/#concept-request-mode
  // This is not yet supported in Chrome as of M48, so we need to explicitly check to see
  // if the cache: 'reload' option had any effect.
  if ('cache' in request) {
    return request;
  }

  // If {cache: 'reload'} didn't have any effect, append a cache-busting URL parameter instead.
  let bustedUrl = new URL(url, self.location.href);
  bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
  return new Request(bustedUrl);
}
 // aah
self.addEventListener("install", (installing) => {
  console.log("Service Worker: I am being installed, hello world!");

    //Put important offline files in cache on installation of the service worker 
    installing.waitUntil(
      caches.open(cacheName).then((cache) => {
        console.log("Service Worker: Caching important offline files");
        return cache.addAll(appFiles);
      })
    );
    // Offline poep
    installing.waitUntil(
      // We can't use cache.add() here, since we want OFFLINE_URL to be the cache key, but
      // the actual URL we end up requesting might include a cache-busting parameter.
      fetch(createCacheBustedRequest(OFFLINE_URL)).then(function(response) {
        return caches.open(CURRENT_CACHES.offline).then(function(cache) {
          return cache.put(OFFLINE_URL, response);
        });
      })
    );

});


self.addEventListener("activate", (activating) => {
  console.log("Service Worker: All systems online, ready to go!");

  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  let expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names,
            // then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (fetching) => {
  console.log("Service Worker: User threw a ball, I need to fetch it!");
    // Offline poep
    if (fetching.request.mode === 'navigate' ||
    (fetching.request.method === 'GET' &&
     fetching.request.headers.get('accept').includes('text/html'))) {
  console.log('Handling fetch event for', fetching.request.url);

  fetching.respondWith(
    caches.match(fetching.request).then((response)=>{
      console.log("Service Worker: Fetching resource "+fetching.request.url);
      return response||fetch(fetching.request).then((response)=>{
        console.log("Service Worker: Resource "+fetching.request.url+" not available in cache");
        return caches.open(fetching).then((cache)=>{
            console.log("Service Worker: Caching (new) resource "+fetching.request.url);
            cache.put(fetching.request,response.clone());
          return response;
        });
      }).catch(function(){      
        console.log("Service Worker: Fetching online failed, HAALLPPPP!!!");
        //Do something else with the request (respond with a different cached file)
      })
    }),
    fetch(fetching.request).catch(error => {
      // The catch is only triggered if fetch() throws an exception, which will most likely
      // happen due to the server being unreachable.
      // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx
      // range, the catch() will NOT be called. If you need custom handling for 4xx or 5xx
      // errors, see https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/fallback-response
      console.log('Fetch failed; returning offline page instead.', error);
      return caches.match(OFFLINE_URL);
    })
  );

  }
});

self.addEventListener("push", (pushing) => {
  console.log("Service Worker: I received some push data, but because I am still very simple I don't know what to do with it :(");
  
  if(pushing.data){
    pushdata=JSON.parse(pushing.data.text());        
    console.log("Service Worker: I received this:",pushdata);
    if((pushdata["title"]!="")&&(pushdata["message"]!="")){           
      const options={ body:pushdata["message"] }
      self.registration.showNotification(pushdata["title"],options);
      console.log("Service Worker: I made a notification for the user");
    } else {
      console.log("Service Worker: I didn't make a notification for the user, not all the info was there :(");            
    }
  }
})