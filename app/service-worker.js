const RETIRE_VERSION='2026-09-17-private-separation';

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('madyclear-personal-')).map(k=>caches.delete(k)));
    await self.clients.claim();
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    windows.forEach(client=>client.postMessage({type:'MADYCLEAR_SW_RETIRED',version:RETIRE_VERSION}));
    await self.registration.unregister();
  })());
});

// Le cockpit est désormais chargé derrière l’authentification privée.
// Aucun contenu applicatif n’est mis en cache par ce service worker de retrait.
self.addEventListener('fetch',()=>{});
