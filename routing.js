let routes;
const stations = {
  "Abbey Road": 1,
  "Arkley": 1,
  "Ashby-in-Kirkside": 1,
  "Ashdean": 1,
  "Ashdean Bridge": 1,
  "Astley": 1,
  "Avonhill": 1,
  "Bawtry Road": 1,
  "Belmond Green": 1,
  "Broomfield": 1,
  "Cuffley": 1,
  "Elmtree House": 1,
  "Fayre": 1,
  "Fleetwood": 1,
  "Forestdale": 1,
  "Fortis Green": 1,
  "Freston Junction": 1,
  "Henley Park": 1,
  "Hulme Heath": 1,
  "Ive": 1,
  "Leaton": 1,
  "Longbow": 1,
  "Longbow Beach": 1,
  "Meryon": 1,
  "Mill Bridge": 1,
  "Newhurst": 1,
  "Norrington": 1,
  "Northcote": 1,
  "Osidge Hill": 1,
  "Rosebury Park": 1,
  "Rowton": 1,
  "Russel Lane": 1,
  "St James Park": 1,
  "Stirling Street": 1,
  "Syde-On-Sea": 1,
  "Thornfield": 1,
  "Union Street": 1,
  "Victoria Docks": 1,
  "Victoria Harbour": 1,
  "Wallsend": 1,
  "Whetstone": 1,
  "Woodham": 1
};
const increment = 0.25;

fetch('https://www.regionalrail.co.uk/routes.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Data:', data);
    const routes = data;

    // Add event listener to plan journey button
    const planJourneyButton = document.querySelector('.button');

    if (planJourneyButton) {
      planJourneyButton.addEventListener('click', () => {
        const startStationInput = document.querySelector('#from-station');
        const endStationInput = document.querySelector('#to-station');

        const fromStation = startStationInput.value;
        const toStation = endStationInput.value;
        console.log('From Station:', fromStation);
        console.log('To Station:', toStation);

        if (fromStation && toStation) {
          planJourney(fromStation, toStation, routes);
        } else {
          console.error('Please enter both start and end stations');
        }
      });
    } else {
      console.error('Plan journey button not found');
    }

    function planJourney(fromStation, toStation, routes) {
      function findRoute(from, to) {
        console.log('Routes inside findRoute function:', data.routes);
        console.log('Routes length:', data.routes.length);

        for (var i = 0; i < data.routes.length; i++) {
          const route = data.routes[i];
          if (route && route.callingPoints) {
            console.log('Calling points:', route.callingPoints);
            console.log('From station:', from);
            console.log('To station:', to);

            const fromIndex = route.callingPoints.indexOf(from);
            const toIndex = route.callingPoints.indexOf(to);
            console.log('From index:', fromIndex);
            console.log('To index:', toIndex);

            if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
              console.log('Found a route!');
              const routeCallingPoints = route.callingPoints.slice(fromIndex, toIndex + 1);

              const routeData = {
                from: from,
                to: to,
                callingPoints: routeCallingPoints,
              };

              function calculateFare(fromIndex, toIndex) {
                const numStations = Math.abs(toIndex - fromIndex);
                console.log('Number of stations:', numStations);
                const cost = numStations / increment;
                console.log('Calculated Fare:', cost);
                return cost;
              }

              const fare = calculateFare(fromIndex, toIndex);
              console.log('Calculated Fare:', fare);
              showJourneyInfo(routeData, fare);

              return routeData;
            } else {
              console.log('No route found');
            }
          } else {
            console.log('Invalid route object');
          }
        }

        console.log('Outside for loop');
        return null;
      }

     

      // Define the showJourneyInfo function here
      function showJourneyInfo(route, cost) {
        const searchForm = document.getElementById('search-form');
        const journeyInfo = document.getElementById('journey-info');
        const container = document.getElementsByClassName('container')[0];
    
        if (searchForm && journeyInfo && container) {
            searchForm.style.display = 'none';
            journeyInfo.style.display = 'block';
            container.style.backgroundColor = '#0077ff';
            container.style.opacity = 0.9;
            container.style.color = '#fff';
    
            const DepartureTime = document.getElementById('departure-time');
            const ArrivalTime = document.getElementById('arrival-time');
            const fromStationName = document.getElementById('from-station-name');
            const toStationName = document.getElementById('to-station-name');
            const callingPoints = document.getElementById('calling-points');
            const price = document.getElementById('price'); // ✅ Keep original name
    
            if (DepartureTime && ArrivalTime) {
                DepartureTime.textContent = route.departureTime || 'N/A';
                ArrivalTime.textContent = route.arrivalTime || 'N/A';
            }
    
            if (fromStationName && toStationName && callingPoints && price) {
                fromStationName.textContent = route.from;
                toStationName.textContent = route.to;
                callingPoints.innerHTML = route.callingPoints.slice(1).map(station => `<li>${station}</li>`).join('');
                
                // ✅ Patch fare into price element, rounding to 2 decimal places
                price.textContent = `£${cost.toFixed(2)}`;
            } else {
                console.log('Error: one or more required elements not found');
            }
        } else {
            console.log('Error: search form or journey info element not found');
        }
    }
    

      const route = findRoute(fromStation, toStation);

      if (route) {
        console.log(`Route from ${route.from} to ${route.to}:`);
        console.log(route.callingPoints);
      } else {
        console.log(`No route found from ${fromStation} to ${toStation}`);
      }
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });