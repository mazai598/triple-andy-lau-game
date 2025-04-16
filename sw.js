const CACHE_NAME = 'space-shooter-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/main.js',
    '/manifest.json',
    '/assets/fonts/pixel-font.ttf',
    '/assets/videos/menu_starfield.mp4',
    '/assets/videos/menu_starfield.webm',
    '/assets/sounds/bgm.mp3',
    '/assets/sounds/boss_warning.mp3',
    '/assets/sounds/explosion.mp3',
    '/assets/sounds/laser.mp3',
    '/assets/sounds/missile.mp3',
    '/assets/sounds/penta.mp3',
    '/assets/sounds/powerup.mp3',
    '/assets/sounds/shoot.mp3',
    '/assets/sounds/wave.mp3',
    '/assets/images/background.png',
    '/assets/images/boss_final.png',
    '/assets/images/boss_mid.png',
    '/assets/images/boss_mini.png',
    '/assets/images/boss_missile.png',
    '/assets/images/bullet.png',
    '/assets/images/bullet_laser.png',
    '/assets/images/bullet_penta.png',
    '/assets/images/bullet_wave.png',
    '/assets/images/enemy_bullet.png',
    '/assets/images/enemy_large.png',
    '/assets/images/enemy_medium.png',
    '/assets/images/enemy_small.png',
    '/assets/images/enemy_stealth.png',
    '/assets/images/explosion.png',
    '/assets/images/glow.png',
    '/assets/images/icon-192.png',
    '/assets/images/icon-512.png',
    '/assets/images/icon-maskable-192.png',
    '/assets/images/icon-maskable-512.png',
    '/assets/images/laser.png',
    '/assets/images/loading_bg.png',
    '/assets/images/muzzle_flash.png',
    '/assets/images/particle_trail.png',
    '/assets/images/player_sheet.png',
    '/assets/images/powerup_energy.png',
    '/assets/images/powerup_laser.png',
    '/assets/images/powerup_life.png',
    '/assets/images/powerup_penta.png',
    '/assets/images/powerup_wave.png',
    '/assets/images/thruster.png',
    '/assets/images/weapon_normal.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});