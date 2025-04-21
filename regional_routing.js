let routes;
const increment = 0.25;

fetch('https://www.regionalrail.co.uk/regional_routes.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Data:', data);
    // Normalize calling points in routes for consistent comparison
    if (data && Array.isArray(data.routes)) {
      routes = data.routes.map(route => ({
        ...route,
        callingPoints: route.callingPoints.map(cp => cp.trim().toLowerCase())
      }));
    } else {
      console.error('Fetched data does not contain a valid routes array:', data);
      routes = []; // Set routes to an empty array to avoid further errors
      return; // Exit the function to prevent further processing
    }

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
          const route = findRoute(fromStation, toStation, routes);

          if (route) {
            console.log(route.callingPoints);
            const cost = route.callingPoints.length / increment; // Example cost calculation
            showJourneyInfo(route, cost);
          } else {
            console.log(`No route found from ${fromStation} to ${toStation}`);
          }
        } else {
          console.error('Please enter both start and end stations');
        }
      });
    } else {
      console.error('Plan journey button not found');
    }

    function findRoute(fromStation, toStation, routes) {
      let fromStationNormalized = fromStation.trim().toLowerCase().replace(/\s+/g, ' ');
      let toStationNormalized = toStation.trim().toLowerCase().replace(/\s+/g, ' ');
      console.log('Finding route from', fromStation, 'to', toStation);

      console.log('Normalized from station:', fromStationNormalized);
      console.log('Normalized to station:', toStationNormalized);

      for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        console.log('Checking route', i, route);

        if (route && route.callingPoints) {
          console.log('Checking calling points', route.callingPoints);

          const fromIndex = route.callingPoints.findIndex(cp => cp === fromStationNormalized);
          const toIndex = route.callingPoints.findIndex(cp => cp === toStationNormalized);

          console.log('From index:', fromIndex);
          console.log('To index:', toIndex);

          if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
            console.log('Found a route!');

            const routeCallingPoints = route.callingPoints.slice(fromIndex, toIndex + 1);

            const routeData = {
              routeType: route.routeType,
              from: fromStation,
              to: toStation,
              callingPoints: routeCallingPoints,
            };

            return routeData;
          } else {
            console.log('No route found');
          }
        } else {
          console.log('Invalid route object');
        }
      }

      console.log('No route found');
      return null;
    }

    function showJourneyInfo(route, cost) {
      const searchForm = document.getElementById('search-form');
      const journeyInfo = document.getElementById('journey-info');
      const container = document.getElementsByClassName('container')[0];

      const stationInfo = {
        "Bawtry Road": "(Limited Stop)",
        "Stirling Street": "(Limited Stop)",
        "Ive": "(Limited Stop)",
        "Arkley": "(Limited Stop)",
        "Ashdean Bridge": "(Request Stop)",
        "Broomfield": "(Towards Meryon Only)",
        "Longbow Beach": "(Weekends Only)",
        // Add more station names and their corresponding additional information here
      };

      if (searchForm && journeyInfo && container) {
        searchForm.style.display = 'none';
        journeyInfo.style.display = 'block';
        container.style.backgroundColor = '#0077ff';
        container.style.opacity = 0.9;
        container.style.color = '#fff';

        const routeType = document.getElementById('route-type');
        const fromStationName = document.getElementById('from-station-name');
        const toStationName = document.getElementById('to-station-name');
        const callingPoints = document.getElementById('calling-points');
        const price = document.getElementById('price');

        if (fromStationName && toStationName && callingPoints && price && routeType) {
          const fromStationText = stationInfo[route.from];
          const toStationText = stationInfo[route.to];
          const routeTypeText = stationInfo[route.routeType];

          if (fromStationText) {
            fromStationName.textContent = `${route.from} ${fromStationText}`;
          } else {
            fromStationName.textContent = route.from;
          }

          if (toStationText) {
            toStationName.textContent = `${route.to} ${toStationText}`;
          } else {
            toStationName.textContent = route.to;
          }

          callingPoints.innerHTML = route.callingPoints.slice(1).map(station => {
            const stationText = stationInfo[station];
            if (stationText) {
              return `<li>${station} ${stationText}</li>`;
            } else {
              return `<li>${station}</li>`;
            }
          }).join('');

          price.textContent = `£${cost.toFixed(2)}`;
          routeType.textContent = routeTypeText || route.routeType;
        } else {
          console.log('Error: one or more required elements not found');
        }
      } else {
        console.log('Error: search form or journey info element not found');
      }
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
