let routes;
const increment = 0.05;

fetch('https://www.regionalrail.co.uk/Intercity_routes.json')
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
      function findRoute(from, to, routes) {
              const fromStationNormalized = from.trim().replace(/\s+/g, ' ');
              const toStationNormalized = to.trim().replace(/\s+/g, ' ');
              
            
              console.log('Routes inside findRoute function:', data.routes);
              console.log('Routes length:', data.routes.length);
            
              for (var i = 0; i < data.routes.length; i++) {
                const route = data.routes[i];
                if (route && route.callingPoints) {
                  console.log('Calling points:', route.callingPoints);
                  console.log('Route Type:', route.routeType);
                  console.log('From station:', fromStationNormalized);
                  console.log('To station:', toStationNormalized);
                  console.log('Id:', route.id);
            
                  const fromIndex = route.callingPoints.indexOf(fromStationNormalized);
                  const toIndex = route.callingPoints.indexOf(toStationNormalized);
                  console.log('From index:', fromIndex);
                  console.log('To index:', toIndex);
            
                  if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
                    console.log('Found a route!');
                    const routeCallingPoints = route.callingPoints.slice(fromIndex, toIndex + 1);
            
                    const routeData = {
                      routeType: route.routeType,
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
      
        const stationInfo = {
          "Wallsend": "(Limited Stop)",
          "Norrington": "(Limited Stop)",
          "Hulme Heath": "(Limited Stop)",
          "Leaton": "(Limited Stop)",
          "Fortis Green": "(Limited Stop)",
          "Abbey Road": "(Limited Stop)",
          "Fleetwood": "(Limited Stop)",
          // Add more station names and their corresponding additional information here
        };
      
        if (searchForm && journeyInfo && container) {
          searchForm.style.display = 'none';
          journeyInfo.style.display = 'block';
          container.style.backgroundColor = '#0077ff';
          container.style.opacity = 0.9;
          container.style.color = '#fff';
      
          const routeType = document.getElementById('route-type');
          console.log('Route Type Element:', routeType);
          const fromStationName = document.getElementById('from-station-name');
          const toStationName = document.getElementById('to-station-name');
          const callingPoints = document.getElementById('calling-points');
          const price = document.getElementById('price');
      
          if (DepartureTime && ArrivalTime) {
            DepartureTime.textContent = route.departureTime || 'N/A';
            ArrivalTime.textContent = route.arrivalTime || 'N/A';
          }
      
          if (fromStationName && toStationName && callingPoints && price && routeType) {
            const fromStationText = stationInfo[route.from];
            const toStationText = stationInfo[route.to];
      
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
            console.log('Route Type:', route.routeType);
            routeType.textContent = route.routeType;
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
