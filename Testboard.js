let currentReason = ''; // Declare currentReason here
let currentStationWithPoints = ''; // Declare currentStationWithPoints here
let currentPlatform = ''; // Declare currentPlatform here

function speakText() {
  try {
    let time = document.getElementById('time').textContent;

    // Format time for speech
    if (time === '00:00') {
      time = 'midnight';
    } else if (time.startsWith('00:')) {
      const minute = time.substring(3, 5);
      time = `midnight ${minute}`;
    } else {
      const hour = parseInt(time.substring(0, 2));
      const minute = time.substring(3, 5);
      time = minute === '00' ? `${hour} hundred` : `${hour} ${minute}`;
    }

    const destination = document.getElementById('destination').textContent;
    const callingPoints = document.getElementById('calling-points').textContent;
    const status = document.getElementById('status').textContent;

    const serviceTypeMatch = callingPoints.match(/(?:A|An)\s+([\w\s]+?)\s+service/i);
    const serviceType = serviceTypeMatch ? serviceTypeMatch[1].trim() : 'unknown';

    let message = '';
    let nextTrainMessage = '';

    const currentTime = new Date();
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
          message = `We are sorry that the ${time} to ${destination}, is delayed due to a points failure ${locationMessage}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        } else if (['trespassers on the track', 'a signal failure'].includes(currentReason)) {
          const randomCallingPoint = callingPoints.split(',').map(point => point.trim())[Math.floor(Math.random() * callingPoints.split(',').length)];
          message = `We are sorry that the ${time} to ${destination}, is delayed due to ${currentReason} at ${randomCallingPoint}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        } else if (['damage to overhead line equipment'].includes(currentReason) && !['Ashdean', 'Victoria Docks, Syde-on-Sea'].includes(destination)) {
          message = `We are sorry that the ${time} to ${destination}, is delayed due to ${currentReason}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        } else {
          message = `We are sorry that the ${time} to ${destination}, is delayed due to ${currentReason}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        }
      }
      } else if (status.match(/^\d{2}:\d{2}$/)) {
        const delayedTime = status.replace(':', ' ');
        if (currentReason) {
        if (currentReason === 'a points failure') {
          message = `We are sorry that the ${time} to ${destination}, is now expected to arrive at ${delayedTime}. This is due to a points failure at ${currentStationWithPoints}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        } else if (['trespassers on the track', 'a signal failure'].includes(currentReason)) {
          const randomCallingPoint = callingPoints.split(',').map(point => point.trim())[Math.floor(Math.random() * callingPoints.split(',').length)];
          message = `We are sorry that the ${time} to ${destination}, is now expected to arrive at ${delayedTime}. This is due to ${currentReason} at ${randomCallingPoint}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        } else if (['damage to overhead line equipment'].includes(currentReason) && !['Ashdean', 'Victoria Docks, Syde-on-Sea'].includes(destination)) {
          message = `We are sorry that the ${time} to ${destination}, is now expected to arrive at ${delayedTime}. This is due to ${currentReason}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        } else {
          message = `We are sorry that the ${time} to ${destination}, is now expected to arrive at ${delayedTime}. This is due to ${currentReason}. ${serviceType} apologises for this late running, and the inconvenience this may cause you.`;
        }
        } 
      } else if (status === 'Cancelled') {
        if (currentReason) {
        if (currentReason === 'a points failure') {
          message = `We are sorry to announce that the ${time} ${serviceType} to ${destination}, has been cancelled. This is due to a points failure at ${currentStationWithPoints}. ${serviceType} apologises for the disruption to your journey today.`;
        } else if (['trespassers on the track', 'a signal failure'].includes(currentReason)) {
          const randomCallingPoint = callingPoints.split(',').map(point => point.trim())[Math.floor(Math.random() * callingPoints.split(',').length)];
          message = `We are sorry to announce that the ${time} ${serviceType} to ${destination}, has been cancelled. This is due to ${currentReason} at ${randomCallingPoint}. ${serviceType} apologises for the disruption to your journey today.`;
        } else if (['damage to overhead line equipment'].includes(currentReason) && !['Ashdean', 'Victoria Docks, Syde-on-Sea'].includes(destination)) {
          message = `We are sorry to announce that the ${time} ${serviceType} to ${destination}, has been cancelled. This is due to ${currentReason}. ${serviceType} apologises for the disruption to your journey today.`;
        } else {
          message = `We are sorry to announce that the ${time} ${serviceType} to ${destination}, has been cancelled. This is due to ${currentReason}. ${serviceType} apologises for the disruption to your journey today.`;
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
  const newTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
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
  fetch('./Avonhill.json')
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
      fetch('./Leaton.json', { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(jsonData => {
          console.log('Leaton.json loaded successfully.');
          updateDepartureBoard(jsonData);
        })
        .catch(error => console.error('Error loading Leaton.json:', error));
      break;
    case 'Avonhill':
      console.log('Loading Avonhill.json...');
      fetch('./Avonhill.json', { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(jsonData => {
          console.log('Avonhill.json loaded successfully.');
          updateDepartureBoard(jsonData);
        })
        .catch(error => console.error('Error loading Avonhill.json:', error));
      break;
    case 'Mill Bridge':
      console.log('Loading Mill_Bridge.json...');
      fetch('./Mill_Bridge.json', { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(jsonData => {
          console.log('Mill_Bridge.json loaded successfully.');
          updateDepartureBoard(jsonData);
        })
        .catch(error => console.error('Error loading Mill_Bridge.json:', error));
      break;
    case 'Norrington':
      console.log('Loading Norrington.json...');
      fetch('./Norrington.json', { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(jsonData => {
          console.log('Norrington.json loaded successfully.');
          updateDepartureBoard(jsonData);
        })
        .catch(error => console.error('Error loading Norrington.json:', error));
      break;
    case 'Cuffley':
      console.log('Loading Cuffley.json...');
      fetch('./Cuffley.json', { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(jsonData => {
          console.log('Cuffley.json loaded successfully.');
          updateDepartureBoard(jsonData);
        })
        .catch(error => console.error('Error loading Cuffley.json:', error));
      break;
    case 'Belmond Green':
      console.log('Loading Belmond_Green.json...');
      fetch('./Belmond_Green.json', { headers: { 'Content-Type': 'application/json' } })
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
      '3': { maxCoaches: 6 },
      '4': { maxCoaches: 6 },
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
  const randomPlatformKey = platformKeys[Math.floor(Math.random() * platformKeys.length)];
  currentPlatform = randomPlatformKey;

  
const reasons = [
  'a points failure', 'severe weather conditions', 'damage to overhead line equipment',
  'trespassers on the track', 'staff arriving late to the depot', 'a signal failure',
  'more trains than usual needing maintenance today',
  'trespassers on the track earlier today', 'a signal failure earlier today',
  'a points failure earlier today', 'damage to overhead line equipment earlier today', 
  'a Shortage of train crew', 'leaves on the line', 'a track circuit failure', 
  'a fault on a train', 'a vehicle colliding with a level crossing barrier', 
  'a vehicle colliding with a bridge', 'emergency services dealing with an incident', 
  'a passenger being taken ill', 'a late running freight train', 'sheep on the line'];
  currentReason = reasons[Math.floor(Math.random() * reasons.length)];

  // Removed unused displayGroup declaration
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
  
    // Generate a random time that is within an hour of the current time
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
      if (randomTime > currentTime && randomTime - currentTime < 60 * 60 * 1000) {
        break;
      }
    }

  const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
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

  // Call speakText after updating the departure board
  setTimeout(() => {
    speakText(); // Ensure TTS is triggered after DOM updates
  }, 100);
}