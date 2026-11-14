'use strict';

const prefix = 'integration-lab:' + self.registration.scope + ':';
const cacheName = prefix + 'v2';
const shell = new URL('index.html', self.registration.scope).href;
const assets = ['./index.html', './practice-bank.js', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './course-template.json']
  .map(path => new URL(path, self.registration.scope).href);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache =>
    cache.addAll(assets.map(url => new Request(url, {cache:'reload'})))));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith(prefix) && key !== cacheName)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const {request} = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (!url.href.startsWith(self.registration.scope)) return;
  if (request.mode === 'navigate' && (url.pathname === new URL(self.registration.scope).pathname ||
      url.pathname === new URL(shell).pathname)) {
    event.respondWith(caches.open(cacheName).then(cache => cache.match(shell)).then(response => response || fetch(request)));
  } else if (assets.includes(url.href)) {
    event.respondWith(caches.open(cacheName).then(cache => cache.match(request)).then(response => response || fetch(request)));
  }
});
