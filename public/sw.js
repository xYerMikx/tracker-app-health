const DB_NAME = 'water-reminder-db';
const DB_VERSION = 1;
const STORE = 'state';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function inQuietHours(date = new Date()) {
  const h = date.getHours();
  
  return h >= 23 || h < 8;
}

function getTodayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function mandatoryTimesFor(date = new Date()) {
  const base = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const times = [10, 14, 17, 20].map((h) => new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, 0, 0));

  return times.map((t) => t.getTime());
}

function randomNextBetween(minMinutes = 60, maxMinutes = 90, from = new Date()) {
  const delta = Math.floor(minMinutes * 60 * 1000 + Math.random() * (maxMinutes - minMinutes) * 60 * 1000);
  return new Date(from.getTime() + delta);
}

async function ensureState() {
  const todayKey = getTodayKey();
  let state = (await idbGet('state')) || {};
  if (state.today !== todayKey) {
    state = {
      today: todayKey,
      mandatory: mandatoryTimesFor(),
      firedMandatory: [],
      nextRandomAt: randomNextBetween(60, 90, new Date()).getTime(),
    };
    await idbSet('state', state);
  }
  return state;
}

async function showReminder(title, body) {
  const permission = await self.registration.showNotification ? 'granted' : 'denied';
  if (permission !== 'granted') return;
  try {
    await self.registration.showNotification(title, {
      body,
      icon: '/icons/water-192.svg',
      badge: '/icons/badge-72.svg',
      image: '/icons/water-192.svg', 
      vibrate: [120, 60, 120],
      tag: 'water-reminder',
      renotify: true,
      requireInteraction: true,
      actions: [
        { action: 'drink', title: 'Выпил', icon: '/icons/check-72.svg' },
        { action: 'later', title: 'Напомнить позже', icon: '/icons/clock-72.svg' },
      ],
    });
    const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientsList) {
      client.postMessage({ type: 'PLAY_SOUND' });
    }
  } catch (e) {
    // skip
  }
}

async function tick() {
  const now = new Date();
  if (inQuietHours(now)) return;  

  let state = await ensureState();

  for (const t of state.mandatory) {
    if (!state.firedMandatory.includes(t) && now.getTime() >= t) {
      await showReminder('Пора пить воду', 'Запланированное напоминание');
      state.firedMandatory.push(t);
    }
  }

  if (now.getTime() >= state.nextRandomAt) {
    await showReminder('Пора пить воду', 'Небольшой глоток – хорошая привычка');
    let next = randomNextBetween(60, 90, now);
    if (inQuietHours(next)) {
      const candidate = new Date(next);
      if (candidate.getHours() >= 23) {
        const nextDay = new Date(candidate.getFullYear(), candidate.getMonth(), candidate.getDate() + 1, 8, 0, 0);
        next = nextDay;
      } else {
        const sameDayMorning = new Date(candidate.getFullYear(), candidate.getMonth(), candidate.getDate(), 8, 0, 0);
        next = sameDayMorning;
      }
    }
    state.nextRandomAt = next.getTime();
  }

  await idbSet('state', state);
}

self.addEventListener('message', (event) => {
  const { type } = event.data || {};
  if (type === 'PING' || type === 'INIT') {
    tick();
  } else if (type === 'TEST') {
    showReminder('Тестовое уведомление', 'Это тестовое уведомление от сервис-воркера');
  }
});

self.addEventListener('install', (_event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  const action = event.action;
  event.notification.close();
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const url = '/';
    let visible = allClients.find(c => 'focus' in c);
    if (visible) {
      await visible.focus();
    } else if (self.clients.openWindow) {
      await self.clients.openWindow(url);
    }

    if (action === 'later') {
      try {
        const state = (await idbGet('state')) || {};
        const now = Date.now();
        const snoozed = now + 15 * 60 * 1000;
        state.nextRandomAt = Math.max(state.nextRandomAt || 0, snoozed);
        await idbSet('state', state);
      } catch {}
    }

    if (action === 'drink') {
      const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clientsList) client.postMessage({ type: 'ACK_DRINK' });
    }
  })());
});
