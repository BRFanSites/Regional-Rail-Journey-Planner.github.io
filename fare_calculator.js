const stations = {
    "Abbey Road": 2,
    "Arkley": 2,
    "Ashby-in-Kirkside": 2,
    "Ashdean": 2,
    "Ashdean Bridge": 2,
    "Astley": 2,
    "Avonhill": 2,
    "Bawtry Road": 2,
    "Belmond Green": 2,
    "Broomfield": 2,
    "Cuffley": 2,
    "Elmtree House": 2,
    "Fayre": 2,
    "Fleetwood": 2,
    "Forestdale": 2,
    "Fortis Green": 2,
    "freston Junction": 2,
    "Henley Park": 2,
    "Hulme Heath": 2,
    "Ive": 2,
    "Leaton": 2,
    "Longbow": 2,
    "Longbow Beach": 2,
    "Meryon": 2,
    "Mill Bridge": 2,
    "Newhurst": 2,
    "Norrington": 2,
    "Northcote": 2,
    "Osidge Hill": 2,
    "Rosebury Park": 2,
    "Rowton": 2,
    "Russel Lane": 2,
    "St James Park": 2,
    "Stirling Street": 2,
    "Syde-On-Sea": 2,
    "Thornfield": 2,
    "Union Street": 2,
    "Victoria Docks": 2,
    "Victoria Harbour": 2,
    "Wallsend": 2,
    "Whetstone": 2,
    "Woodham": 2
  };
const increment = 0.50;

function calculateFare(origin, destination) {
  const baseFare = stations[origin];
  const numStations = Math.abs(Object.keys(stations).indexOf(origin) - Object.keys(stations).indexOf(destination));
  const fare = baseFare + (numStations * increment);
  return fare;
}

// Example usage:
const origin = "Leaton";
const destination = "Belmond";
const fare = calculateFare(origin, destination);
console.log(`The fare from ${origin} to ${destination} is $${fare.toFixed(2)}`);