function speakText() {
  try {
    var time = document.getElementById('time').textContent;
    var destination = document.getElementById('destination').textContent;
    var callingPoints = document.getElementById('calling-points').textContent;
    var message = 'The ' + time + ' to ' + destination + ' calling at ' + callingPoints;
    var utterance = new SpeechSynthesisUtterance(message);
    var voice = window.speechSynthesis.getVoices().find(function(voice) {
      return voice.lang === 'en-GB' && voice.name.includes('Female');
    });
    utterance.voice = voice;
    utterance.lang = 'en-GB';
    utterance.rate = 0.75;
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

let hours = currentHours;
let minutes = currentMinutes;

for (let i = 0; i < 10; i++) {
  if (i === 0) {
    hours = currentHours;
    minutes = currentMinutes + Math.floor(Math.random() * 59) + 1;
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes %= 60;
    }
    if (hours > 23) {
      hours = 0;
    }
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

  if (hours < 5) {
    hours = 5;
  } else if (hours > 23) {
    hours = 23;
  }

  let destination;
  do {
    destination = destinations[Math.floor(Math.random() * destinations.length)];
  } while (i > 0 && destination === trainDestinations[i - 1]);

  trainDestinations.push(destination);
  departureTimes.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
}

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
  const statuses = ["On Time", "Delayed", "Random Time"];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  const status = statuses[randomIndex];

  if (status === "Random Time") {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return time;
  } else {
    return status;
  }
}

const statusElement = document.getElementById('status');
statusElement.textContent = getRandomStatus();

// Fetch the destinations data
fetch('Leaton.json')
  .then(response => response.json())
  .then(data => {
    const destinations = data;
    const randomizedDestinations = randomizeCallingPoints(destinations);

    const displayGroup = document.querySelector('.departure');
    const destinationSpan = document.getElementById('destination');
    const departureTimeSpan = document.getElementById('time');
    const callingPointsSpan = document.getElementById('calling-points');

    if (randomizedDestinations[0] && randomizedDestinations[0].name) {
      destinationSpan.textContent = randomizedDestinations[0].name;
    } else {
      destinationSpan.textContent = 'Unknown';
    }

    if (departureTimes[0]) {
      departureTimeSpan.textContent = departureTimes[0];
    } else {
      departureTimeSpan.textContent = 'N/A';
    }

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
  })
  .catch(error => console.error('Error fetching destinations:', error));