 const staticCacheName = 'static-site';
 const assets = [
     '/',
     '/index.html',
     '/js/index.js',
     '/js/app.js',
     '/css/style.css',
     '/img/bora_bora_bungalows-wallpaper-1024x768 (1).webp',
     '/img/energy.png',
     '/img/Ripple-1s-200px.gif',
     'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;600;800&display=swap',
     
     
 ]
 self.addEventListener('install', evt => {
    //  console.log('service worker has been installed');
    self.skipWaiting();
    evt.waitUntill(caches.open(staticCacheName)
    .then(cache => {
        console.log('caching assets');
        cache.addAll(assets);
    }))
    
 })

 self.addEventListener('activate', e => {
     console.log('service worker has been activated');
 })

 self.addEventListener('fetch', e => {
    //  console.log('fetching data', e);

    e.respondWith(
        caches.match(e.request)
        .then(cacheRes => {
            return cacheRes || fetch(e.request);
        })
    )
 })