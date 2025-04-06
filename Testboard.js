function speakText() {
  try {
    var time = document.getElementById('time').textContent;
    //time = "00:00"; // Set a fixed time for testing
    if (time === '00:00') {
      time = 'midnight';
    } else if (time.startsWith('00:')) {
      var minute = time.substring(3, 5); // Extract the minute value
      time = 'midnight ' + minute;
    } else {
      if (time.startsWith('0')) {
        var hour = time.substring(1, 2);
        var minute = time.substring(3, 5);
        if (minute === '00') {
          time = 'o ' + hour + ' hundred';
        } else {
          time = 'o ' + hour + ' ' + minute;
        }
      } else {
        var hour = time.substring(0, 2);
        var minute = time.substring(3, 5);
        if (minute === '00') {
          time = hour + ' hundred';
        } else {
          time = hour + ' ' + minute;
        }
      }
    }
    var destination = document.getElementById('destination').textContent;
    var callingPoints = document.getElementById('calling-points').textContent;
    var status = document.getElementById('status').textContent; // get the status text

    // Extract the service type from the calling points text
    var serviceType = callingPoints.match(/(A|An) (\w+) service/)[2];

    var message = '';
    if (status === 'On Time') {
      message = 'The ' + time + ' to ' + destination + ' calling at ' + callingPoints;
    } else if (status === 'Delayed') {
      message = 'We are sorry that the ' + time + ' ' + serviceType + ' to ' + destination + ' is delayed. ' + serviceType + ' apologises for this late running, and the inconvenience this may cause you.';
    } else if (status.match(/^\d{2}:\d{2}$/)) {
      var delayedTime = status.replace(':', ' '); // Remove the colon
      message = 'We are sorry that the ' + time + ' to ' + destination + ' is now expected to arrive at ' + delayedTime + '. ' + serviceType + ' apologises for this late running, and the inconvenience this may cause you.';
    } else if (status === 'Cancelled') {
      message = 'We are sorry to announce that the ' + time + ' ' + serviceType + ' to ' + destination + ' has been cancelled. ' + serviceType + ' apologises for the disruption to your journey today.';
    }

    var utterance = new SpeechSynthesisUtterance(message);
    var voice = window.speechSynthesis.getVoices().find(function(voice) {
      return voice.lang === 'en-GB' && voice.name.includes('Female');
    });
    utterance.voice = voice;
    utterance.lang = 'en-GB';
    utterance.rate = 0.6;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('Error speaking text:', error);
  }
}
setInterval(speakText, 300000);

function testTTS() {
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
          const originalCallingPoint = service.callingPoints[index];
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
        }
      });
      service.randomizedCallingPoints = randomizedCallingPoints.reverse();
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
  const newHours = departureHours + randomHours + Math.floor((departureMinutes + randomMinutes) / 60); // add any extra hours
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

  const displayGroup = document.querySelector('.departure');
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

// Generate a random time that is after the current time
let hours = currentHours;
let minutes = currentMinutes;
while (true) {
  hours = Math.floor(Math.random() * 24 - 1);
  minutes = Math.floor(Math.random() * 60);
  const randomTime = new Date();
  randomTime.setHours(hours);
  randomTime.setMinutes(minutes);
  if (randomTime > currentTime && (hours >= 5 || (hours < 5 && minutes < 30))) {
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
    const callingPoints = randomizedDestinations[0].services[0].randomizedCallingPoints;
    
    if (callingPoints.length === 0) {
      const callingPointsText = `Only ${randomizedDestinations[0].name}. This is a ${serviceType} service formed of ${numCoaches} coaches.`;
      callingPointsSpan.textContent = callingPointsText;
    } else {
      const callingPointsText = `${callingPoints.reverse().join(', ')} and ${randomizedDestinations[0].name}. A ${serviceType} service formed of ${numCoaches} coaches.`;
      callingPointsSpan.textContent = callingPointsText;
    }
  }

  // Call speakText after updating the departure board
  setTimeout(speakText, 100); // add a small delay to ensure the elements have been updated
}