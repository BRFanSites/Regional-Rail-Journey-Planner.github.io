// Get the guess input fields
const guessFields = document.querySelectorAll('.guess');
const currentDate = new Date();
// Get the current date in YYYY-MM-DD format
const today = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;

// Get the list of stations
let stations = [];

// Fetch the station data from the JSON file
fetch('Unknown.json')
  .then(response => response.json())
  .then(data => {
    stations = data.Stations || [];
    // Get the current date
    const currentDate = new Date();
    const today = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;

    // Check if the user has already played today
    const playedToday = localStorage.getItem(`played-${today}`);
    if (playedToday === 'true') {
      // User has already played today, disable the game
      guessFields.forEach((field) => field.readOnly = true);
      alert('You have already played today. Try again tomorrow!');
    } else {
      // User has not played today, generate a random station
      const randomStation = stations[Math.floor(Math.random() * stations.length)];
      localStorage.setItem(`station-${today}`, randomStation);
      console.log('Answer Station:', localStorage.getItem(`station-${today}`));

      // Initialize the current guess index
      // Removed unused currentGuessIndex declaration

      // Function to check the guess
      guessFields.forEach((field, index) => {
        field.readOnly = index > 0;
        field.addEventListener('keypress', (event) => {
          if (event.key === 'Enter') {
            if (field.value.trim() !== '') {
              checkGuess(field); // Pass the current field to the checkGuess function
            }
          }
        });
      });
    }
  })
  .catch(error => {
    console.error('Error loading stations:', error);
  });

function checkGuess(field) {
  // Get the current guess index
  let currentGuessIndex = Array.prototype.indexOf.call(guessFields, field);

  if (guessFields[currentGuessIndex]) {
    const guess = guessFields[currentGuessIndex].value.toUpperCase();
    const storedStation = localStorage.getItem(`station-${today}`);
    const distance = calculateDistance(guess, storedStation);
    if (distance === 'Invalid station') {
      // Display the distance
      const distanceElement = document.createElement('span');
      distanceElement.textContent = `Distance: Not a valid station`;
      guessFields[currentGuessIndex].parentElement.appendChild(distanceElement);
    } else if (distance === 0) {
      // Win condition
      alert('Congratulations! You won!');
      // Disable all guess fields
      guessFields.forEach((field) => field.readOnly = true);
      localStorage.setItem(`played-${today}`, 'true');
    } else {
      // Display the distance
      const distanceElement = document.createElement('span');
      distanceElement.textContent = `Distance: ${distance} units`;
      guessFields[currentGuessIndex].parentElement.appendChild(distanceElement);
      // Unlock the next guess field
      currentGuessIndex++;
      if (currentGuessIndex < guessFields.length) {
        guessFields[currentGuessIndex].readOnly = false;
      }
    }
  }
}

  // Function to calculate the distance between two stations
  function calculateDistance(guess, answer) {
    const graph = {
      // updated graph goes here
      "Cuffley": ["Ashby-In-Kirkside"],
      "Ashby-In-Kirkside": ["Cuffley", "Wallsend"],
      "Wallsend": ["Ashby-In-Kirkside", "Ive"],
      "Ive": ["Wallsend", "Norrington"],
      "Norrington": ["Ive", "Stirling Street"],
      "Stirling Street": ["Norrington", "Hulme Heath"],
      "Hulme Heath": ["Stirling Street", "Astley"],
      "Astley": ["Hulme Heath", "Forestdale"],
      "Forestdale": ["Astley", "Freston Junction"],
      "Freston Junction": ["Forestdale", "St James Park"],
      "St James Park": ["Freston Junction", "Leaton"],
      "Leaton": ["St James Park", "Bawtry road", "Henley Park", "Meryon"],
      "Bawtry road": ["Leaton", "Woodham"],
      "Woodham": ["Bawtry road", "Belmond Green"],
      "Belmond Green": ["Woodham", "Rowton"],
      "Rowton": ["Belmond Green", "Fleetwood"],
      "Fleetwood": ["Rowton", "Thornfield"],
      "Thornfield": ["Fleetwood", "Union Street"],
      "Union Street": ["Thornfield", "Avonhill"],
      "Avonhill": ["Union Street"],

      "Mill Bridge": ["Northcote"],
      "Northcote": ["Mill Bridge", "Elmtree House"],
      "Elmtree House": ["Northcote", "Fortis Green"],
      "Fortis Green": ["Elmtree House", "Henley Park"],
      "Henley Park": ["Fortis Green", "Leaton"],

      "Meryon": ["Leaton", "Whetstone"],
      "Whetstone": ["Meryon", "Abbey Road"],
      "Abbey Road": ["Whetstone", "Longbow Beach", "Rosebury Park"],
      "Longbow Beach": ["Abbey Road", "Victoria Docks"],
      "Victoria Docks": ["Longbow Beach", "Newhurst", "Victoria Harbour"],
      "Newhurst": ["Victoria Docks", "Syde-On-Sea"],
      "Syde-On-Sea": ["Newhurst"],

      "Longbow": ["Abbey Road", "Russell lane"],
      "Russell lane": ["Longbow", "Osidge Hill"],
      "Osidge Hill": ["Russell lane", "Ashdean Bridge"],
      "Ashdean Bridge": ["Osidge Hill", "Ashdean"],
      "Ashdean": ["Ashdean Bridge"],

      "Rosebury Park": ["Abbey Road", "Arkley"],
      "Arkley": ["Rosebury Park", "Fayre"],
      "Fayre": ["Arkley"],

      "Broomfield": ["Russell lane"],
    };
  
    const guessStation = guess;
    const answerStation = answer;
  
    // Create a queue to hold the stations to visit
    const queue = [[guessStation, 0]]; // [station, distance]
  
    // Create a set to keep track of visited stations
    const visited = new Set();
  
    while (queue.length > 0) {
      const [currentStation, distance] = queue.shift();
  
      // If we've already visited this station, skip it
      if (visited.has(currentStation)) {
        continue;
      }
  
      // Mark this station as visited
      visited.add(currentStation);
  
      // If this is the answer station, return the distance
      if (currentStation === answerStation) {
        return distance;
      }
  
      // Add the neighbors of this station to the queue
      if (graph[currentStation]) {
        for (const neighbor of graph[currentStation]) {
          queue.push([neighbor, distance + 1]);
        }
      }
    }
  
    // If we've reached this point, it means the answer station is not reachable from the guess station
    return 'Not reachable';
  }
