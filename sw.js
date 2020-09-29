// imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const INMUTABLE_CACHE = 'inmutable-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

const APP_SHELL = [
  // '/', // En desarrollo
  '/pwa/index.html',
  '/pwa/css/style.css',
  '/pwa/img/favicon.ico',
  '/pwa/img/avatars/spiderman.jpg',
  '/pwa/img/avatars/hulk.jpg',
  '/pwa/img/avatars/wolverine.jpg',
  '/pwa/img/avatars/thor.jpg',
  '/pwa/img/avatars/ironman.jpg',
  '/pwa/js/app.js',
  '/pwa/js/sw-utils.js',
];

const APP_SHELL_INMUTABLE = [
  '/js/libs/jquery.js',
  '/css/animate.css',
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
];

self.addEventListener('install', (e) => {
  const staticCache = caches
    .open(STATIC_CACHE)
    .then((cache) => cache.addAll(APP_SHELL));
  const inmutableCache = caches
    .open(INMUTABLE_CACHE)
    .then((cache) => cache.addAll(APP_SHELL_INMUTABLE));
  e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('activate', (e) => {
  const deleteOldCache = caches.keys().then((keys) => {
    keys.forEach(
      (key) =>
        key !== STATIC_CACHE && key.includes('static') && caches.delete(key)
    );
  });
  e.waitUntil(deleteOldCache);
});

self.addEventListener('fetch', (e) => {
  const cacheResponse = caches
    .match(e.request)
    .then((res) =>
      res
        ? res
        : fetch(e.request).then((newResp) =>
            saveDinamicCache(DYNAMIC_CACHE, e.request, newResp)
          )
    );

  e.respondWith(cacheResponse);
});
