const state = {
  mode: "story",
  currentIndex: -1,
  visited: new Set(),
  moving: false,
  activeLayers: [],
  completedRouteLayers: [],
};

const memories = [...JOURNEY.memories].sort((a, b) => a.order - b.order);
const panel = document.getElementById("memoryPanel");
const glovebox = document.getElementById("gloveboxPanel");
const chapterTwo = document.getElementById("chapterTwo");
const homeFinale = document.getElementById("homeFinale");
const speech = document.getElementById("speechBubble");

const map = L.map("map", { preferCanvas: false }).setView(
  JOURNEY.startCenter,
  JOURNEY.startZoom,
);

map.createPane("completedRouteHalo");
map.getPane("completedRouteHalo").style.zIndex = 415;
map.createPane("completedRouteCore");
map.getPane("completedRouteCore").style.zIndex = 420;
map.createPane("activeRouteHalo");
map.getPane("activeRouteHalo").style.zIndex = 425;
map.createPane("activeRouteCore");
map.getPane("activeRouteCore").style.zIndex = 430;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

function makeIcon(className, html, size = [34, 34]) {
  return L.divIcon({
    className: "",
    html: `<div class="${className}">${html}</div>`,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
  });
}

JOURNEY.landmarks.forEach((landmark) => {
  L.marker(landmark.coords, {
    icon: makeIcon("landmark-marker", landmark.icon, [26, 26]),
  })
    .addTo(map)
    .bindTooltip(landmark.name);
});

const memoryMarkers = new Map();

memories.forEach((memory, index) => {
  const marker = L.marker(memory.coords, {
    icon: makeIcon("memory-marker locked", memory.icon),
    zIndexOffset: 500,
  })
    .addTo(map)
    .bindTooltip(memory.place);

  marker.on("click", () => {
    const unlocked =
      state.mode === "explore" ||
      state.visited.has(memory.id) ||
      index === state.currentIndex + 1;

    if (unlocked) {
      travelTo(index);
    } else {
      toast("Complete the earlier stops first 🚗");
    }
  });

  memoryMarkers.set(memory.id, marker);
});

const carHTML = `
  <span class="car-click-hint">📸</span>
  <div class="car-people">
    <img src="assets/photos/me-face.png" alt="Me" onerror="this.style.display='none'">
    <img src="assets/photos/sister-face.png" alt="My sister" onerror="this.style.display='none'">
  </div>
  <div class="car-body">🚗</div>
`;

const car = L.marker(memories[0].coords, {
  icon: makeIcon("car-marker", carHTML, [78, 78]),
  zIndexOffset: 1500,
  interactive: true,
  keyboard: true,
}).addTo(map);

car.bindTooltip("Click the car for road memories", {
  direction: "top",
  offset: [0, -26],
});

car.on("click", (event) => {
  L.DomEvent.stopPropagation(event);
  openCarMemory();
});

function refreshMarkers() {
  memories.forEach((memory, index) => {
    const visited = state.visited.has(memory.id);
    const unlocked =
      state.mode === "explore" || visited || index === state.currentIndex + 1;

    const className = [
      "memory-marker",
      visited ? "visited" : "",
      unlocked ? "" : "locked",
      memory.isHome && visited ? "home-glow" : "",
    ]
      .filter(Boolean)
      .join(" ");

    memoryMarkers.get(memory.id).setIcon(makeIcon(className, memory.icon));
  });

  const visitedCount = state.visited.size;
  document.getElementById("progressText").textContent =
    `${visitedCount} / ${memories.length} memories`;
  document.getElementById("progressBar").style.width = `${
    (visitedCount / memories.length) * 100
  }%`;
  document.getElementById("modeLabel").textContent =
    state.mode === "story" ? "Story mode" : "Explore mode";
  document.getElementById("gloveboxCount").textContent = visitedCount;
}

function setCarMoving(moving) {
  const markerElement = car.getElement();

  if (!markerElement) return;

  markerElement.classList.toggle("car-is-moving", moving);

  const innerCar = markerElement.querySelector(".car-marker");

  if (innerCar) {
    innerCar.classList.toggle("is-moving", moving);
  }
}

function haversineKm(a, b) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

function densifyRoute(route, maxSegmentKm = 0.015) {
  const dense = [route[0]];

  for (let index = 1; index < route.length; index++) {
    const start = route[index - 1];
    const end = route[index];
    const segmentKm = haversineKm(start, end);
    const steps = Math.max(1, Math.ceil(segmentKm / maxSegmentKm));

    for (let step = 1; step <= steps; step++) {
      const ratio = step / steps;
      dense.push([
        start[0] + (end[0] - start[0]) * ratio,
        start[1] + (end[1] - start[1]) * ratio,
      ]);
    }
  }

  return dense;
}

async function fetchRoadRoute(from, to) {
  const cacheKey = `route-v3:${from[0].toFixed(6)},${from[1].toFixed(
    6,
  )}:${to[0].toFixed(6)},${to[1].toFixed(6)}`;

  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const coordinates = `${from[1]},${from[0]};${to[1]},${to[0]}`;
  const routeURL =
    `https://router.project-osrm.org/route/v1/driving/${coordinates}` +
    `?overview=full&geometries=geojson&steps=false&continue_straight=false`;

  try {
    const response = await fetch(routeURL);
    if (!response.ok) {
      throw new Error(`Routing HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawCoordinates = data.routes?.[0]?.geometry?.coordinates;

    if (!rawCoordinates?.length) {
      throw new Error("No road geometry returned");
    }

    const route = rawCoordinates.map(([longitude, latitude]) => [
      latitude,
      longitude,
    ]);

    const denseRoute = densifyRoute(route);
    localStorage.setItem(cacheKey, JSON.stringify(denseRoute));
    return denseRoute;
  } catch (error) {
    console.warn("Road routing unavailable. Using fallback.", error);

    const fallback = [];
    const steps = 160;
    for (let step = 0; step <= steps; step++) {
      const ratio = step / steps;
      fallback.push([
        from[0] + (to[0] - from[0]) * ratio,
        from[1] + (to[1] - from[1]) * ratio,
      ]);
    }
    return fallback;
  }
}

function clearActiveRoute() {
  state.activeLayers.forEach((layer) => map.removeLayer(layer));
  state.activeLayers = [];
}

function drawActiveRoute(route) {
  clearActiveRoute();

  const halo = L.polyline(route, {
    pane: "activeRouteHalo",
    color: "#ffffff",
    weight: 13,
    opacity: 0.95,
    className: "route-active-halo",
    interactive: false,
  }).addTo(map);

  const core = L.polyline(route, {
    pane: "activeRouteCore",
    color: "#ffd1bf",
    weight: 5,
    opacity: 1,
    className: "route-active-core",
    interactive: false,
  }).addTo(map);

  state.activeLayers = [halo, core];
}

function drawCompletedRoute(route) {
  const halo = L.polyline(route, {
    pane: "completedRouteHalo",
    color: "#ff8e5e",
    weight: 13,
    opacity: 0.42,
    className: "route-halo",
    interactive: false,
  }).addTo(map);

  const core = L.polyline(route, {
    pane: "completedRouteCore",
    color: "#d65335",
    weight: 5,
    opacity: 0.95,
    className: "route-core",
    interactive: false,
  }).addTo(map);

  state.completedRouteLayers.push(halo, core);
}

function showDialogue() {
  const dialogue =
    JOURNEY.dialogue[Math.floor(Math.random() * JOURNEY.dialogue.length)];

  speech.textContent = dialogue;
  speech.classList.remove("hidden");

  window.clearTimeout(showDialogue.timeout);
  showDialogue.timeout = window.setTimeout(() => {
    speech.classList.add("hidden");
  }, 3000);
}

async function animateCarAlongRoute(route) {
  state.moving = true;
  setCarMoving(true);
  drawActiveRoute(route);
  showDialogue();

  map.flyToBounds(L.latLngBounds(route).pad(0.18), {
    duration: 1,
    maxZoom: 15,
  });

  const totalDistance = route
    .slice(1)
    .reduce((sum, point, index) => sum + haversineKm(route[index], point), 0);

  const durationMs = Math.min(
    14000,
    Math.max(6000, 5500 + totalDistance * 160),
  );

  const startTime = performance.now();
  const segmentDistances = [];
  let cumulativeDistance = 0;

  for (let index = 1; index < route.length; index++) {
    cumulativeDistance += haversineKm(route[index - 1], route[index]);
    segmentDistances.push(cumulativeDistance);
  }

  await new Promise((resolve) => {
    function frame(now) {
      const progress = Math.min(1, (now - startTime) / durationMs);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const targetDistance = cumulativeDistance * eased;
      let segmentIndex = segmentDistances.findIndex(
        (distance) => distance >= targetDistance,
      );

      if (segmentIndex === -1) {
        segmentIndex = route.length - 2;
      }

      const previousDistance =
        segmentIndex === 0 ? 0 : segmentDistances[segmentIndex - 1];
      const segmentDistance =
        segmentDistances[segmentIndex] - previousDistance || 1;
      const localRatio = (targetDistance - previousDistance) / segmentDistance;

      const start = route[segmentIndex];
      const end = route[segmentIndex + 1];

      car.setLatLng([
        start[0] + (end[0] - start[0]) * localRatio,
        start[1] + (end[1] - start[1]) * localRatio,
      ]);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });

  clearActiveRoute();
  drawCompletedRoute(route);
  setCarMoving(false);
  state.moving = false;
}

async function travelTo(index) {
  if (state.moving || index < 0 || index >= memories.length) {
    return;
  }

  closeMemoryPanel();

  const destination = memories[index];
  const current = car.getLatLng();
  const route = await fetchRoadRoute(
    [current.lat, current.lng],
    destination.coords,
  );

  await animateCarAlongRoute(route);

  state.currentIndex = index;
  state.visited.add(destination.id);
  refreshMarkers();

  if (destination.isHome) {
    car.setLatLng(destination.coords);

    map.flyTo(destination.coords, 17, {
      duration: 1.2,
    });

    await new Promise((resolve) => setTimeout(resolve, 1400));

    openHomeFinale();
    toast("Pune journey completed — Sister found ❤️");
  } else {
    openMemory(destination, index, false);
    toast(`Memory unlocked: ${destination.title}`);
  }
}

function renderMedia(items, type) {
  if (!items?.length) {
    return `<div class="empty-state">Add ${type} in memories.js when ready.</div>`;
  }

  return `<div class="media-grid">${items
    .map((item) => {
      if (type === "photos") {
        return `
          <figure>
            <img src="${item.src}" alt="${
              item.caption || "Memory photo"
            }" loading="lazy">
            <figcaption>${item.caption || ""}</figcaption>
          </figure>`;
      }

      return `
        <figure>
          <video controls playsinline preload="metadata" poster="${
            item.poster || ""
          }">
            <source src="${item.src}" type="${item.type || "video/mp4"}">
          </video>
          <figcaption>${item.caption || ""}</figcaption>
        </figure>`;
    })
    .join("")}</div>`;
}

function renderVoices(items) {
  if (!items?.length) {
    return '<div class="empty-state">Add voice notes later.</div>';
  }

  return items
    .map(
      (item) => `
        <div class="voice-card">
          <span>🎙️</span>
          <div style="width:100%">
            <strong>${item.title || "A note from me"}</strong>
            <audio controls src="${item.src}"></audio>
          </div>
        </div>`,
    )
    .join("");
}

function openMemory(memory, index, isCar) {
  document.getElementById("memoryTag").textContent = isCar
    ? "Click the car anytime"
    : memory.isHome
      ? "Final destination"
      : `Stop ${index + 1} of ${memories.length}`;

  document.getElementById("memoryTitle").textContent = memory.title;
  document.getElementById("memoryPlace").textContent = memory.place;
  document.getElementById("memoryStory").textContent = memory.story;
  document.getElementById("memoryQuote").textContent = memory.quote;
  document.getElementById("photosTab").innerHTML = renderMedia(
    memory.photos,
    "photos",
  );
  document.getElementById("videosTab").innerHTML = renderMedia(
    memory.videos,
    "videos",
  );
  document.getElementById("voiceTab").innerHTML = renderVoices(memory.voice);

  document.getElementById("backStopBtn").style.display = isCar ? "none" : "";
  document.getElementById("continueBtn").textContent = isCar
    ? "Back on the road"
    : index === memories.length - 1
      ? "There’s still one road..."
      : "Continue the journey";

  panel.dataset.car = isCar ? "1" : "0";
  panel.classList.add("open");

  selectTab(isCar && memory.videos?.length ? "videos" : "photos");
}

function openCarMemory() {
  if (state.moving) {
    toast("The car is moving — the road memories open when it stops 🚗");
    return;
  }

  openMemory(JOURNEY.carMemory, -1, true);
}

function closeMemoryPanel() {
  panel.classList.remove("open");
  document.querySelectorAll("video,audio").forEach((media) => media.pause());
}

function selectTab(tabName) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });

  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  document.getElementById(`${tabName}Tab`).classList.add("active");
}

function toast(message) {
  const achievement = document.getElementById("achievement");
  achievement.textContent = message;
  achievement.classList.add("show");
  window.setTimeout(() => achievement.classList.remove("show"), 2800);
}

function openHomeFinale() {
  homeFinale.classList.remove("hidden");
}

function closeHomeFinale() {
  homeFinale.classList.add("hidden");
}

function openChapterTwo() {
  closeHomeFinale();
  chapterTwo.classList.remove("hidden");

  const saved = localStorage.getItem("futureDestination");
  document.getElementById("savedFuturePlace").textContent = saved
    ? `Next destination saved: ${saved}`
    : "";
}

document.getElementById("startBtn").onclick = () => {
  intro.classList.add("hidden");
  app.classList.remove("hidden");

  window.setTimeout(() => {
    map.invalidateSize();
    travelTo(0);
  }, 100);
};

document.querySelectorAll("[data-close-panel]").forEach((element) => {
  element.onclick = closeMemoryPanel;
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.onclick = () => selectTab(tab.dataset.tab);
});

document.getElementById("continueBtn").onclick = () => {
  if (panel.dataset.car === "1") {
    closeMemoryPanel();
    return;
  }

  const nextIndex = state.currentIndex + 1;

  if (nextIndex < memories.length) {
    travelTo(nextIndex);
  } else {
    openHomeFinale();
  }
};

document.getElementById("backStopBtn").onclick = () => {
  travelTo(Math.max(0, state.currentIndex - 1));
};

document.getElementById("storyModeBtn").onclick = () => {
  state.mode = "story";
  refreshMarkers();
};

document.getElementById("exploreModeBtn").onclick = () => {
  state.mode = "explore";
  refreshMarkers();
  toast("Click any memory to travel there");
};

document.getElementById("homeBtn").onclick = () => {
  state.mode = "explore";
  refreshMarkers();

  const homeIndex = memories.findIndex(
    (memory) => memory.id === JOURNEY.homeId,
  );

  travelTo(homeIndex);
};

document.getElementById("randomBtn").onclick = () => {
  state.mode = "explore";
  refreshMarkers();

  const choices = memories
    .map((_, index) => index)
    .filter((index) => index !== state.currentIndex);

  travelTo(choices[Math.floor(Math.random() * choices.length)]);
};

document.getElementById("gloveboxBtn").onclick = () => {
  const unlockedMemories = memories.filter((memory) =>
    state.visited.has(memory.id),
  );

  document.getElementById("gloveboxGrid").innerHTML =
    unlockedMemories.length > 0
      ? unlockedMemories
          .map(
            (memory) => `
              <button class="glovebox-item" data-id="${memory.id}">
                <strong>${memory.icon} ${memory.title}</strong>
                <span>${memory.place}</span>
              </button>`,
          )
          .join("")
      : '<div class="empty-state">Complete a stop first.</div>';

  document.querySelectorAll(".glovebox-item").forEach((button) => {
    button.onclick = () => {
      glovebox.classList.remove("open");
      state.mode = "explore";
      refreshMarkers();

      const index = memories.findIndex(
        (memory) => memory.id === button.dataset.id,
      );

      travelTo(index);
    };
  });

  glovebox.classList.add("open");
};

document.querySelectorAll("[data-close-glovebox]").forEach((element) => {
  element.onclick = () => glovebox.classList.remove("open");
});

document.getElementById("openHomeMemory").onclick = () => {
  closeHomeFinale();

  const homeIndex = memories.findIndex(
    (memory) => memory.id === JOURNEY.homeId,
  );

  openMemory(memories[homeIndex], homeIndex, false);
};

document.getElementById("openChapterTwo").onclick = openChapterTwo;
document.getElementById("closeHomeFinale").onclick = closeHomeFinale;

document.getElementById("saveFuturePlace").onclick = () => {
  const value = document.getElementById("futurePlace").value.trim();

  if (value) {
    localStorage.setItem("futureDestination", value);
    document.getElementById("savedFuturePlace").textContent =
      `Next destination saved: ${value}`;
  }
};

document.getElementById("closeChapterTwo").onclick = () => {
  chapterTwo.classList.add("hidden");
  state.mode = "explore";
  refreshMarkers();
  map.flyTo(JOURNEY.startCenter, JOURNEY.startZoom);
};

refreshMarkers();
