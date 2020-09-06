 self.addEventListener('install', e => {
     console.log('service worker has been installed');
 })

 self.addEventListener('activate', e => {
     console.log('service worker has been activated');
 })

 self.addEventListener('fetch', e => {
     console.log('fetching data', e);
 })