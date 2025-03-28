let routes;

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
        console.log('Routes inside findRoute function:', routes);
        for (var i = 0; i < routes.length; i++) {
          const route = routes[i];
          const callingPoints = route.callingPoints;
          const fromIndex = callingPoints.indexOf(from);
          const toIndex = callingPoints.indexOf(to);
          console.log('From index:', fromIndex);
          console.log('To index:', toIndex);

          if (fromIndex === 0 && toIndex !== -1) {
            const routeCallingPoints = callingPoints.slice(1, toIndex + 1);

            const routeData = {
              from: from,
              to: to,
              callingPoints: routeCallingPoints,
            };

            // Put the JavaScript code block here
            showJourneyInfo(routeData);

            return routeData;
          } else if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
            const routeCallingPoints = callingPoints.slice(fromIndex, toIndex + 1);

            const routeData = {
              from: from,
              to: to,
              callingPoints: routeCallingPoints,
            };

            // Put the JavaScript code block here
            showJourneyInfo(routeData);

            return routeData;
          }
        }

        return null;
      }

      // Define the showJourneyInfo function here
      function showJourneyInfo(route) {
        const searchForm = document.querySelector('.search-form');
        const journeyInfo = document.querySelector('.journey-info');

        searchForm.style.display = 'none';
        journeyInfo.style.display = 'block';

        const fromStation = document.querySelector('.from-station');
        const toStation = document.querySelector('.to-station');
        const journeyStations = document.querySelector('.journey-stations');

        fromStation.textContent = route.from;
        toStation.textContent = route.to;
        journeyStations.innerHTML = route.callingPoints.map(station => `<li>${station}</li>`).join('');
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