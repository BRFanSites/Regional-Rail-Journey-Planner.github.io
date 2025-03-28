let routes;

fetch('https://RionPlaysTV.github.io/Regional-Rail-Journey-Planner.github.io/routes.json')
  .then(response => response.json())
  .then(data => {
    routes = data.routes;
  });

// Add event listener to plan journey button
const planJourneyButton = document.querySelector('.button');

if (planJourneyButton) {
  planJourneyButton.addEventListener('click', () => {
    const startStationInput = document.querySelector('#from-station');
    const endStationInput = document.querySelector('#to-station');

    const fromStation = startStationInput.value;
    const toStation = endStationInput.value;

    console.log('From station:', fromStation);
    console.log('To station:', toStation);

    if (fromStation && toStation) {
      planJourney(fromStation, toStation);
    } else {
      console.error('Please enter both start and end stations');
    }
  });
} else {
  console.error('Plan journey button not found');
}

function planJourney(fromStation, toStation) {
  if (!routes) {
    console.error('No routes data available');
    return;
  }

  function findRoute(from, to) {
    console.log('Routes:', routes);
    for (const route of routes) {
      const callingPoints = route.callingPoints;
      const fromIndex = callingPoints.indexOf(from);
      const toIndex = callingPoints.indexOf(to);
  
      if (fromIndex === 0 && toIndex !== -1) {
        const routeCallingPoints = callingPoints.slice(1, toIndex + 1);
  
        return {
          from: from,
          to: to,
          callingPoints: routeCallingPoints,
        };
      } else if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
        const routeCallingPoints = callingPoints.slice(fromIndex, toIndex + 1);
  
        return {
          from: from,
          to: to,
          callingPoints: routeCallingPoints,
        };
      }
    }
  
    return null;
  }

  const route = findRoute(fromStation, toStation);

  if (route) {
    console.log(`Route from ${route.from} to ${route.to}:`);
    console.log(route.callingPoints);
  } else {
    console.log(`No route found from ${fromStation} to ${toStation}`);
  }
}