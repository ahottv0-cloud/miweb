const DESTINATION_ADDRESS = 'Huácar Stay, Huácar, Huánuco, Perú';

function setCurrentYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function initCountdown() {
  const label = document.getElementById('countdownLabel');
  const yearEl = document.getElementById('countdownYear');
  if (!label || !yearEl) return;

  const now = new Date();
  const targetYear = now.getFullYear() + 1;
  yearEl.textContent = targetYear;
  const target = new Date(`${targetYear}-09-28T00:00:00`);

  function update() {
    const t = target - new Date();
    if (t <= 0) {
      label.textContent = '¡Llegó el día!';
      clearInterval(timer);
      return;
    }
    const d = Math.floor(t / (1000 * 60 * 60 * 24));
    const h = Math.floor((t / (1000 * 60 * 60)) % 24);
    const m = Math.floor((t / (1000 * 60)) % 60);
    const s = Math.floor((t / 1000) % 60);
    label.textContent = `${d}d ${h}h ${m}m ${s}s`;
  }

  update();
  const timer = setInterval(update, 1000);
}

function buildMapUrls(origin) {
  const originClean = origin?.trim();
  const searchTerm = originClean
    ? `${originClean} a ${DESTINATION_ADDRESS}`
    : DESTINATION_ADDRESS;

  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(searchTerm)}&output=embed`;
  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(DESTINATION_ADDRESS)}${originClean ? `&origin=${encodeURIComponent(originClean)}` : ''}`;

  return { embedSrc, mapsLink };
}

function initRouteSection() {
  const originInput = document.getElementById('originInput');
  const mapsLinkEl = document.getElementById('mapsLink');
  const mapFrame = document.getElementById('mapFrame');
  const geoButton = document.getElementById('geoButton');
  const updateButton = document.getElementById('updateRoute');

  if (!originInput || !mapsLinkEl || !mapFrame || !geoButton || !updateButton) return;

  const updateMap = () => {
    const { embedSrc, mapsLink } = buildMapUrls(originInput.value);
    mapFrame.src = embedSrc;
    mapsLinkEl.href = mapsLink;
  };

  const restoreGeoButton = () => {
    geoButton.disabled = false;
    geoButton.textContent = 'Usar mi ubicación';
  };

  const useGeolocation = () => {
    if (!('geolocation' in navigator)) {
      alert('La geolocalización no está disponible en este dispositivo.');
      return;
    }

    geoButton.disabled = true;
    geoButton.textContent = 'Obteniendo ubicación...';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        originInput.value = coords;
        updateMap();
        restoreGeoButton();
      },
      (error) => {
        console.error('Error obteniendo la ubicación', error);
        alert('No pudimos acceder a tu ubicación. Revisa los permisos del navegador.');
        restoreGeoButton();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  geoButton.addEventListener('click', useGeolocation);
  updateButton.addEventListener('click', updateMap);
  originInput.addEventListener('input', () => {
    // Refrescamos la vista del mapa en tiempo real, pero sin forzar a los usuarios en conexiones lentas
    // a esperar un botón aparte.
    updateMap();
  });

  updateMap();
}

document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  initCountdown();
  initRouteSection();
});
