const stationLinks = {
  'avonhill-box': '../../Pages/Avonhill/Avonhill.html',
  'belmond-green-box': '../../Pages/Belmond Green/Belmond_Green.html',
  'leaton-box': '../../Pages/Leaton/Leaton.html',
  'norrington-box': '../../Pages/Norrington/Norrington.html',
  'mill-bridge-box': '../../Pages/Mill Bridge/Mill_Bridge.html',
  'cuffley-box': '../../Pages/Cuffley/Cuffley.html'
};

document.querySelectorAll('.station-box').forEach(box => {
  box.addEventListener('click', () => {
    const link = Object.entries(stationLinks).find(([cls]) => box.classList.contains(cls));
    if (link) window.location.href = link[1];
  });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      box.click();
    }
  });
});