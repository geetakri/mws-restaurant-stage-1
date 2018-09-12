
var CACHE_NAME = 'res-rev-app-cache-v1';
const cacheFiles = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
];

/**
*Install a service worker
*/
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(cacheFiles);
      })
  );
});


/**
*Cache and return requests on fetch event
*/
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('Found', event.request, 'in cache');
          return response;
        }
        else{
            //return fetch(event.request);
            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response.
            var fetchRequest = event.request.clone();
            console.log('Could not find', event.request, 'in cache, FETCHING!')
            return fetch(fetchRequest).then(function(response) {
                // Check if we received a valid response
                if(!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }

                // IMPORTANT: Clone the response. A response is a stream
                // and because we want the browser to consume the response
                // as well as the cache consuming the response, we need
                // to clone it so we have two streams.
                var clonedResponse = response.clone();

                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, clonedResponse);
                  });

                return response;
              }).catch(function(err){
                  console.log(err);
                })
          }
        })
      );
    });
