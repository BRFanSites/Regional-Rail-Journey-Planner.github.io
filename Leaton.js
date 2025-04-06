// Get the current time
const currentTime = new Date();
const currentHours = currentTime.getHours();
const currentMinutes = currentTime.getMinutes();

// Generate random destinations, and departure times
const destinations = ['Avonhill', 'Syde-On-Sea', 'Ashdean', 'Victoria Docks', 'Mill Bridge', 'Norrington', 'Cuffley'];
const departureTimes = [];
const trainDestinations = [];


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
fetch('Leaton.json')
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
    
      if (callingPointsSpan && randomizedDestinations[0] && randomizedDestinations[0].services && randomizedDestinations[0].services.length > 0) {
        const serviceType = randomizedDestinations[index].services[0].serviceType;
        const coachNumbers = randomizedDestinations[index].services[0].coachNumbers;
        const numCoaches = coachNumbers[Math.floor(Math.random() * coachNumbers.length)];
        const callingPoints = randomizedDestinations[index].services[0].randomizedCallingPoints;
        
        if (callingPoints.length === 0) {
          const callingPointsText = `Only ${randomizedDestinations[0].name}. This is a ${serviceType} service formed of ${numCoaches} coaches.`;
          callingPointsSpan.textContent = callingPointsText;
        } else {
          const callingPointsText = `${callingPoints.reverse().join(', ')} and ${randomizedDestinations[0].name}. A ${serviceType} service formed of ${numCoaches} coaches.`;
          callingPointsSpan.textContent = callingPointsText;
        }
      }
    });

    setInterval(function() {
      var date = new Date();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
    
      console.log('Hours:', hours);
      console.log('Minutes:', minutes);
      console.log('Seconds:', seconds);
    
      var hoursTensFlaps = document.querySelectorAll('.hours-tens .flap');
      var hoursOnesFlaps = document.querySelectorAll('.hours-ones .flap');
      var minutesTensFlaps = document.querySelectorAll('.minutes-tens .flap');
      var minutesOnesFlaps = document.querySelectorAll('.minutes-ones .flap');
      var secondsTensFlaps = document.querySelectorAll('.seconds-tens .flap');
      var secondsOnesFlaps = document.querySelectorAll('.seconds-ones .flap');
    
      // Clear all active classes
      hoursTensFlaps.forEach(function(flap) {
        flap.classList.remove('active');
      });
      hoursOnesFlaps.forEach(function(flap) {
        flap.classList.remove('active');
      });
      minutesTensFlaps.forEach(function(flap) {
        flap.classList.remove('active');
      });
      minutesOnesFlaps.forEach(function(flap) {
        flap.classList.remove('active');
      });
      secondsTensFlaps.forEach(function(flap) {
        flap.classList.remove('active');
      });
      secondsOnesFlaps.forEach(function(flap) {
        flap.classList.remove('active');
      });
    
      // Add active class to correct flaps
      var hoursTens = Math.floor(hours / 10);
      var hoursOnes = hours % 10;
      var minutesTens = Math.floor(minutes / 10);
      var minutesOnes = minutes % 10;
      var secondsTens = Math.floor(seconds / 10);
      var secondsOnes = seconds % 10;
    
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
  });