import stations from './station_names.json';

const startStationSelect = document.getElementById('start-station-select');
const endStationSelect = document.getElementById('end-station-select');

stations.forEach(station => {
  const startOption = document.createElement('option');
  startOption.value = station;
  startOption.text = station;
  startStationSelect.appendChild(startOption);

  const endOption = document.createElement('option');
  endOption.value = station;
  endOption.text = station;
  endStationSelect.appendChild(endOption);
});