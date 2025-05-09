let currentReason = ''; // Declare currentReason here
let currentStationWithPoints = ''; // Declare currentStationWithPoints here
let currentPlatform = ''; // Declare currentPlatform here

function speakText() {
  try {
    let time = document.getElementById('time').textContent;
    const speakingTime = new Date().toLocaleTimeString();
    console.log('Speaking time:', speakingTime); // Logs the current time it speaks at
    // Format time for speech
    if (time === '00:00') {
      time = 'midnight';
    } else if (time.startsWith('00:')) {
      const minute = time.substring(3, 5);
      time = `midnight ${minute}`;
    } else {
      const hour = parseInt(time.substring(0, 2));
      const minute = time.substring(3, 5);
      const formattedHour = hour.toString().startsWith('0') ? `oh ${hour.toString().substring(1)}` : hour;
      const formattedMinute = minute.startsWith('0') ? `oh ${minute.substring(1)}` : minute;
      time = minute === '00' ? `${formattedHour} hundred` : `${formattedHour} ${formattedMinute}`;
    }

    const destination = document.getElementById('destination').textContent;
    const callingPoints = document.getElementById('calling-points').textContent;
    const status = document.getElementById('status').textContent;
    const serviceType = document.getElementById('calling-points').textContent.includes('service') 
      ? document.getElementById('calling-points').textContent.split('service')[0].trim().split(' ').pop() 
      : ''; // Extract serviceType from calling-points text

    let message = '';
    let nextTrainMessage = '';

    // Removed redundant currentTime declaration
    const departureTime = new Date();
    const [departureHour, departureMinute] = document.getElementById('time').textContent.split(':').map(Number);
    departureTime.setHours(departureHour, departureMinute, 0, 0);

    // Removed unused timeDifference calculation

    if (status === 'On Time') {
      const departureTime = new Date();
      departureTime.setHours(departureHour);
      departureTime.setMinutes(departureMinute);
      const currentTime = new Date();
      const timeDifference = (departureTime - currentTime) / 60000; // convert to minutes
    
      if (timeDifference > 1) { 
        nextTrainMessage = `The next train to depart from platform ${currentPlatform} is the ${time} to ${destination}, calling at ${callingPoints}`;
      } else {
        message = `Platform ${currentPlatform} for the ${time} to ${destination}, calling at ${callingPoints}.`;
      }
    } else if (status === 'Delayed') {
      if (currentReason) {
        if (currentReason === 'a points failure') {
          const locationMessage = currentStationWithPoints !== 'that is currently under investigation'
            ? `at ${currentStationWithPoints}`
            : 'that is currently under investigation somewhere on the network';
          message = `May I have your attention please on platform ${currentPlatform}. We are sorry that the ${time} to ${destination}, is delayed due to a points failure ${locationMessage}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        } else if (['trespassers on the track', 'a signal failure'].includes(currentReason)) {
          const randomCallingPoint = callingPoints.split(',').map(point => point.trim())[Math.floor(Math.random() * callingPoints.split(',').length)];
          message = `May I have your attention please on platform ${currentPlatform}. We are sorry that the ${time} to ${destination}, is delayed due to ${currentReason} at ${randomCallingPoint}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        } else if (['damage to overhead line equipment'].includes(currentReason) && !['Ashdean', 'Victoria Docks, Syde-on-Sea'].includes(destination)) {
          message = `May I have your attention please on platform ${currentPlatform}. We are sorry that the ${time} to ${destination}, is delayed due to ${currentReason}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        } else {
          message = `May I have your attention please on platform ${currentPlatform}. We are sorry that the ${time} to ${destination}, is delayed due to ${currentReason}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        }
      }
      } else if (status.match(/^\d{2}:\d{2}$/)) {
        const delayedTime = status.replace(':', ' ');
        if (currentReason) {
        if (currentReason === 'a points failure') {
          message = `May I have your attention please on platform ${currentPlatform}. We are sorry that the ${time} to ${destination}, is now expected to arrive at ${delayedTime}. This is due to a points failure  ${currentStationWithPoints}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        } else if (['trespassers on the track', 'a signal failure'].includes(currentReason)) {
          const randomCallingPoint = callingPoints.split(',').map(point => point.trim())[Math.floor(Math.random() * callingPoints.split(',').length)];
          message = `May I have your attention please on platform ${currentPlatform}. We are sorry that the ${time} to ${destination}, is now expected to arrive at ${delayedTime}. This is due to ${currentReason} at ${randomCallingPoint}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        } else if (['damage to overhead line equipment'].includes(currentReason) && !['Ashdean', 'Victoria Docks, Syde-on-Sea'].includes(destination)) {
          message = `May I have your attention please on platform ${currentPlatform}. We are sorry that the ${time} to ${destination}, is now expected to arrive at ${delayedTime}. This is due to ${currentReason}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        } else {
          message = `May I have your attention please on platform ${currentPlatform}. We are sorry that the ${time} to ${destination}, is now expected to arrive at ${delayedTime}. This is due to ${currentReason}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        }
        } 
      } else if (status === 'Cancelled') {
        if (currentReason) {
        if (currentReason === 'a points failure') {
          message = `May I have your attention please on platform ${currentPlatform}. We are sorry to announce that the ${time} ${serviceType} to ${destination}, has been cancelled. This is due to a points failure at ${currentStationWithPoints}. ${serviceType} apologises for the disruption to your journey today.`;
        } else if (['trespassers on the track', 'a signal failure'].includes(currentReason)) {
          const randomCallingPoint = callingPoints.split(',').map(point => point.trim())[Math.floor(Math.random() * callingPoints.split(',').length)];
          message = `May I have your attention please on platform ${currentPlatform}. We are sorry to announce that the ${time} ${serviceType} to ${destination}, has been cancelled. This is due to ${currentReason} at ${randomCallingPoint}. ${serviceType} apologises for the disruption to your journey today.`;
        } else if (['damage to overhead line equipment'].includes(currentReason) && !['Ashdean', 'Victoria Docks, Syde-on-Sea'].includes(destination)) {
          message = `May I have your attention please on platform ${currentPlatform}. We are sorry to announce that the ${time} ${serviceType} to ${destination}, has been cancelled. This is due to ${currentReason}. ${serviceType} apologises for the disruption to your journey today.`;
        } else {
          message = `May I have your attention please on platform ${currentPlatform}. We are sorry to announce that the ${time} ${serviceType} to ${destination}, has been cancelled. This is due to ${currentReason}. ${serviceType} apologises for the disruption to your journey today.`;
        }
      } 
      } 
    if (nextTrainMessage) {
      const nextTrainUtterance = new SpeechSynthesisUtterance(nextTrainMessage);
      const voice = window.speechSynthesis.getVoices().find(voice => voice.lang === 'en-GB' && voice.name.includes('Female'));
      nextTrainUtterance.voice = voice;
      nextTrainUtterance.lang = 'en-GB';
      nextTrainUtterance.rate = 0.7;
      nextTrainUtterance.pitch = 1;
      window.speechSynthesis.speak(nextTrainUtterance);
    }

    if (message) {
      const utterance = new SpeechSynthesisUtterance(message);
      const voice = window.speechSynthesis.getVoices().find(voice => voice.lang === 'en-GB' && voice.name.includes('Female'));
      utterance.voice = voice;
      utterance.lang = 'en-GB';
      utterance.rate = 0.7;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  } catch (error) {
    console.error('Error speaking text:', error);
  }
}

// Speak text every 5 minutes
setInterval(speakText, 300000);

window.testTTS = function() {
  speakText();
}

// Get the current time
const currentTime = new Date();
const currentHours = currentTime.getHours();
const currentMinutes = currentTime.getMinutes();

// Generate random destinations and departure times
const destinations = ['Avonhill', 'Syde-On-Sea', 'Ashdean', 'Victoria Docks', 'Mill Bridge', 'Norrington', 'Cuffley'];
const departureTimes = [];
const trainDestinations = [];

// Function to randomize calling points
function randomizeCallingPoints(destinations) {
  const randomizedDestinations = destinations.destinations.slice();
  randomizedDestinations.sort(() => Math.random() - 0.5);

  randomizedDestinations.forEach(destination => {
    const services = destination.services.slice();
    services.sort(() => Math.random() - 0.5);

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
            randomizedCallingPoints.push(callingPoint.name); // Ensure calling points without specific days are included
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
  const departureTime = document.getElementById('time').textContent;
  const departureHours = parseInt(departureTime.split(':')[0]);
  const departureMinutes = parseInt(departureTime.split(':')[1]);
  const randomHours = Math.floor(Math.random() * 2); // generate a random hour between 0 and 2
  const randomMinutes = Math.floor(Math.random() * 60); // generate a random minute between 0 and 59
  const newMinutes = (departureMinutes + randomMinutes) % 60; // ensure minutes are between 0 and 59
  const newHours = (departureHours + randomHours + Math.floor((departureMinutes + randomMinutes) / 60)) % 24; // add any extra hours and wrap around to 0 if necessary
  const formattedNewHours = newHours === 24 ? 0 : newHours; // Convert 24 to 0 for midnight
  const newTime = `${String(formattedNewHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  return newTime;
} else {
  return status;
}
}

const statusElement = document.getElementById('status');
statusElement.textContent = getRandomStatus();

const stationSelect = document.getElementById('station-select');
let selectedStation = 'Avonhill'; // Declare selectedStation here

// Auto update on page load
document.addEventListener('DOMContentLoaded', () => {
  stationSelect.value = selectedStation; // Set default station to Avonhill
  fetch('../../Pages/Avonhill/Avonhill.json')
    .then(response => response.json())
    .then(jsonData => {
      console.log('Avonhill.json loaded successfully.');
      updateDepartureBoard(jsonData);
    })
    .catch(error => console.error('Error loading Avonhill.json:', error));
});

// Get the selected station
stationSelect.addEventListener('change', () => {
  selectedStation = stationSelect.value; // Get the current value of the select element
  if (!selectedStation) { // If no value is selected, default to Avonhill
    selectedStation = 'Avonhill';
    stationSelect.value = selectedStation; // Update the select element's value
  }

  switch (selectedStation) {
    case 'Leaton':
      console.log('Loading Leaton.json...');
      fetch('../../Pages/Leaton/Leaton.json', { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(jsonData => {
          console.log('Leaton.json loaded successfully.');
          updateDepartureBoard(jsonData);
        })
        .catch(error => console.error('Error loading Leaton.json:', error));
      break;
    case 'Avonhill':
      console.log('Loading Avonhill.json...');
      fetch('../../Pages/Avonhill/Avonhill.json', { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(jsonData => {
          console.log('Avonhill.json loaded successfully.');
          updateDepartureBoard(jsonData);
        })
        .catch(error => console.error('Error loading Avonhill.json:', error));
      break;
    case 'Mill Bridge':
      console.log('Loading Mill_Bridge.json...');
      fetch('../../Pages/Mill Bridge/Mill_Bridge.json', { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(jsonData => {
          console.log('Mill_Bridge.json loaded successfully.');
          updateDepartureBoard(jsonData);
        })
        .catch(error => console.error('Error loading Mill_Bridge.json:', error));
      break;
    case 'Norrington':
      console.log('Loading Norrington.json...');
      fetch('../../Pages/Norrington/Norrington.json', { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(jsonData => {
          console.log('Norrington.json loaded successfully.');
          updateDepartureBoard(jsonData);
        })
        .catch(error => console.error('Error loading Norrington.json:', error));
      break;
    case 'Cuffley':
      console.log('Loading Cuffley.json...');
      fetch('../../Pages/Cuffley/Cuffley.json', { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(jsonData => {
          console.log('Cuffley.json loaded successfully.');
          updateDepartureBoard(jsonData);
        })
        .catch(error => console.error('Error loading Cuffley.json:', error));
      break;
    case 'Belmond Green':
      console.log('Loading Belmond_Green.json...');
      fetch('../../Pages/Belmond Green/Belmond_Green.json', { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(jsonData => {
          console.log('Belmond_Green.json loaded successfully.');
          updateDepartureBoard(jsonData);
        })
        .catch(error => console.error('Error loading Belmond_Green.json:', error));
      break;
    default:
      console.error('Invalid station selected');
      return;
  }
});

// Rest of the code remains the same

function updateDepartureBoard(data) {
  const destinations = data;
  const randomizedDestinations = randomizeCallingPoints(destinations);
  const callingPoints = randomizedDestinations[0].services[0].callingPoints;

  const stationsWithPoints = ['Leaton', 'Avonhill', 'Mill Bridge', 'Norrington', 'Cuffley', 'Belmond Green', 'Fleetwood', 'Ashdean', 'Victoria Docks', 'Newhurst'];
  const validStations = callingPoints.filter(point => stationsWithPoints.includes(point));
  if (validStations.length > 0) {
    currentStationWithPoints = validStations[Math.floor(Math.random() * validStations.length)];
  } else {
    currentStationWithPoints = 'That is currently under invetsigation'; // Provide a meaningful fallback
  }

  const platformsByStation = {
    'Leaton': {
      '1': { maxCoaches: 12 },
      '2': { maxCoaches: 12 },
      '3': { maxCoaches: 8 },
      '4': { maxCoaches: 8 },
      '5': { maxCoaches: 12 }
    },
    'Avonhill': {
      '1': { maxCoaches: 12 },
      '2': { maxCoaches: 12 },
      '3': { maxCoaches: 12 },
      '4': { maxCoaches: 12 },
      '5': { maxCoaches: 12 },
      '6': { maxCoaches: 12 },
      '7': { maxCoaches: 12 },
      '8': { maxCoaches: 12 },
      '9': { maxCoaches: 12 },
      '10': { maxCoaches: 12 },
      '11': { maxCoaches: 12 },
      '12': { maxCoaches: 12 },
      '13': { maxCoaches: 12 },
      '14': { maxCoaches: 12 },
      '15': { maxCoaches: 12 },
      '16': { maxCoaches: 12 }
    },
    'Mill Bridge': {
      '1': { maxCoaches: 12 },
      '2': { maxCoaches: 12 },
      '4': { maxCoaches: 12 }
    },
    'Norrington': {
      '1': { maxCoaches: 12 },
      '2': { maxCoaches: 6 },
      '3': { maxCoaches: 6 },
      '4': { maxCoaches: 12 }
    },
    'Cuffley': {
      '1': { maxCoaches: 12 },
      '2': { maxCoaches: 12 },
      '3': { maxCoaches: 12 }
    },
    'Belmond Green': {
      '1': { maxCoaches: 12 },
      '2': { maxCoaches: 12 },
      '3': { maxCoaches: 8 },
      '4': { maxCoaches: 8 }
    }
  };

  const selectedStation = document.getElementById("station-select").value;
  const platforms = platformsByStation[selectedStation];
  const platformKeys = Object.keys(platforms);

  // Filter platforms based on the number of coaches
  const numCoaches = randomizedDestinations[0].services[0].coachNumbers[Math.floor(Math.random() * randomizedDestinations[0].services[0].coachNumbers.length)];
  const validPlatforms = platformKeys.filter(platformKey => platforms[platformKey].maxCoaches >= numCoaches);

  if (validPlatforms.length > 0) {
    const randomPlatformKey = validPlatforms[Math.floor(Math.random() * validPlatforms.length)];
    currentPlatform = randomPlatformKey;
  } else {
    console.warn(`No valid platform found for ${numCoaches} coaches at ${selectedStation}.`);
    currentPlatform = 'Unknown'; // Fallback if no valid platform is found
  }

  const reasons = [
    'a points failure', 'severe weather conditions', 'damage to overhead line equipment',
    'trespassers on the track', 'staff arriving late to the depot', 'a signal failure',
    'more trains than usual needing repairs at the same time',
    'trespassers on the track earlier today', 'a signal failure earlier today',
    'a points failure earlier today', 'damage to overhead line equipment earlier today', 
    'a Shortage of train crew', 'leaves on the line', 'a track circuit failure', 
    'a fault on a train', 'a vehicle colliding with a level crossing barrier', 
    'a vehicle colliding with a bridge', 'emergency services dealing with an incident', 
    'a passenger being taken ill', 'a late running freight train', 'sheep on the line',
    'floodwater making the railway potentially unsafe', 
    'engineers dealing with a track defect', 'engineering works not being finished on-time',
    'a shortage of train conductors', 'this train being late from the depot',
    'a fault occurring when attaching part of the train', 'a speed restriction due to high track temperatures',
    'waiting for a train crew member', 'an obstruction on the track', 'Flooding',
    'a late running train being in front of this one', 'a fire next to the track', 
    'a fire next to the track earlier today', 'a broken down train', 'a problem that is currently under investigation', 
    'a problem with line-side equipment'];
  currentReason = reasons[Math.floor(Math.random() * reasons.length)];

  const destinationSpan = document.getElementById('destination');
  const departureTimeSpan = document.getElementById('time');
  const callingPointsSpan = document.getElementById('calling-points');
  const statusSpan = document.getElementById('status');

  if (randomizedDestinations[0] && randomizedDestinations[0].name) {
    destinationSpan.textContent = randomizedDestinations[0].name;
  } else {
    destinationSpan.textContent = 'Unknown';
  }

  // Get the current time
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  // Generate a random time that is within an hour of the current time and between 05:00 and 01:00
  let hours = currentHours;
  let minutes = currentMinutes;
  while (true) {
    const randomMinutes = Math.floor(Math.random() * 60); // generate a random number of minutes between 0 and 59
    minutes = currentMinutes + randomMinutes;
    if (minutes >= 60) {
      hours = currentHours + 1;
      minutes -= 60;
    }
    const randomTime = new Date();
    randomTime.setHours(hours);
    randomTime.setMinutes(minutes);
    const randomHours = randomTime.getHours();
    if (
      randomTime > currentTime &&
      randomTime - currentTime < 60 * 60 * 1000 &&
      ((randomHours >= 5 && randomHours < 24) || randomHours === 0)
    ) {
      break;
    }
  }
  const formattedHours = hours === 24 ? 0 : hours; // Convert 24 to 0 for midnight
  const time = `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  departureTimeSpan.textContent = time;
  departureTimeSpan.textContent = time;

  // Generate random status
  const status = getRandomStatus();
  statusSpan.textContent = status;

  if (callingPointsSpan && randomizedDestinations[0] && randomizedDestinations[0].services && randomizedDestinations[0].services.length > 0) {
    const serviceType = randomizedDestinations[0].services[0].serviceType;
    const coachNumbers = randomizedDestinations[0].services[0].coachNumbers;
    const numCoaches = coachNumbers[Math.floor(Math.random() * coachNumbers.length)];

    if (randomizedDestinations[0].services[0].divided) {
      const divisionPoint = randomizedDestinations[0].services[0].divisionPoint;
      const portions = randomizedDestinations[0].services[0].portions.reverse();

      let callingPointsText = '';
      callingPointsText += `${randomizedDestinations[0].services[0].callingPoints.join(', ')} and ${divisionPoint} where the train will divide. Please ensure you are travelling in the correct part of the train. Passengers for ${randomizedDestinations[0].services[0].callingPoints.join(', ')} and ${divisionPoint} may travel in any part of the train. `;
      
      const firstPortion = portions[0];
      const secondPortion = portions[1];
      
      callingPointsText += `  Passengers for ${secondPortion.callingPoints.join(', ')} and ${secondPortion.destination} should travel in the front ${secondPortion.cars} coaches of this train.`;
      callingPointsText += `  Passengers for ${firstPortion.callingPoints.join(', ')} and ${firstPortion.destination} should travel in the rear ${firstPortion.cars} coaches of this train.`;
      
      callingPointsText += ` A ${serviceType} service formed of ${numCoaches} coaches.`;
      callingPointsSpan.textContent = callingPointsText;

    } else {
      const callingPoints = randomizedDestinations[0].services[0].randomizedCallingPoints;

      if (callingPoints.length === 0) {
        const callingPointsText = `${randomizedDestinations[0].name} only. This is a ${serviceType} service formed of ${numCoaches} coaches.`;
        callingPointsSpan.textContent = callingPointsText;
      } else {
        const callingPointsText = `${callingPoints.join(', ')} and ${randomizedDestinations[0].name}. A ${serviceType} service formed of ${numCoaches} coaches.`;
        callingPointsSpan.textContent = callingPointsText;
      }
    }
  }

  // Determine when to update the board
  let updateDelay;
  if (status.match(/^\d{2}:\d{2}$/)) {
    const [statusHours, statusMinutes] = status.split(':').map(Number);
    const statusTime = new Date();
    statusTime.setHours(statusHours, statusMinutes, 0, 0);
    updateDelay = Math.max(statusTime - currentTime, 0) + 60000; // Update 1 minute after status time
  } else if (status === 'Delayed') {
    const [departureHours, departureMinutes] = departureTimeSpan.textContent.split(':').map(Number);
    const departureTime = new Date();
    departureTime.setHours(departureHours, departureMinutes, 0, 0);
    updateDelay = Math.max(departureTime - currentTime, 0) + 300000; // Update 5 minutes after departure time
  } else if (status === 'Cancelled' || status === 'On Time') {
    const [departureHours, departureMinutes] = departureTimeSpan.textContent.split(':').map(Number);
    const departureTime = new Date();
    departureTime.setHours(departureHours, departureMinutes, 0, 0);
    updateDelay = Math.max(departureTime - currentTime, 0) + 60000; // Update 1 minute after departure time
  } else {
    updateDelay = 60000; // Default to 1 minute for other statuses
  }

  // Call speakText after updating the departure board
  setTimeout(() => {
    speakText(); // Ensure TTS is triggered after DOM updates
    setTimeout(() => updateDepartureBoard(data), updateDelay); // Schedule the next update
  }, 100);
}

function updateClock() {
  console.log('Clock updated every second');
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const digits = [
    { id: 'hour-tens', value: hours[0] },
    { id: 'hour-ones', value: hours[1] },
    { id: 'minute-tens', value: minutes[0] },
    { id: 'minute-ones', value: minutes[1] },
    { id: 'second-tens', value: seconds[0] },
    { id: 'second-ones', value: seconds[1] },
  ];

  digits.forEach(({ id, value }) => {
    const digitElement = document.getElementById(id);
    if (digitElement.textContent !== value) {
      digitElement.classList.add('animate');
      setTimeout(() => {
        digitElement.textContent = value;
        digitElement.classList.remove('animate');
      }, 200);
    }
  });

  // Schedule the next update to align with the next second
  const nextUpdate = 1000 - (now.getMilliseconds());
  setTimeout(updateClock, nextUpdate);
}

updateClock();