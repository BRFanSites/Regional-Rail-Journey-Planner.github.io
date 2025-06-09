// Get the current time
const currentTime = new Date();
const currentHours = currentTime.getHours();
const currentMinutes = currentTime.getMinutes();

const destinationsList = ['Syde-On-Sea', 'Victoria Docks', 'Ashdean', 'Mill Bridge', 'Norrington', 'Cuffley', 'StoneBrook Town'];
const departureTimes = [];
const trainDestinations = [];

let hours = currentHours;
let minutes = currentMinutes;

for (let i = 0; i < 6; i++) {
  if (i === 0) {
    hours = currentHours;
    minutes = currentMinutes + Math.floor(Math.random() * 59) + 1;
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes %= 60;
    }
    if (hours > 23) hours = 0;
  } else {
    const interval = Math.floor(Math.random() * 50) + 10;
    minutes += interval;
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes %= 60;
    }
    if (hours > 23) {
      hours = 5;
      minutes = 0;
    }
  }
  if (hours < 5) hours = 5;
  else if (hours > 23) hours = 23;

  let destination;
  do {
    destination = destinationsList[Math.floor(Math.random() * destinationsList.length)];
  } while (i > 0 && destination === trainDestinations[i - 1]);
  trainDestinations.push(destination);
  departureTimes.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
}

// Randomize calling points for each destination/service
function randomizeCallingPoints(destinationsData) {
  const randomizedDestinations = destinationsData.destinations.slice();
  randomizedDestinations.sort(() => Math.random() - 0.5);
  randomizedDestinations.forEach(destination => {
    const services = destination.services.slice();
    services.sort(() => Math.random() - 0.5);
    destination.services = services;
    destination.services.forEach(service => {
      const callingPoints = service.callingPoints;
      const exceptions = service.exceptions || {};
      const randomizedCallingPoints = [];
      const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' });
      callingPoints.forEach((callingPoint, index) => {
        if (typeof callingPoint === 'object') {
          if (callingPoint.daysOfOperation) {
            if (callingPoint.daysOfOperation.includes(dayOfWeek)) {
              randomizedCallingPoints.push(callingPoint.name);
            }
          } else {
            randomizedCallingPoints.push(callingPoint.name);
          }
        } else {
          if (exceptions[callingPoint] === false) {
            // never call at this station
          } else if (exceptions[callingPoint] === true) {
            randomizedCallingPoints.push(callingPoint);
          } else if (typeof exceptions[callingPoint] === 'number') {
            if (Math.random() < exceptions[callingPoint]) {
              randomizedCallingPoints.push(callingPoint);
            }
          } else {
            randomizedCallingPoints.push(callingPoint);
          }
        }
      });
      service.randomizedCallingPoints = randomizedCallingPoints.reverse();
    });
  });
  return randomizedDestinations;
}

let currentOffset = 0; // Timezone offset in hours
let baseDepartureTimes = []; // Store the original (UTC+0) times as minutes since midnight

// Helper to convert "HH:MM" to minutes since midnight
function timeStringToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Helper to convert minutes since midnight to "HH:MM"
function minutesToTimeString(minutes) {
  let h = Math.floor(minutes / 60) % 24;
  let m = minutes % 60;
  if (h < 0) h += 24;
  if (m < 0) m += 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// After generating departureTimes, store their base values
baseDepartureTimes = departureTimes.map(timeStringToMinutes);

fetch('Leaton.json')
  .then(response => response.json())
  .then(data => {
    const destinationsData = data;
    const randomizedDestinations = randomizeCallingPoints(destinationsData);

    function updateDisplayTimes() {
      const displays = document.querySelectorAll('.display-group');
      for (let i = 0; i < displays.length; i++) {
        const displayGroup = displays[i];
        const destinationSpan = displayGroup.querySelector('.destination');
        const departureTimeSpan = displayGroup.querySelector('.departure-time');
        const callingPointsSpan = displayGroup.querySelector('.calling-points-text span');

        // Find the destination object for the random destination
        const destName = trainDestinations[i];
        const destObj = randomizedDestinations.find(d => d.name === destName);

        if (destinationSpan) destinationSpan.textContent = destName || 'Unknown';

        // Adjust departure time for currentOffset
        if (departureTimeSpan && baseDepartureTimes[i] !== undefined) {
          let mins = baseDepartureTimes[i] + Math.round(currentOffset * 60);
          mins = ((mins % 1440) + 1440) % 1440;
          departureTimeSpan.textContent = minutesToTimeString(mins);
        }

        if (callingPointsSpan && destObj && destObj.services && destObj.services.length > 0) {
          const service = destObj.services[0];
          const callingPoints = service.randomizedCallingPoints || [];
          const serviceType = service.serviceType;
          const coachNumbers = service.coachNumbers;
          const numCoaches = coachNumbers[Math.floor(Math.random() * coachNumbers.length)];
          if (callingPoints.length === 0) {
            callingPointsSpan.textContent = `Only ${destName}. A ${serviceType} service formed of ${numCoaches} coaches.`;
          } else {
            callingPointsSpan.textContent = `${callingPoints.join(', ')} and ${destName}. A ${serviceType} service formed of ${numCoaches} coaches.`;
          }
        } else if (callingPointsSpan) {
          callingPointsSpan.textContent = '';
        }
      }
    }

    // Initial display
    updateDisplayTimes();

    setInterval(function () {
      const date = new Date();
      const adjustedTime = new Date(date.getTime() + currentOffset * 60 * 60 * 1000);
      const hours = adjustedTime.getUTCHours();
      const minutes = adjustedTime.getUTCMinutes();
      const seconds = adjustedTime.getUTCSeconds();

      const hoursTensFlaps = document.querySelectorAll('.hours-tens .flap');
      const hoursOnesFlaps = document.querySelectorAll('.hours-ones .flap');
      const minutesTensFlaps = document.querySelectorAll('.minutes-tens .flap');
      const minutesOnesFlaps = document.querySelectorAll('.minutes-ones .flap');
      const secondsTensFlaps = document.querySelectorAll('.seconds-tens .flap');
      const secondsOnesFlaps = document.querySelectorAll('.seconds-ones .flap');

      hoursTensFlaps.forEach(flap => flap.classList.remove('active'));
      hoursOnesFlaps.forEach(flap => flap.classList.remove('active'));
      minutesTensFlaps.forEach(flap => flap.classList.remove('active'));
      minutesOnesFlaps.forEach(flap => flap.classList.remove('active'));
      secondsTensFlaps.forEach(flap => flap.classList.remove('active'));
      secondsOnesFlaps.forEach(flap => flap.classList.remove('active'));

      const hoursTens = Math.floor(hours / 10);
      const hoursOnes = hours % 10;
      const minutesTens = Math.floor(minutes / 10);
      const minutesOnes = minutes % 10;
      const secondsTens = Math.floor(seconds / 10);
      const secondsOnes = seconds % 10;

      if (hoursTens >= 0 && hoursTens <= 2) hoursTensFlaps[hoursTens].classList.add('active');
      if (hoursOnes >= 0 && hoursOnes <= 9) hoursOnesFlaps[hoursOnes].classList.add('active');
      if (minutesTens >= 0 && minutesTens <= 5) minutesTensFlaps[minutesTens].classList.add('active');
      if (minutesOnes >= 0 && minutesOnes <= 9) minutesOnesFlaps[minutesOnes].classList.add('active');
      if (secondsTens >= 0 && secondsTens <= 5) secondsTensFlaps[secondsTens].classList.add('active');
      if (secondsOnes >= 0 && secondsOnes <= 9) secondsOnesFlaps[secondsOnes].classList.add('active');
    }, 1000);

    const timeZone = document.getElementById('Timezone');
    const timeZoneOffsets = {
      honolulu: -10,
      los_angeles: -8,
      denver: -7,
      chicago: -6,
      new_york: -5,
      london: 0,
      paris: 1,
      athens: 2,
      moscow: 3,
      dubai: 4,
      delhi: 5.5,
      bangkok: 7,
      beijing: 8,
      tokyo: 9,
      sydney: 10,
      auckland: 12,
    };

    timeZone.addEventListener('change', function () {
      const selectedStation = timeZone.value;
      currentOffset = timeZoneOffsets[selectedStation] || 0;
      updateDisplayTimes();
    });
  });