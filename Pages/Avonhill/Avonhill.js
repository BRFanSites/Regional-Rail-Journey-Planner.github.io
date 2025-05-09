// Get the current time
const currentTime = new Date();
const currentHours = currentTime.getHours();
const currentMinutes = currentTime.getMinutes();

// Generate random destinations, and departure times
const destinations = ['Avonhill', 'Syde-On-Sea', 'Ashdean', 'Victoria Docks', 'Mill Bridge', 'Norrington', 'Cuffley'];
const departureTimes = [];
const trainDestinations = [];
const services = [];
const callingPoints = [];
const randomizedDestinations = destinations.slice().sort(() => Math.random() - 0.5);

setInterval(() => {
  const currentTime = new Date().getTime();
  const firstDepartureTime = departureTimes[0];
  const firstDepartureTimeInMinutes = convertTimeToMinutes(firstDepartureTime);
  const currentTimeInMinutes = convertTimeToMinutes(formatTime(currentTime));
  if (currentTimeInMinutes >= firstDepartureTimeInMinutes) {
    // Push new departure time and destination
    departureTimes.shift();
    trainDestinations.shift();
    services.shift();
    callingPoints.shift();

    // Generate new departure time, destination, and service
    const lastDepartureTime = departureTimes[departureTimes.length - 1];
    const [lastHours, lastMinutes] = lastDepartureTime.split(':').map(Number);
    let newHours = lastHours;
    let newMinutes = lastMinutes + Math.floor(Math.random() * 50) + 10; // Random interval between 10 and 60 minutes
    if (newMinutes >= 60) {
      newHours += Math.floor(newMinutes / 60);
      newMinutes %= 60;
    }
    if (newHours > 23) {
      newHours = 5; // Wrap around to the next day
      newMinutes = 0;
    }
    const newDepartureTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    const newDestination = destinations[Math.floor(Math.random() * destinations.length)];
    const newService = `Service ${Math.floor(Math.random() * 1000)}`; // Example service name
    const newCallingPoints = []; // Initialize new calling points array
    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
      const newCallingPoint = `${randomizedDestinations[Math.floor(Math.random() * randomizedDestinations.length)].name}, ${Math.floor(Math.random() * 10) + 1} minutes`;
      newCallingPoints.push(newCallingPoint);
    }

    departureTimes.push(newDepartureTime);
    trainDestinations.push(newDestination);
    services.push(newService);
    callingPoints = newCallingPoints; // Update calling points array

    updateDisplay(departureTimes, trainDestinations, services, callingPoints);
  }
}, 1000); // Check every second

function convertTimeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(time) {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function updateDisplay(departureTimes, destinations, services, callingPoints) {
  console.log(`Pushed`);
  if (departureTimes.length === 0) {
    console.log('Departure times array is empty');
    return;
  }
  const displays = document.querySelectorAll('.display-group');
  for (let i = 0; i < displays.length - 1; i++) {
    const displayGroup = displays[i];
    const nextDisplayGroup = displays[i + 1];
    const departureTimeSpan = displayGroup.querySelector('.departure-time');
    const destinationSpan = displayGroup.querySelector('.destination');
    const serviceSpan = displayGroup.querySelector('.service');
    const callingPointsSpan = displayGroup.querySelector('.calling-point');

    if (departureTimeSpan) {
      departureTimeSpan.textContent = nextDisplayGroup.querySelector('.departure-time').textContent;
    }
    if (destinationSpan) {
      destinationSpan.textContent = nextDisplayGroup.querySelector('.destination').textContent;
    }
    if (serviceSpan) {
      serviceSpan.textContent = nextDisplayGroup.querySelector('.service').textContent;
    }
    if (callingPointsSpan) {
      if (callingPoints.length === 0) {
        const displayText = `Only ${destinations[i]}. A ${services[i]} service formed of ${numCoaches} coaches.`;
        callingPointsSpan.textContent = displayText;
      } else {
        const callingPointsText = callingPoints.reverse().join(', ');
        const displayText = `${callingPointsText} and ${destinations[i]}. A ${services[i]} service formed of ${numCoaches} coaches.`;
        callingPointsSpan.textContent = displayText;
      }
    }
  }
  const lastDisplayGroup = displays[displays.length - 1];
  const lastDepartureTimeSpan = lastDisplayGroup.querySelector('.departure-time');
  const lastDestinationSpan = lastDisplayGroup.querySelector('.destination');
  const lastServiceSpan = lastDisplayGroup.querySelector('.service');
  const lastCallingPointsSpan = lastDisplayGroup.querySelector('.calling-point');

  if (lastDepartureTimeSpan) {
    lastDepartureTimeSpan.textContent = departureTimes[departureTimes.length - 1];
  }
  if (lastDestinationSpan) {
    lastDestinationSpan.textContent = destinations[destinations.length - 1];
  }
  if (lastServiceSpan) {
    lastServiceSpan.textContent = services[services.length - 1];
  }
  if (lastCallingPointsSpan) {
    if (callingPoints.length === 0) {
      const displayText = `Only ${destinations[destinations.length - 1]}. A ${services[services.length - 1]} service formed of ${numCoaches} coaches.`;
      lastCallingPointsSpan.textContent = displayText;
    } else {
      const callingPointsText = callingPoints.reverse().join(', ');
      const displayText = `${callingPointsText} and ${destinations[destinations.length - 1]}. A ${services[services.length - 1]} service formed of ${numCoaches} coaches.`;
      lastCallingPointsSpan.textContent = displayText;
    }
  }
}

let hours = currentHours;
let minutes = currentMinutes;

for (let i = 0; i < 10; i++) {
  // For the first train, ensure it's after the current time
  if (i === 0) {
    hours = currentHours;
    minutes = currentMinutes + Math.floor(Math.random() * 59) + 1; // add a random minute between 1 and 60
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes %= 60;
    }
    if (hours > 23) {
      hours = 0;
    }
  } else {
    // For subsequent trains, add a random interval between 10 and 60 minutes
    const interval = Math.floor(Math.random() * 50) + 10;
    minutes += interval;
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes %= 60;
    }
    if (hours > 23) {
      hours = 5; // wrap around to the next day
      minutes = 0;
    }
  }

  // Ensure the time is between 05:00 and 23:00
  if (hours < 5) {
    hours = 5;
  } else if (hours > 23) {
    hours = 23;
  }

  // Generate a random destination that is not the same as the previous one
  let destination;
  do {
    destination = destinations[Math.floor(Math.random() * destinations.length)];
  } while (i > 0 && destination === trainDestinations[i - 1]);

  trainDestinations.push(destination);
  departureTimes.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
}

// Function to randomize calling points
function randomizeCallingPoints(destinations) {
  const randomizedDestinations = destinations.destinations.slice(); // Create a copy of the destinations array

  // Randomize the order of the destinations
  randomizedDestinations.sort(() => Math.random() - 0.5);

  randomizedDestinations.forEach(destination => {
    console.log(destination.name);

    // Randomize the order of the services for each destination
    const services = destination.services.slice(); // Create a copy of the services array
    services.sort(() => Math.random() - 0.5);

    // Assign the randomized services back to the destination
    destination.services = services;

    destination.services.forEach(service => {
      console.log(service.name);
      console.log('Original Calling Points:', service.callingPoints);
      service.callingPoints.forEach(callingPoint => {
        console.log(callingPoint);
      }); // Closing the forEach loop
      const callingPoints = service.callingPoints;
      const exceptions = service.exceptions;
      const randomizedCallingPoints = [];

      const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' });
      console.log('Day of the Week:', dayOfWeek);

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
          if (originalCallingPoint.name === 'Longbow Beach') { // Replace 'Station Name' with the actual name of the station
            const dayOfWeek = new Date().toLocaleString('en-GB', { weekday: 'long' });
            console.log('Day of the Week:', dayOfWeek);
            const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
            console.log('Is Weekend:', isWeekend);
            if (isWeekend) {
              randomizedCallingPoints.push(originalCallingPoint.name);
            }
          } else {
            if (exceptions[callingPoint] === false) {
              // never call at this station
            } else if (exceptions[callingPoint] === true) {
              // always call at this station
              randomizedCallingPoints.push(callingPoint);
            } else if (typeof exceptions[callingPoint] === 'number') {
              // call at this station with a probability
              if (Math.random() < exceptions[callingPoint]) {
                randomizedCallingPoints.push(callingPoint);
              }
            } else {
              // no exception specified, so always call at this station
              randomizedCallingPoints.push(callingPoint);
            }
          }
        }
      });
      console.log('Randomized Calling Points:', randomizedCallingPoints);
      service.randomizedCallingPoints = randomizedCallingPoints.reverse();
      console.log('Reversed Calling Points:', service.randomizedCallingPoints);
    });
  });
  return randomizedDestinations;
}
  
// Fetch the destinations data
fetch('Avonhill.json')
.then(response => response.json())
  .then(data => {
    const destinations = data;
    const randomizedDestinations = randomizeCallingPoints(destinations);

    // Use the randomized destinations in the display
    const displays = document.querySelectorAll('.display-group'); // Define displays to reference the correct DOM elements
    displays.forEach((displayGroup, index) => {
      const destinationSpan = displayGroup.querySelector('.destination');
      const departureTimeSpan = displayGroup.querySelector('.departure-time');
      const callingPointsSpan = displayGroup.querySelector('.calling-points-text span');

      if (randomizedDestinations[index] && randomizedDestinations[index].name) {
        destinationSpan.textContent = randomizedDestinations[index].name;
      } else {
        destinationSpan.textContent = 'Unknown';
      }

      if (departureTimes[index]) {
        departureTimeSpan.textContent = departureTimes[index];
      } else {
        departureTimeSpan.textContent = 'N/A';
      }

      if (callingPointsSpan && randomizedDestinations[index] && randomizedDestinations[index].services && randomizedDestinations[index].services.length > 0) {
        const callingPoints = randomizedDestinations[index].services[0].randomizedCallingPoints;
        const destination = randomizedDestinations[index].name;
        const serviceType = randomizedDestinations[index].services[0].serviceType;
        const coachNumbers = randomizedDestinations[index].services[0].coachNumbers;
        const numCoaches = coachNumbers[Math.floor(Math.random() * coachNumbers.length)];

        if (callingPoints.length === 0) {
          const displayText = `Only ${destination}. A ${serviceType} service formed of ${numCoaches} coaches.`;
          callingPointsSpan.textContent = displayText;
        } else {
          const callingPointsText = callingPoints.reverse().join(', ');
          const displayText = `${callingPointsText} and ${destination}. A ${serviceType} service formed of ${numCoaches} coaches.`;
          callingPointsSpan.textContent = displayText;
        }
      }
    });

    let currentOffset = 0; // Default timezone offset

    setInterval(function () {
      const date = new Date();
      const adjustedTime = new Date(date.getTime() + currentOffset * 60 * 60 * 1000); // Adjust time by offset in hours

      const hours = adjustedTime.getUTCHours(); // Use UTC hours to avoid local timezone interference
      const minutes = adjustedTime.getUTCMinutes();
      const seconds = adjustedTime.getUTCSeconds();

      const hoursTensFlaps = document.querySelectorAll('.hours-tens .flap');
      const hoursOnesFlaps = document.querySelectorAll('.hours-ones .flap');
      const minutesTensFlaps = document.querySelectorAll('.minutes-tens .flap');
      const minutesOnesFlaps = document.querySelectorAll('.minutes-ones .flap');
      const secondsTensFlaps = document.querySelectorAll('.seconds-tens .flap');
      const secondsOnesFlaps = document.querySelectorAll('.seconds-ones .flap');

      // Clear all active classes
      hoursTensFlaps.forEach(function (flap) {
      flap.classList.remove('active');
      });
      hoursOnesFlaps.forEach(function (flap) {
      flap.classList.remove('active');
      });
      minutesTensFlaps.forEach(function (flap) {
      flap.classList.remove('active');
      });
      minutesOnesFlaps.forEach(function (flap) {
      flap.classList.remove('active');
      });
      secondsTensFlaps.forEach(function (flap) {
      flap.classList.remove('active');
      });
      secondsOnesFlaps.forEach(function (flap) {
      flap.classList.remove('active');
      });

      // Add active class to correct flaps
      const hoursTens = Math.floor(hours / 10);
      const hoursOnes = hours % 10;
      const minutesTens = Math.floor(minutes / 10);
      const minutesOnes = minutes % 10;
      const secondsTens = Math.floor(seconds / 10);
      const secondsOnes = seconds % 10;

      if (hoursTens >= 0 && hoursTens <= 2) {
      hoursTensFlaps[hoursTens].classList.add('active');
      }
      if (hoursOnes >= 0 && hoursOnes <= 9) {
      hoursOnesFlaps[hoursOnes].classList.add('active');
      }
      if (minutesTens >= 0 && minutesTens <= 5) {
      minutesTensFlaps[minutesTens].classList.add('active');
      }
      if (minutesOnes >= 0 && minutesOnes <= 9) {
      minutesOnesFlaps[minutesOnes].classList.add('active');
      }
      if (secondsTens >= 0 && secondsTens <= 5) {
      secondsTensFlaps[secondsTens].classList.add('active');
      }
      if (secondsOnes >= 0 && secondsOnes <= 9) {
      secondsOnesFlaps[secondsOnes].classList.add('active');
      }
    }, 1000);

    const timeZone = document.getElementById('Timezone');
    const timeZoneOffsets = {
      honolulu: -10, // UTC -10
      los_angeles: -8, // UTC -8
      denver: -7, // UTC -7
      chicago: -6, // UTC -6
      new_york: -5, // UTC -5
      london: 0, // UTC +0
      paris: 1, // UTC +1
      athens: 2, // UTC +2
      moscow: 3, // UTC +3
      dubai: 4, // UTC +4
      delhi: 5.5, // UTC +5:30
      bangkok: 7, // UTC +7
      beijing: 8, // UTC +8
      tokyo: 9, // UTC +9
      sydney: 10, // UTC +10
      auckland: 12, // UTC +12
    };

    timeZone.addEventListener('change', function () {
      const selectedStation = timeZone.value;
      currentOffset = timeZoneOffsets[selectedStation] || 0; // Update the current offset
    });
  });