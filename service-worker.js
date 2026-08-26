const CACHE_NAME = "alkod-alwasit-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon.png",

    "./images/1.png",
    "./images/2.png",
    "./images/3.png"
];


self.addEventListener("install", event => {

    event.waitUntil(

        caches
            .open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(
                    FILES_TO_CACHE
                );

            })
            .then(() => {

                return self.skipWaiting();

            })

    );

});


self.addEventListener("activate", event => {

    event.waitUntil(

        caches
            .keys()
            .then(keys => {

                return Promise.all(

                    keys
                        .filter(
                            key => key !== CACHE_NAME
                        )
                        .map(
                            key => caches.delete(key)
                        )

                );

            })
            .then(() => {

                return self.clients.claim();

            })

    );

});


self.addEventListener("fetch", event => {

    event.respondWith(

        caches
            .match(event.request)
            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }

                return fetch(event.request);

            })
            .catch(() => {

                return caches.match(
                    "./index.html"
                );

            })

    );

});