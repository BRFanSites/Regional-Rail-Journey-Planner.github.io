// Announcement Board JS - rewritten from scratch

let currentReason = '';
let currentStationWithPoints = '';
let currentPlatform = '';

function getVoices(callback) {
  // Wait for voices to be loaded
  let voices = window.speechSynthesis.getVoices();
  if (voices.length) {
    callback(voices);
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      callback(window.speechSynthesis.getVoices());
    };
  }
}

function speakText() {
  try {
    let time = document.getElementById('time').textContent;
    if (time === '00:00') {
      time = 'midnight';
    } else if (time.startsWith('00:')) {
      const minute = time.substring(3, 5);
      time = `midnight ${minute}`;
    } else {
      const hour = parseInt(time.substring(0, 2));
      const minute = time.substring(3, 5);
      const formattedHour = hour < 10 ? `oh ${hour}` : hour;
      const formattedMinute = minute.startsWith('0') ? `oh ${minute.substring(1)}` : minute;
      time = minute === '00' ? `${formattedHour} hundred` : `${formattedHour} ${formattedMinute}`;
    }

    const destination = document.getElementById('destination').textContent;
    let callingPoints = document.getElementById('calling-points').textContent;
    let callingPointsForTTS = callingPoints;
    if (callingPoints.endsWith(' and ' + destination)) {
      callingPointsForTTS = callingPoints.slice(0, -(' and '.length + destination.length));
    }
    const status = document.getElementById('status').textContent;
    const platform = document.getElementById('platform').textContent.replace('Platform ', '').trim() || currentPlatform || '';
    let message = '';
    let nextTrainMessage = '';

    // Status logic
    if (status === 'On Time') {
      nextTrainMessage = `The next train to depart from platform ${platform} is the ${time} to ${destination}, calling at ${callingPointsForTTS} and ${destination}.`;
    } else if (status.startsWith('Delayed')) {
      let expectedTime = '';
      const match = status.match(/Delayed\s*-\s*(\d{2}:\d{2})/);
      if (match) expectedTime = match[1];
      if (currentReason) {
        if (currentReason === 'a points failure') {
          const locationMessage = currentStationWithPoints !== 'that is currently under investigation'
            ? `at ${currentStationWithPoints}`
            : 'that is currently under investigation somewhere on the network';
          if (expectedTime) {
            message = `May I have your attention please on platform ${platform}. We are sorry that the ${time} to ${destination}, is now expected to arrive at ${expectedTime}. This is due to a points failure ${locationMessage}. We apologise for this late running, and the inconvenience this may cause you.`;
          } else {
            message = `May I have your attention please on platform ${platform}. We are sorry that the ${time} to ${destination}, is delayed due to a points failure ${locationMessage}. We apologise for this late running, and the inconvenience this may cause you.`;
          }
        } else if (['trespassers on the track', 'a signal failure'].includes(currentReason)) {
          const pointsArr = callingPointsForTTS.split(',').map(point => point.trim());
          const randomCallingPoint = pointsArr.length ? pointsArr[Math.floor(Math.random() * pointsArr.length)] : '';
          if (expectedTime) {
            message = `May I have your attention please on platform ${platform}. We are sorry that the ${time} to ${destination}, is now expected to arrive at ${expectedTime}. This is due to ${currentReason} at ${randomCallingPoint}. We apologise for this late running, and the inconvenience this may cause you.`;
          } else {
            message = `May I have your attention please on platform ${platform}. We are sorry that the ${time} to ${destination}, is delayed due to ${currentReason} at ${randomCallingPoint}. We apologise for this late running, and the inconvenience this may cause you.`;
          }
        } else {
          if (expectedTime) {
            message = `May I have your attention please on platform ${platform}. We are sorry that the ${time} to ${destination}, is now expected to arrive at ${expectedTime}. This is due to ${currentReason}. We apologise for this late running, and the inconvenience this may cause you.`;
          } else {
            message = `May I have your attention please on platform ${platform}. We are sorry that the ${time} to ${destination}, is delayed due to ${currentReason}. We apologise for this late running, and the inconvenience this may cause you.`;
          }
        }
      }
    } else if (status === 'Cancelled') {
      // Fix: Always set a message for cancelled, even if currentReason is empty
      let cancelReason = '';
      if (currentReason) {
        if (currentReason === 'a points failure') {
          cancelReason = `This is due to a points failure at ${currentStationWithPoints}.`;
        } else if (['trespassers on the track', 'a signal failure'].includes(currentReason)) {
          const pointsArr = callingPointsForTTS.split(',').map(point => point.trim());
          const randomCallingPoint = pointsArr.length ? pointsArr[Math.floor(Math.random() * pointsArr.length)] : '';
          cancelReason = `This is due to ${currentReason} at ${randomCallingPoint}.`;
        } else {
          cancelReason = `This is due to ${currentReason}.`;
        }
      }
      message = `May I have your attention please on platform ${platform}. We are sorry to announce that the ${time} to ${destination}, has been cancelled. ${cancelReason} We apologise for the disruption to your journey today.`;
    } else {
      // Fallback for any other status (including blank/unknown)
      message = `May I have your attention please on platform ${platform}. The ${time} to ${destination} is currently showing status: ${status}. Please listen for further announcements.`;
    }

    // All announcements use TTS (SpeechSynthesisUtterance)
    function speakWhenVoicesReady(utterance) {
      window.speechSynthesis.cancel();
      getVoices(voices => {
        let voice = voices.find(v => v.lang === 'en-GB' && v.name && v.name.toLowerCase().includes('female')) ||
                    voices.find(v => v.lang === 'en-GB');
        if (voice) utterance.voice = voice;
        utterance.lang = 'en-GB';
        utterance.rate = 0.7;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      });
    }

    if (nextTrainMessage) {
      const nextTrainUtterance = new SpeechSynthesisUtterance(nextTrainMessage);
      speakWhenVoicesReady(nextTrainUtterance);
    }
    if (message) {
      const utterance = new SpeechSynthesisUtterance(message);
      speakWhenVoicesReady(utterance);
    }
  } catch (error) {
    console.error('Error speaking text:', error);
  }
}

setInterval(speakText, 300000);
window.testTTS = function() { speakText(); };

// CLOCK
function updateClock() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  document.getElementById('hour-tens').textContent = Math.floor(h / 10);
  document.getElementById('hour-ones').textContent = h % 10;
  document.getElementById('minute-tens').textContent = Math.floor(m / 10);
  document.getElementById('minute-ones').textContent = m % 10;
  document.getElementById('second-tens').textContent = Math.floor(s / 10);
  document.getElementById('second-ones').textContent = s % 10;
}
setInterval(updateClock, 1000);
updateClock();

// BOARD LOGIC
let selectedStation = 'Avonhill';

function randomizeCallingPoints(destinations) {
  const randomizedDestinations = destinations.destinations.slice().sort(() => Math.random() - 0.5);
  randomizedDestinations.forEach(destination => {
    const services = destination.services.slice().sort(() => Math.random() - 0.5);
    destination.services = services;
    destination.services.forEach(service => {
      const callingPoints = service.callingPoints;
      const exceptions = service.exceptions;
      const randomizedCallingPoints = [];
      const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' });
      callingPoints.forEach((callingPoint) => {
        if (typeof callingPoint === 'object') {
          if (callingPoint.daysOfOperation && callingPoint.daysOfOperation.includes(dayOfWeek)) {
            randomizedCallingPoints.push(callingPoint.name);
          } else if (!callingPoint.daysOfOperation) {
            randomizedCallingPoints.push(callingPoint.name);
          }
        } else {
          if (exceptions && exceptions[callingPoint] !== undefined) {
            if (exceptions[callingPoint] === false) {
            } else if (exceptions[callingPoint] === true) {
              randomizedCallingPoints.push(callingPoint);
            } else if (typeof exceptions[callingPoint] === 'number') {
              if (Math.random() < exceptions[callingPoint]) {
                randomizedCallingPoints.push(callingPoint);
              }
            } else {
              randomizedCallingPoints.push(callingPoint);
            }
          } else {
            randomizedCallingPoints.push(callingPoint);
          }
        }
      });
      service.randomizedCallingPoints = randomizedCallingPoints;
    });
  });
  return randomizedDestinations;
}

function getRandomStatus() {
  const statuses = ["On Time", "Delayed", "Random Time", "Cancelled"];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  const status = statuses[randomIndex];
  if (status === "Random Time") {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomHours = Math.floor(Math.random() * 2);
    let newM = (m + randomMinutes) % 60;
    let newH = (h + randomHours + Math.floor((m + randomMinutes) / 60)) % 24;
    if (newH === 24) newH = 0;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  } else {
    return status;
  }
}

function updateDepartureBoard(data) {
  const randomizedDestinations = randomizeCallingPoints(data);
  const service = randomizedDestinations[0].services[0];

  // Platform logic
  const platformsByStation = {
    'Leaton': { '1': { maxCoaches: 12 }, '2': { maxCoaches: 12 }, '3': { maxCoaches: 8 }, '4': { maxCoaches: 8 }, '5': { maxCoaches: 12 } },
    'Avonhill': { '1': { maxCoaches: 12 }, '2': { maxCoaches: 12 }, '3': { maxCoaches: 12 }, '4': { maxCoaches: 12 }, '5': { maxCoaches: 12 }, '6': { maxCoaches: 12 }, '7': { maxCoaches: 12 }, '8': { maxCoaches: 12 }, '9': { maxCoaches: 12 }, '10': { maxCoaches: 12 }, '11': { maxCoaches: 12 }, '12': { maxCoaches: 12 }, '13': { maxCoaches: 12 }, '14': { maxCoaches: 12 }, '15': { maxCoaches: 12 }, '16': { maxCoaches: 12 } },
    'Mill Bridge': { '1': { maxCoaches: 12 }, '2': { maxCoaches: 12 }, '4': { maxCoaches: 12 } },
    'Norrington': { '1': { maxCoaches: 12 }, '2': { maxCoaches: 6 }, '3': { maxCoaches: 6 }, '4': { maxCoaches: 12 } },
    'Cuffley': { '1': { maxCoaches: 12 }, '2': { maxCoaches: 12 }, '3': { maxCoaches: 12 } },
    'Belmond Green': { '1': { maxCoaches: 12 }, '2': { maxCoaches: 12 }, '3': { maxCoaches: 8 }, '4': { maxCoaches: 8 } }
  };
  const selectedStation = document.getElementById("station-select").value;
  const platforms = platformsByStation[selectedStation];
  const platformKeys = Object.keys(platforms);
  const numCoaches = service.coachNumbers[Math.floor(Math.random() * service.coachNumbers.length)];
  const validPlatforms = platformKeys.filter(platformKey => platforms[platformKey].maxCoaches >= numCoaches);
  currentPlatform = validPlatforms.length > 0
    ? validPlatforms[Math.floor(Math.random() * validPlatforms.length)]
    : 'Unknown';

  // DOM
  const destinationSpan = document.getElementById('destination');
  const departureTimeSpan = document.getElementById('time');
  const callingPointsSpan = document.getElementById('calling-points');
  const statusSpan = document.getElementById('status');
  const platformSpan = document.getElementById('platform');

  destinationSpan.textContent = randomizedDestinations[0]?.name || 'Unknown';
  if (platformSpan) platformSpan.textContent = currentPlatform !== 'Unknown' ? `Platform ${currentPlatform}` : 'Platform';

  // Generate a random time within the next hour
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let randomMinutes = Math.floor(Math.random() * 60);
  let depMinutes = minutes + randomMinutes;
  if (depMinutes >= 60) {
    hours += Math.floor(depMinutes / 60);
    depMinutes %= 60;
  }
  if (hours >= 24) hours -= 24;
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(depMinutes).padStart(2, '0');
  const newTime = `${formattedHours}:${formattedMinutes}`;
  departureTimeSpan.textContent = newTime;

  // Show calling points (add "and destination" at the end)
  if (service.randomizedCallingPoints && service.randomizedCallingPoints.length > 0) {
    callingPointsSpan.textContent = service.randomizedCallingPoints.join(', ') + ' and ' + (randomizedDestinations[0]?.name || 'Unknown');
  } else if (service.callingPoints && service.callingPoints.length > 0) {
    callingPointsSpan.textContent = service.callingPoints.join(', ') + ' and ' + (randomizedDestinations[0]?.name || 'Unknown');
  } else {
    callingPointsSpan.textContent = 'No calling points';
  }

  // Status
  const statusOptions = ['On Time', 'Delayed', 'Cancelled'];
  let randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  statusSpan.textContent = randomStatus;

  // If delayed, add a reason and new expected time
  if (randomStatus === 'Delayed') {
    const delayReasons = [
      'a points failure', 'a signal failure', 'trespassers on the track',
      'damage to overhead line equipment', 'staff shortages', 'severe weather conditions'
    ];
    currentReason = delayReasons[Math.floor(Math.random() * delayReasons.length)];
    const delayMinutes = Math.floor(Math.random() * 60) + 1;
    const depTime = new Date();
    depTime.setHours(hours, depMinutes, 0, 0);
    const newExpectedTime = new Date(depTime.getTime() + delayMinutes * 60000);
    const expectedHour = newExpectedTime.getHours();
    const expectedMinute = newExpectedTime.getMinutes();
    const formattedExpectedHour = expectedHour.toString().padStart(2, '0');
    const formattedExpectedMinute = expectedMinute.toString().padStart(2, '0');
    const newExpectedTimeString = `${formattedExpectedHour}:${formattedExpectedMinute}`;
    statusSpan.textContent = `Delayed - ${newExpectedTimeString}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const stationSelect = document.getElementById('station-select');
  const statusElement = document.getElementById('status');
  stationSelect.value = selectedStation;
  statusElement.textContent = getRandomStatus();

  // Initial board load
  fetch('../../Pages/Avonhill/Avonhill.json')
    .then(response => response.json())
    .then(jsonData => {
      updateDepartureBoard(jsonData);
    })
    .catch(error => console.error('Error loading Avonhill.json:', error));

  // Listen for station changes
  stationSelect.addEventListener('change', () => {
    selectedStation = stationSelect.value || 'Avonhill';
    statusElement.textContent = getRandomStatus();
    let fetchPath = '';
    switch (selectedStation) {
      case 'Leaton':
        fetchPath = '../../Pages/Leaton/Leaton.json'; break;
      case 'Avonhill':
        fetchPath = '../../Pages/Avonhill/Avonhill.json'; break;
      case 'Mill Bridge':
        fetchPath = '../../Pages/Mill Bridge/Mill_Bridge.json'; break;
      case 'Norrington':
        fetchPath = '../../Pages/Norrington/Norrington.json'; break;
      case 'Cuffley':
        fetchPath = '../../Pages/Cuffley/Cuffley.json'; break;
      case 'Belmond Green':
        fetchPath = '../../Pages/Belmond Green/Belmond_Green.json'; break;
      default:
        return;
    }
    fetch(fetchPath, { headers: { 'Content-Type': 'application/json' } })
      .then(response => response.json())
      .then(jsonData => {
        updateDepartureBoard(jsonData);
      })
      .catch(error => console.error('Error loading ' + fetchPath + ':', error));
  });
});